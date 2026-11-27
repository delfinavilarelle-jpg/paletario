import { useState } from 'react'
import { pedirEsquema } from '../services/colorApi'
import { textoSobre } from '../utils/color'

const MODOS = [
  ['analogic', 'Análoga'],
  ['monochrome', 'Monocromática'],
  ['complement', 'Complementaria'],
  ['triad', 'Triádica'],
  ['quad', 'Cuádruple'],
]

export default function GeneradorApi({ base, cantidad, onUsar }) {
  const [modo, setModo] = useState(MODOS[0][0])
  const [resultado, setResultado] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const generar = async () => {
    setCargando(true)
    setError('')
    try {
      setResultado(await pedirEsquema(base, modo, cantidad))
    } catch {
      setError('No se pudo conectar con The Color API. Probá de nuevo en un momento.')
    } finally {
      setCargando(false)
    }
  }

  const usar = () => {
    onUsar(resultado.map((c) => c.hex))
    setResultado([])
  }

  return (
    <section className="api">
      <h3>Ideas desde The Color API</h3>
      <p className="nota">
        Toma el color del casillero elegido y le pide a la API una paleta de {cantidad} colores,
        con el nombre de cada uno.
      </p>
      <div className="api-controles">
        <span className="api-base" style={{ background: base ?? '#D9D9D9' }} title={base ?? ''} />
        <select value={modo} onChange={(e) => setModo(e.target.value)} aria-label="Tipo de paleta">
          {MODOS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
        <button type="button" className="chip" onClick={generar} disabled={cargando || !base}>
          {cargando ? 'Consultando…' : 'Generar'}
        </button>
      </div>
      {!base && <p className="nota">Primero elegí un color en la rueda para usarlo de base.</p>}
      {error && <p className="error">{error}</p>}
      {resultado.length > 0 && (
        <>
          <div className="api-tira">
            {resultado.map((c, i) => (
              <span key={i} style={{ background: c.hex, color: textoSobre(c.hex) }}>
                <b>{c.nombre}</b>{c.hex}
              </span>
            ))}
          </div>
          <button type="button" className="btn-accion" onClick={usar}>Usar estos colores</button>
        </>
      )}
    </section>
  )
}
