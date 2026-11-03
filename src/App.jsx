import { useEffect, useState } from 'react'
import { configurado } from './firebase'
import {
  iniciarSesion, escucharPaletas, agregarPaleta, actualizarPaleta, eliminarPaleta,
} from './services/palettes'
import Home from './components/Home'
import Creacion from './components/Creacion'
import Testeo from './components/Testeo'
import Explorar from './components/Explorar'
import './App.css'

const MENU = [
  ['home', 'Home'],
  ['coleccion', 'Creación de paletas'],
  ['combinar', 'Combinaciones'],
  ['mundo', 'Ropa y ambientes'],
  ['explorar', 'Ideas para paletas'],
]

export default function App() {
  const [uid, setUid] = useState(null)
  const [paletas, setPaletas] = useState([])
  const [cargando, setCargando] = useState(configurado)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [vista, setVista] = useState('home')
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!configurado) return
    let activo = true
    let cortar = () => {}
    iniciarSesion()
      .then((cred) => {
        if (!activo) return
        setUid(cred.user.uid)
        cortar = escucharPaletas(
          cred.user.uid,
          (lista) => { setPaletas(lista); setCargando(false) },
          (e) => { setError(e.message); setCargando(false) }
        )
      })
      .catch((e) => { setError(e.message); setCargando(false) })
    return () => { activo = false; cortar() }
  }, [])

  // El menú de celular se cierra con Escape
  useEffect(() => {
    const tecla = (e) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [])

  const irA = (id) => {
    setVista(id)
    setMenu(false)
    window.scrollTo({ top: 0 })
  }

  const mostrarAviso = (texto, ms = 2500) => {
    setAviso(texto)
    setTimeout(() => setAviso(''), ms)
  }

  // Ejecuta una operación con Firestore, muestra el aviso y devuelve true si salió bien
  async function ejecutar(accion, mensaje) {
    try {
      await accion()
      setError('')
      mostrarAviso(mensaje)
      return true
    } catch (e) {
      setError(e.message)
      return false
    }
  }

  const guardarPaleta = (datos) => ejecutar(
    () => agregarPaleta(uid, { status: 'idea', favorite: false, ...datos }),
    'Paleta guardada')
  const editarPaleta = (id, cambios) => ejecutar(
    () => actualizarPaleta(uid, id, cambios),
    'Paleta actualizada')
  const alternarFavorita = (p) => ejecutar(
    () => actualizarPaleta(uid, p.id, { favorite: !p.favorite }),
    p.favorite ? 'Quitada de favoritas' : 'Agregada a favoritas')
  const aprobar = (p) => {
    const aprobada = p.status === 'aprobada'
    return ejecutar(
      () => actualizarPaleta(uid, p.id, { status: aprobada ? 'prueba' : 'aprobada' }),
      aprobada ? 'Aprobación quitada' : 'Paleta aprobada')
  }
  const eliminar = (id) => ejecutar(() => eliminarPaleta(uid, id), 'Paleta eliminada')

  const copiar = (hex) =>
    navigator.clipboard.writeText(hex).then(() => mostrarAviso(`${hex} copiado`, 1500))

  // Combinaciones y Ropa y ambientes usan la misma pantalla con distinto modo
  const testeo = (modo) => (
    <Testeo key={modo} modo={modo} paletas={paletas} onActualizar={editarPaleta}
      onAprobar={aprobar} onCopiar={copiar} />
  )

  if (!configurado) {
    return (
      <main className="app-config">
        <h1>Matices</h1>
        <p className="error">
          Falta configurar Firebase: revisá el archivo .env y reiniciá npm run dev.
        </p>
      </main>
    )
  }

  return (
    <div className="app">
      <div className="barra">
        <div className="barra-in">
          <button type="button" className="marca" aria-label="Matices, ir al inicio"
            onClick={() => irA('home')}>
            <img src="/home/logo-bote.png" alt="" height="40" />
            <span>Matices</span>
          </button>
          <button type="button" className="menu-btn"
            aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menu}
            aria-controls="menu-principal" onClick={() => setMenu(!menu)}>
            <span /><span /><span />
          </button>
          <nav id="menu-principal" className={`tabs ${menu ? 'abierto' : ''}`}
            aria-label="Menú principal">
            {MENU.map(([id, texto]) => (
              <button key={id} type="button" className={vista === id ? 'activa' : ''}
                aria-current={vista === id ? 'page' : undefined} onClick={() => irA(id)}>
                {texto}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="contenido">
        {vista === 'home' && <Home onCopiar={copiar} />}
        {vista === 'coleccion' && (
          <Creacion paletas={paletas} cargando={cargando} onGuardar={guardarPaleta}
            onEditar={editarPaleta} onEliminar={eliminar} onFavorita={alternarFavorita}
            onCopiar={copiar} />
        )}
        {vista === 'combinar' && testeo('digital')}
        {vista === 'mundo' && testeo('mundo')}
        {vista === 'explorar' && (
          <Explorar paletas={paletas} onGuardar={guardarPaleta} onFavorita={alternarFavorita}
            onCopiar={copiar} />
        )}
      </main>

      <footer className="pie-pagina">
        <img src="/home/logo-bote.png" alt="" height="28" />
        <p><strong>Matices</strong> · by Delfina Vilarelle</p>
        <p>TP2 Desarrollo Frontend II · UADE · 2026</p>
      </footer>

      {aviso && <p className="toast aviso" role="status">{aviso}</p>}
      {error && <p className="toast error" role="alert">{error}</p>}
    </div>
  )
}
