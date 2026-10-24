import { useEffect, useRef, useState } from 'react'
import { textoSobre } from '../utils/color'
import RuedaColor from './RuedaColor'

export default function EditorPaleta({ titulo, nombreInicial = '', mostrarNombre, coloresIniciales, exigirCompleta, onGuardar, onCerrar }) {
  const [slots, setSlots] = useState(coloresIniciales)
  const [sel, setSel] = useState(0)
  const [nombre, setNombre] = useState(nombreInicial)
  const [error, setError] = useState('')
  const arrastrando = useRef(null)

  useEffect(() => {
    const tecla = (e) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [onCerrar])

  const mover = (de, a) => {
    if (de === null || a < 0 || a >= slots.length || de === a) return
    const copia = [...slots]
    const [x] = copia.splice(de, 1)
    copia.splice(a, 0, x)
    setSlots(copia)
    setSel(a)
  }
  const cambiar = (hex) => setSlots(slots.map((c, i) => (i === sel ? hex : c)))
  const reiniciar = () => { setSlots(slots.map(() => null)); setSel(0) }
  const guardar = () => {
    if (mostrarNombre && !nombre.trim()) return setError('Poné un nombre a la paleta')
    if (exigirCompleta && slots.some((c) => c === null)) return setError('Completá todos los colores antes de guardar')
    onGuardar({ name: nombre, colors: slots })
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={titulo} onClick={onCerrar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{titulo}</h3>
        {mostrarNombre && (
          <label className="campo">Nombre
            <input value={nombre} maxLength={60} onChange={(e) => setNombre(e.target.value)} />
          </label>
        )}
        <div className="ed-slots">
          {slots.map((c, i) => (
            <button key={i} type="button" draggable className={`slot ${i === sel ? 'sel' : ''}`}
              style={{ background: c ?? '#D9D9D9', color: c ? textoSobre(c) : '#777' }}
              onClick={() => setSel(i)} onDragStart={() => (arrastrando.current = i)}
              onDragOver={(e) => e.preventDefault()} onDrop={() => mover(arrastrando.current, i)}>{c ?? 'gris'}</button>
          ))}
        </div>
        <div className="ed-acciones">
          <button type="button" className="chip" disabled={sel === 0} onClick={() => mover(sel, sel - 1)}>◀ Mover</button>
          <button type="button" className="chip" disabled={sel === slots.length - 1} onClick={() => mover(sel, sel + 1)}>Mover ▶</button>
          <button type="button" className="chip" onClick={reiniciar}>Reiniciar paleta</button>
        </div>
        <p className="nota">Arrastrá los colores para cambiarlos de lugar, o elegí uno y cambialo desde la rueda.</p>
        <div className="ed-rueda"><RuedaColor onElegir={cambiar} tamano={300} /></div>
        {error && <p className="error">{error}</p>}
        <div className="ed-pie">
          <button type="button" className="btn-accion" onClick={onCerrar}>Cancelar</button>
          <button type="button" className="btn-accion" onClick={guardar}>Guardar cambios</button>
        </div>
      </div>
    </div>
  )
}
