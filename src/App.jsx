import { useEffect, useState } from 'react'
import { configurado } from './firebase'
import { iniciarSesion, escucharPaletas, agregarPaleta, actualizarPaleta, eliminarPaleta } from './services/palettes'
import Home from './components/Home'
import Creacion from './components/Creacion'
import Testeo from './components/Testeo'
import Explorar from './components/Explorar'
import './App.css'

const PAGINAS_ANCHAS = ['home', 'coleccion', 'combinar', 'explorar']

export default function App() {
  const [uid, setUid] = useState(null)
  const [paletas, setPaletas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [vista, setVista] = useState('home')

  useEffect(() => {
    if (!configurado) {
      setCargando(false)
      return
    }
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

  // Ejecuta una operación con Firestore, muestra el aviso y devuelve true si salió bien
  async function ejecutar(accion, mensaje) {
    try {
      await accion()
      setError('')
      setAviso(mensaje)
      setTimeout(() => setAviso(''), 2500)
      return true
    } catch (e) {
      setError(e.message)
      return false
    }
  }

  const guardarPaleta = (datos) =>
    ejecutar(() => agregarPaleta(uid, { status: 'idea', favorite: false, ...datos }), 'Paleta guardada')
  const editarPaleta = (id, cambios) =>
    ejecutar(() => actualizarPaleta(uid, id, cambios), 'Paleta actualizada')
  const alternarFavorita = (p) =>
    ejecutar(() => actualizarPaleta(uid, p.id, { favorite: !p.favorite }), p.favorite ? 'Quitada de favoritas' : 'Agregada a favoritas')
  const aprobar = (p) =>
    ejecutar(() => actualizarPaleta(uid, p.id, { status: p.status === 'aprobada' ? 'prueba' : 'aprobada' }),
      p.status === 'aprobada' ? 'Aprobación quitada' : 'Paleta aprobada')
  const eliminar = (id) => ejecutar(() => eliminarPaleta(uid, id), 'Paleta eliminada')

  const copiar = (hex) =>
    navigator.clipboard.writeText(hex).then(() => {
      setAviso(`${hex} copiado`)
      setTimeout(() => setAviso(''), 1500)
    })

  if (!configurado) {
    return (
      <main className="app">
        <h1>matices</h1>
        <p className="error">Falta configurar Firebase: revisá el archivo .env y reiniciá npm run dev.</p>
      </main>
    )
  }

  return (
    <main className={`app ${PAGINAS_ANCHAS.includes(vista) ? 'app-home' : ''}`}>
      <div className="barra">
        <header className="marca">
          <img src="/home/logo-bote.png" alt="matices" height="40" />
        </header>
        <nav className="tabs">
          {[['home', 'Home'], ['coleccion', 'Creación de paletas'], ['combinar', 'Combinaciones'], ['explorar', 'Ideas para paletas']].map(([id, texto]) => (
            <button key={id} className={vista === id ? 'activa' : ''} onClick={() => setVista(id)}>{texto}</button>
          ))}
        </nav>
      </div>

      {aviso && <p className="aviso">{aviso}</p>}
      {error && <p className="error">{error}</p>}

      {vista === 'home' && <Home onCopiar={copiar} />}
      {vista === 'coleccion' && (
        <Creacion paletas={paletas} cargando={cargando} onGuardar={guardarPaleta} onEditar={editarPaleta}
          onEliminar={eliminar} onFavorita={alternarFavorita} onCopiar={copiar} />
      )}
      {vista === 'combinar' && (
        <Testeo paletas={paletas} onActualizar={editarPaleta} onAprobar={aprobar} onCopiar={copiar} />
      )}
      {vista === 'explorar' && (
        <Explorar paletas={paletas} onGuardar={guardarPaleta} onFavorita={alternarFavorita} onCopiar={copiar} />
      )}
    </main>
  )
}
