import { useState } from 'react'
import { MOODS } from '../utils/constantes'
import {
  ESQUEMAS, generarEsquema, contraste, textoSobre,
  luminancia, hexARgb, hexAHsl, hexAHsv, hsvAHex,
} from '../utils/color'
import SelectorColor from './SelectorColor'
import './combinar.css'

function Probador({ colores }) {
  const porLuz = [...colores].sort((a, b) => luminancia(hexARgb(b)) - luminancia(hexARgb(a)))
  const fondo = porLuz[0]
  const texto = porLuz[porLuz.length - 1]
  const acento = [...colores].sort((a, b) => hexAHsl(b).s - hexAHsl(a).s)[0]
  const ratio = contraste(fondo, texto)

  return (
    <div className="cmb-probador" style={{ background: fondo, color: texto }}>
      <div className="cmb-prob-barra">
        <b>Tu marca</b>
        <span style={{ background: acento }} />
      </div>
      <h4>Un título que se lee bien</h4>
      <p>Así se vería un texto de ejemplo sobre este fondo, con un botón de acción.</p>
      <div className="cmb-prob-fila">
        <button style={{ background: acento, color: textoSobre(acento) }}>Botón principal</button>
        <button className="sec" style={{ borderColor: texto, color: texto }}>Secundario</button>
      </div>
      <small>Contraste texto y fondo: {ratio.toFixed(1)}:1 {ratio >= 4.5 ? '✓ cumple AA' : '✗ bajo'}</small>
    </div>
  )
}

export default function Combinar({ onGuardar, onCopiar }) {
  const [hsv, setHsv] = useState(() => hexAHsv('#E4572E'))
  const [esquema, setEsquema] = useState('triadica')
  const [sel, setSel] = useState(0)
  const [nombre, setNombre] = useState('')
  const [mood, setMood] = useState(MOODS[0])

  const base = hsvAHex(hsv)
  const colores = generarEsquema(base, esquema)
  const etiqueta = ESQUEMAS.find(([v]) => v === esquema)[1]
  const actual = colores[Math.min(sel, colores.length - 1)]
  const { r, g, b } = hexARgb(actual)
  const { h, s, l } = hexAHsl(actual)
  const sorpresa = () => setHsv({ h: Math.random() * 360, s: 55 + Math.random() * 40, v: 70 + Math.random() * 30 })

  return (
    <section className="cmb">
      <header className="cmb-cab">
        <h2>Combinaciones</h2>
        <p>Elegí un color base y mirá cómo se arma una paleta a partir de él: tipo de combinación, contraste y una prueba de uso.</p>
      </header>

      <div className="cmb-grid">
        <article className="cmb-card">
          <h3>1. Color base</h3>
          <SelectorColor hsv={hsv} onCambio={setHsv} />
          <button type="button" className="cmb-pill" onClick={sorpresa}>Sorprendeme</button>
        </article>

        <div className="cmb-col">
          <article className="cmb-card">
            <h3>2. Tipo de combinación</h3>
            <div className="cmb-chips">
              {ESQUEMAS.map(([valor, texto]) => (
                <button key={valor} type="button" className={esquema === valor ? 'activa' : ''}
                  onClick={() => { setEsquema(valor); setSel(0) }}>{texto}</button>
              ))}
            </div>
            <div className="cmb-tira">
              {colores.map((c, i) => (
                <button key={i} type="button" className={i === sel ? 'sel' : ''}
                  style={{ background: c, color: textoSobre(c) }} title={`Ver y copiar ${c}`}
                  onClick={() => { setSel(i); onCopiar(c) }}>{c}</button>
              ))}
            </div>
            <p className="cmb-detalle">
              <code>{actual}</code><code>rgb({r}, {g}, {b})</code>
              <code>hsl({Math.round(h)}, {Math.round(s)}%, {Math.round(l)}%)</code>
            </p>
          </article>

          <article className="cmb-card">
            <h3>3. Contraste</h3>
            <ul className="cmb-contrastes">
              {colores.map((c, i) => {
                const blanco = contraste(c, '#FFFFFF')
                const negro = contraste(c, '#111111')
                return (
                  <li key={i} style={{ background: c }}>
                    <code style={{ color: textoSobre(c) }}>{c}</code>
                    <span style={{ color: '#fff' }}>Blanco {blanco.toFixed(1)} {blanco >= 4.5 ? '✓' : '✗'}</span>
                    <span style={{ color: '#111' }}>Negro {negro.toFixed(1)} {negro >= 4.5 ? '✓' : '✗'}</span>
                  </li>
                )
              })}
            </ul>
          </article>

          <article className="cmb-card">
            <h3>4. Probalo en uso</h3>
            <Probador colores={colores} />
          </article>

          <article className="cmb-card">
            <h3>5. Guardala</h3>
            <label className="cmb-campo">Nombre (opcional)
              <input value={nombre} maxLength={60} onChange={(e) => setNombre(e.target.value)}
                placeholder={`${etiqueta} ${base.toUpperCase()}`} />
            </label>
            <div className="cmb-chips">
              {MOODS.map((m) => (
                <button key={m} type="button" className={mood === m ? 'activa' : ''} onClick={() => setMood(m)}>{m}</button>
              ))}
            </div>
            <button type="button" className="cmb-pill principal"
              onClick={() => onGuardar({ name: nombre.trim() || `${etiqueta} ${base.toUpperCase()}`, colors: colores, mood, source: 'Combinar' })}>
              Guardar en mi colección
            </button>
          </article>
        </div>
      </div>
    </section>
  )
}
