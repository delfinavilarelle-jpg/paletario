import { useMemo, useState } from 'react'
import { ESCENAS } from './Escenas'
import { textoSobre } from '../utils/color'

// Asignación inicial: cada pieza toma el color de su rol (si la paleta es más corta, se repite)
const inicial = (escena, colores) =>
  Object.fromEntries(escena.partes.map((pt) => [pt.id, pt.rol % colores.length]))

// Cuánto ocupa cada color de la paleta en la escena, sumando el peso de sus piezas
function proporciones(escena, asignacion, colores) {
  const total = escena.partes.reduce((s, pt) => s + pt.peso, 0)
  return colores
    .map((c, i) => ({
      c, i,
      pct: Math.round((escena.partes.filter((pt) => asignacion[pt.id] === i).reduce((s, pt) => s + pt.peso, 0) / total) * 100),
    }))
    .filter((x) => x.pct > 0)
    .sort((a, b) => b.pct - a.pct)
}

// Compara el reparto con la regla 60-30-10
function consejo(prop) {
  const [a = 0, b = 0] = prop.map((x) => x.pct)
  if (prop.length === 1) return 'Todo es de un solo color: sumá un segundo color para darle contraste.'
  if (a < 40) return 'Ningún color domina. Probá que uno ocupe cerca del 60 % para que el conjunto se ordene.'
  if (a > 78) return 'Un color ocupa casi todo. Pasá alguna pieza grande a otro color para equilibrar.'
  if (b < 15) return 'Hay un color principal claro, pero falta uno secundario que acompañe (cerca del 30 %).'
  return 'Buena jerarquía: un color domina, otro acompaña y el resto funciona como acento.'
}

export default function Probador({ colores, aprobada, puedeAprobar, onAprobar, onEditar, onCopiar }) {
  const [escenaId, setEscenaId] = useState(ESCENAS[0].id)
  const escena = ESCENAS.find((e) => e.id === escenaId)
  const [asignaciones, setAsignaciones] = useState({})
  const [sel, setSel] = useState(escena.partes[0].id)

  const asignacion = asignaciones[escenaId] ?? inicial(escena, colores)
  const prop = useMemo(() => proporciones(escena, asignacion, colores), [escena, asignacion, colores])
  const piezaSel = escena.partes.find((pt) => pt.id === sel) ?? escena.partes[0]

  const cambiarEscena = (id) => {
    setEscenaId(id)
    setSel(ESCENAS.find((e) => e.id === id).partes[0].id)
  }
  const guardar = (nueva) => setAsignaciones({ ...asignaciones, [escenaId]: nueva })
  const pintar = (i) => guardar({ ...asignacion, [piezaSel.id]: i })
  const reiniciar = () => guardar(inicial(escena, colores))
  const mezclar = () =>
    guardar(Object.fromEntries(escena.partes.map((pt) => [pt.id, Math.floor(Math.random() * colores.length)])))

  // Props de cada pieza del dibujo: color, clic, teclado y marca de selección
  const p = (id) => {
    const color = colores[asignacion[id]]
    const pieza = escena.partes.find((pt) => pt.id === id)
    return {
      fill: color, color,
      className: `parte ${id === piezaSel.id ? 'sel' : ''}`,
      role: 'button', tabIndex: 0, 'aria-label': `${pieza.nombre}: ${color}`,
      onClick: () => setSel(id),
      onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(id)),
    }
  }
  const Dibujo = escena.Dibujo
  const grupos = [...new Set(ESCENAS.map((e) => e.grupo))]

  return (
    <div className="pro">
      <div className="pro-escenas" role="tablist" aria-label="Escena">
        {grupos.map((g) => (
          <div key={g} className="pro-grupo">
            <span>{g}</span>
            {ESCENAS.filter((e) => e.grupo === g).map((e) => (
              <button key={e.id} type="button" role="tab" aria-selected={e.id === escenaId}
                className={e.id === escenaId ? 'activa' : ''} onClick={() => cambiarEscena(e.id)}>{e.nombre}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="pro-grid">
        <figure className={`pro-lienzo ${escena.grupo === 'Ropa' ? 'vertical' : ''}`}>
          <Dibujo p={p} />
          <figcaption>Tocá una pieza del dibujo o de la lista y elegí su color en la paleta.</figcaption>
        </figure>

        <aside className="pro-panel">
          <section>
            <h3>Piezas</h3>
            <ul className="pro-piezas">
              {escena.partes.map((pt) => {
                const c = colores[asignacion[pt.id]]
                return (
                  <li key={pt.id}>
                    <button type="button" className={pt.id === piezaSel.id ? 'sel' : ''} aria-pressed={pt.id === piezaSel.id} onClick={() => setSel(pt.id)}>
                      <i style={{ background: c }} />
                      <span>{pt.nombre}</span>
                      <code>{c}</code>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section>
            <h3>Pintar <strong>{piezaSel.nombre.toLowerCase()}</strong></h3>
            <div className="pro-paleta">
              {colores.map((c, i) => (
                <button key={i} type="button" style={{ background: c, color: textoSobre(c) }}
                  className={asignacion[piezaSel.id] === i ? 'sel' : ''} aria-label={`Pintar ${piezaSel.nombre} de ${c}`}
                  onClick={() => pintar(i)} onDoubleClick={() => onCopiar(c)} title={`${c} · doble clic para copiar`}>
                  {asignacion[piezaSel.id] === i && '✓'}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3>Proporción <small>regla 60 · 30 · 10</small></h3>
            <div className="pro-barra" aria-hidden="true">
              {prop.map((x) => <span key={x.i} style={{ flex: x.pct, background: x.c }} />)}
            </div>
            <ul className="pro-pcts">
              {prop.map((x) => <li key={x.i}><i style={{ background: x.c }} />{x.pct} %</li>)}
            </ul>
            <p className="pro-consejo">{consejo(prop)}</p>
          </section>

          <div className="pro-acciones">
            <button type="button" className="pill btn-azul" onClick={mezclar}>Mezclar</button>
            <button type="button" className="pill btn-lav" onClick={reiniciar}>Reiniciar</button>
            <button type="button" className="pill btn-lav" onClick={onAprobar} disabled={!puedeAprobar} aria-pressed={aprobada}>
              Aprobar <span className={`check ${aprobada ? 'on' : ''}`}>{aprobada ? '✓' : ''}</span>
            </button>
            <button type="button" className="pill btn-lav" onClick={onEditar}>Editar paleta</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
