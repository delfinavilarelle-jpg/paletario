import { useRef, useState } from 'react'
import { hsvAHex, hexAHsv, hexARgb } from '../utils/color'

// Colores básicos de la paleta clásica de Paint
const BASICOS = ['#000000', '#7F7F7F', '#880015', '#ED1C24', '#FF7F27', '#FFF200', '#22B14C', '#00A2E8', '#3F48CC', '#A349A4',
  '#FFFFFF', '#C3C3C3', '#B97A57', '#FFAEC9', '#FFC90E', '#EFE4B0', '#B5E61D', '#99D9EA', '#7092BE', '#C8BFE7']

export default function SelectorColor({ hsv, onCambio }) {
  const area = useRef(null)
  const [escribiendo, setEscribiendo] = useState(null)
  const hex = hsvAHex(hsv)
  const { r, g, b } = hexARgb(hex)

  const mover = (e) => {
    const c = area.current.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (e.clientX - c.left) / c.width))
    const y = Math.min(1, Math.max(0, (e.clientY - c.top) / c.height))
    onCambio({ ...hsv, s: x * 100, v: (1 - y) * 100 })
  }

  const escribir = (valor) => {
    setEscribiendo(valor)
    if (/^#?[0-9a-f]{6}$/i.test(valor)) onCambio(hexAHsv(valor.startsWith('#') ? valor : '#' + valor))
  }

  const gotero = async () => {
    try { onCambio(hexAHsv((await new window.EyeDropper().open()).sRGBHex)) } catch { /* cancelado */ }
  }

  return (
    <div className="selector">
      <div ref={area} className="sel-area" style={{ '--tono': `hsl(${hsv.h} 100% 50%)` }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); mover(e) }}
        onPointerMove={(e) => e.buttons === 1 && mover(e)}>
        <span className="sel-punto" style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }} />
      </div>
      <input className="sel-tono" type="range" min="0" max="360" aria-label="Tono"
        value={Math.round(hsv.h)} onChange={(e) => onCambio({ ...hsv, h: +e.target.value })} />

      <div className="sel-datos">
        <span className="sel-previa" style={{ background: hex }} />
        <label>HEX
          <input value={escribiendo ?? hex} onChange={(e) => escribir(e.target.value)} onBlur={() => setEscribiendo(null)} />
        </label>
        <code>rgb({r}, {g}, {b})</code>
        {'EyeDropper' in window && <button type="button" onClick={gotero}>Gotero</button>}
      </div>

      <div className="sel-basicos">
        {BASICOS.map((c) => (
          <button key={c} type="button" style={{ background: c }} title={c} aria-label={c} onClick={() => onCambio(hexAHsv(c))} />
        ))}
      </div>
    </div>
  )
}
