import { useState } from 'react'
import { MOODS } from '../utils/constantes'
import { hexAHsv, hsvAHex, textoSobre } from '../utils/color'
import RuedaColor from './RuedaColor'
import SelectorColor from './SelectorColor'
import EditorPaleta from './EditorPaleta'
import TarjetaPaleta from './TarjetaPaleta'
import './paletas.css'

export default function Creacion({ paletas, cargando, onGuardar, onEditar, onEliminar, onFavorita, onCopiar }) {
  const [nombre, setNombre] = useState('')
  const [mood, setMood] = useState(MOODS[0])
  const [moodOtro, setMoodOtro] = useState('')
  const [fuente, setFuente] = useState('')
  const [slots, setSlots] = useState([null, null, null, null])
  const [sel, setSel] = useState(0)
  const [color, setColor] = useState('#FFFFFF')
  const [hsv, setHsv] = useState(() => hexAHsv('#FFFFFF'))
  const [fino, setFino] = useState(false)
  const [error, setError] = useState('')
  const [editor, setEditor] = useState(null)

  // Rueda: llena el casillero elegido y pasa al siguiente vacío
  const elegir = (hex) => {
    const nuevos = slots.map((c, i) => (i === sel ? hex : c))
    setSlots(nuevos); setColor(hex); setHsv(hexAHsv(hex)); setError('')
    const sig = nuevos.findIndex((c, i) => c === null && i > sel)
    const alguno = nuevos.findIndex((c) => c === null)
    if (sig !== -1) setSel(sig)
    else if (alguno !== -1) setSel(alguno)
  }
  // Ajuste fino: cambia el casillero elegido sin saltar al siguiente
  const ajustar = (n) => {
    const hex = hsvAHex(n)
    setSlots(slots.map((c, i) => (i === sel ? hex : c)))
    setColor(hex); setHsv(n); setError('')
  }
  const escribirHex = (v) => {
    setColor(v)
    if (/^#[0-9a-f]{6}$/i.test(v)) elegir(v.toUpperCase())
  }
  const agregarSlot = () => { if (slots.length < 8) { setSlots([...slots, null]); setSel(slots.length) } }
  const quitarSlot = (i) => {
    if (slots.length <= 2) return
    setSlots(slots.filter((_, j) => j !== i))
    setSel(Math.max(0, Math.min(sel, slots.length - 2)))
  }
  const elegirSlot = (i) => { setSel(i); if (slots[i]) { setColor(slots[i]); setHsv(hexAHsv(slots[i])) } }
  const reiniciar = () => { setSlots(slots.map(() => null)); setSel(0); setColor('#FFFFFF'); setHsv(hexAHsv('#FFFFFF')); setError('') }
  const limpiarTodo = () => { reiniciar(); setNombre(''); setFuente(''); setMood(MOODS[0]); setMoodOtro('') }

  const guardar = async () => {
    const moodFinal = (mood === 'otro' ? moodOtro : mood).trim().slice(0, 30)
    if (!nombre.trim()) return setError('Poné un nombre a la paleta')
    if (!moodFinal) return setError('Escribí tu mood')
    if (slots.some((c) => c === null)) return setError('Completá todos los colores o quitá los que no uses')
    const ok = await onGuardar({ name: nombre.trim(), colors: slots, mood: moodFinal, source: fuente.trim(), favorite: false })
    if (ok) limpiarTodo()
  }

  const guardarEditor = async ({ name, colors }) => {
    const ok = await onEditar(editor.id, { name: name.trim(), colors })
    if (ok) setEditor(null)
  }

  return (
    <div className="pag cre">
      <div className="cre-in">
        <div className="cre-arriba">
          <div className="cre-marco">
            <h2>Crea tu propia paleta</h2>
            <div className="cre-form">
              <label className="linea">Nombre
                <input value={nombre} maxLength={60} onChange={(e) => setNombre(e.target.value)} />
              </label>
              <label className="linea">Mood
                <select value={mood} onChange={(e) => setMood(e.target.value)}>
                  {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  <option value="otro">otro…</option>
                </select>
              </label>
              {mood === 'otro' && (
                <label className="linea">Tu mood
                  <input value={moodOtro} maxLength={30} onChange={(e) => setMoodOtro(e.target.value)} placeholder="Ej: nostálgica" />
                </label>
              )}
              <label className="linea">Fuente (opcional)
                <input value={fuente} maxLength={100} onChange={(e) => setFuente(e.target.value)} />
              </label>
              <label className="linea">Color :
                <input className="hex" value={color} maxLength={7} onChange={(e) => escribirHex(e.target.value)} />
              </label>
              <div className="cre-muestra" style={{ background: /^#[0-9a-f]{6}$/i.test(color) ? color : '#FFFFFF' }} />
            </div>
          </div>

          <div className="cre-rueda">
            <RuedaColor onElegir={elegir} />
            <button type="button" className="chip" onClick={() => setFino(true)}>Ajuste fino</button>
          </div>
        </div>

        <div className="cre-centro">
          <div className="cre-slots">
            {slots.map((c, i) => (
              <div key={i} className="slot-caja">
                <button type="button" className={`slot ${i === sel ? 'sel' : ''}`}
                  style={{ background: c ?? '#D9D9D9', color: c ? textoSobre(c) : '#777' }} onClick={() => elegirSlot(i)}>{c ?? ''}</button>
                {slots.length > 2 && <button type="button" className="quitar" aria-label={`Quitar el color ${i + 1}`} onClick={() => quitarSlot(i)}>×</button>}
              </div>
            ))}
            {slots.length < 8 && (
              <button type="button" className="mas" aria-label="Agregar un color" onClick={agregarSlot}>
                <svg viewBox="0 0 60 60" width="56" height="56"><path d="M30 2v56M2 30h56" stroke="#1d1b1a" strokeWidth="2" /></svg>
              </button>
            )}
          </div>
          <p className="nota">Recomendado: 3 o 4 colores, pero podés usar entre 2 y 8. Elegí un casillero y tocá un color en la rueda.</p>
          {error && <p className="error">{error}</p>}
          <div className="cre-botones">
            <button type="button" className="btn-accion" onClick={guardar}>Guardar</button>
            <button type="button" className="btn-accion" onClick={reiniciar}>Reiniciar</button>
          </div>
        </div>

        <section className="cre-guardadas">
          <h2>Mis paletas</h2>
          {cargando && <p className="nota">Cargando…</p>}
          {!cargando && paletas.length === 0 && <p className="nota">Todavía no guardaste ninguna paleta. Cuando guardes una, va a aparecer acá.</p>}
          <div className="cre-lista">
            {paletas.map((p) => (
              <TarjetaPaleta key={p.id} colores={p.colors} nombre={p.name} favorita={p.favorite} onCopiar={onCopiar}
                onFavorita={() => onFavorita(p)}
                onEditar={() => setEditor({ id: p.id, nombre: p.name, colores: p.colors })}
                onEliminar={() => window.confirm(`¿Eliminar "${p.name}"?`) && onEliminar(p.id)} />
            ))}
          </div>
        </section>
      </div>

      {fino && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Ajuste fino" onClick={() => setFino(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Ajuste fino</h3>
            <p className="nota">Cambia el color del casillero que tenés elegido.</p>
            <SelectorColor hsv={hsv} onCambio={ajustar} />
            <div className="ed-pie"><button type="button" className="btn-accion" onClick={() => setFino(false)}>Listo</button></div>
          </div>
        </div>
      )}

      {editor && (
        <EditorPaleta titulo="Editar paleta" mostrarNombre nombreInicial={editor.nombre} coloresIniciales={editor.colores}
          exigirCompleta onGuardar={guardarEditor} onCerrar={() => setEditor(null)} />
      )}
    </div>
  )
}
