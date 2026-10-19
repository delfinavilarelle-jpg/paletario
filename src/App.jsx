import { useEffect, useState } from 'react'
import { configurado } from './firebase'
import {
  iniciarSesion, escucharPaletas, agregarPaleta,
  actualizarPaleta, eliminarPaleta,
} from './services/palettes'
import PaletteForm from './components/PaletteForm'
import PaletteCard from './components/PaletteCard'
import './App.css'

export default function App() {
  const [uid, setUid] = useState(null)
  const [paletas, setPaletas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [editando, setEditando] = useState(null)
  const [formKey, setFormKey] = useState(0)

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
          (lista) => {
            setPaletas(lista)
            setCargando(false)
          },
          (e) => {
            setError(e.message)
            setCargando(false)
          }
        )
      })
      .catch((e) => {
        setError(e.message)
        setCargando(false)
      })
    return () => {
      activo = false
      cortar()
    }
  }, [])

  async function ejecutar(accion, mensaje) {
    try {
      await accion()
      setError('')
      setAviso(mensaje)
      setTimeout(() => setAviso(''), 2500)
    } catch (e) {
      setError(e.message)
    }
  }

  const guardar = (datos) =>
    ejecutar(async () => {
      if (editando) {
        await actualizarPaleta(uid, editando.id, datos)
        setEditando(null)
      } else {
        await agregarPaleta(uid, { ...datos, status: 'idea', favorite: false })
        setFormKey((k) => k + 1)
      }
    }, editando ? 'Paleta actualizada' : 'Paleta guardada')

  const cambiarEstado = (id, status) =>
    ejecutar(() => actualizarPaleta(uid, id, { status }), 'Estado actualizado')

  const alternarFavorita = (p) =>
    ejecutar(() => actualizarPaleta(uid, p.id, { favorite: !p.favorite }), 'Actualizada')

  const eliminar = (id) =>
    ejecutar(() => eliminarPaleta(uid, id), 'Paleta eliminada')

  const copiar = (hex) =>
    navigator.clipboard.writeText(hex).then(() => {
      setAviso(`${hex} copiado`)
      setTimeout(() => setAviso(''), 1500)
    })

  if (!configurado) {
    return (
      <main className="app">
        <h1>Paletario</h1>
        <p className="error">Falta configurar Firebase: revisá el archivo .env y reiniciá npm run dev.</p>
      </main>
    )
  }

  return (
    <main className="app">
      <header>
        <h1>Paletario</h1>
        <p>Mi colección de paletas de color</p>
      </header>

      {aviso && <p className="aviso">{aviso}</p>}
      {error && <p className="error">{error}</p>}

      <PaletteForm
        key={editando?.id ?? `nueva-${formKey}`}
        editando={editando}
        onGuardar={guardar}
        onCancelar={() => setEditando(null)}
      />

      <section className="lista">
        {cargando && <p>Cargando…</p>}
        {!cargando && paletas.length === 0 && <p>Todavía no guardaste ninguna paleta.</p>}
        {paletas.map((p) => (
          <PaletteCard
            key={p.id}
            paleta={p}
            onEstado={cambiarEstado}
            onFavorita={alternarFavorita}
            onEditar={(paleta) => {
              setEditando(paleta)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onEliminar={eliminar}
            onCopiar={copiar}
          />
        ))}
      </section>
    </main>
  )
}
