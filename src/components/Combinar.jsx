import { useState } from 'react'
import { MOODS } from '../utils/constantes'
import {
  ESQUEMAS, generarEsquema, contraste, textoSobre,
  luminancia, hexARgb, hexAHsl,
} from '../utils/color'

function Probador({ colores }) {
  const porLuz = [...colores].sort(
    (a, b) => luminancia(hexARgb(b)) - luminancia(hexARgb(a))
  )
  const fondo = porLuz[0]
  const texto = porLuz[porLuz.length - 1]
  const acento = [...colores].sort((a, b) => hexAHsl(b).s - hexAHsl(a).s)[0]
  const ratio = contraste(fondo, texto)

  return (
    <div className="probador" style={{ background: fondo, color: texto }}>
      <h3>Así se vería</h3>
      <p>Un texto de ejemplo para ver cómo se lee sobre este fondo.</p>
      <button style={{ background: acento, color: textoSobre(acento) }}>
        Botón de ejemplo
      </button>
      <small>
        Contraste texto y fondo: {ratio.toFixed(1)}:1 {ratio >= 4.5 ? '✓ cumple AA' : '✗ bajo'}
      </small>
    </div>
  )
}

export default function Combinar({ onGuardar, onCopiar }) {
  const [base, setBase] = useState('#E4572E')
  const [esquema, setEsquema] = useState('triadica')
  const [nombre, setNombre] = useState('')
  const [mood, setMood] = useState(MOODS[0])

  const colores = generarEsquema(base, esquema)
  const etiqueta = ESQUEMAS.find(([v]) => v === esquema)[1]

  return (
    <section className="form combinar">
      <h2>Combinar colores</h2>

      <label>
        Color base
        <input type="color" value={base} onChange={(e) => setBase(e.target.value)} />
      </label>

      <label>
        Tipo de combinación
        <select value={esquema} onChange={(e) => setEsquema(e.target.value)}>
          {ESQUEMAS.map(([valor, texto]) => (
            <option key={valor} value={valor}>{texto}</option>
          ))}
        </select>
      </label>

      <div className="swatches grande">
        {colores.map((c, i) => (
          <button
            key={i}
            className="swatch"
            style={{ background: c, color: textoSobre(c) }}
            onClick={() => onCopiar(c)}
            title={`Copiar ${c}`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="contrastes">
        {colores.map((c, i) => {
          const blanco = contraste(c, '#FFFFFF')
          const negro = contraste(c, '#111111')
          return (
            <li key={i}>
              <span className="punto" style={{ background: c }} />
              <code>{c}</code>
              <span>Blanco {blanco.toFixed(1)} {blanco >= 4.5 ? '✓' : '✗'}</span>
              <span>Negro {negro.toFixed(1)} {negro >= 4.5 ? '✓' : '✗'}</span>
            </li>
          )
        })}
      </ul>

      <Probador colores={colores} />

      <label>
        Nombre (opcional)
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={`${etiqueta} ${base.toUpperCase()}`}
        />
      </label>

      <label>
        Mood
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          {MOODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>

      <div className="acciones">
        <button
          type="button"
          className="primario"
          onClick={() =>
            onGuardar({
              name: nombre.trim() || `${etiqueta} ${base.toUpperCase()}`,
              colors: colores,
              mood,
              source: 'Combinar',
            })
          }
        >
          Guardar en mi colección
        </button>
      </div>
    </section>
  )
}
