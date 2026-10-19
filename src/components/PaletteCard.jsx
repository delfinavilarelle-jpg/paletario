import { textoSobre } from '../utils/color'

const ESTADOS = [
  ['idea', 'Idea'],
  ['prueba', 'En prueba'],
  ['aprobada', 'Aprobada'],
]

export default function PaletteCard({
  paleta, onEstado, onFavorita, onEditar, onEliminar, onCopiar,
}) {
  return (
    <article className="card">
      <div className="swatches">
        {paleta.colors.map((c, i) => (
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

      <div className="card-body">
        <h3>{paleta.name}</h3>
        <p className="meta">
          {paleta.mood}
          {paleta.source ? ` · ${paleta.source}` : ''}
        </p>

        <div className="acciones">
          <select value={paleta.status} onChange={(e) => onEstado(paleta.id, e.target.value)}>
            {ESTADOS.map(([valor, texto]) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
          <button onClick={() => onFavorita(paleta)} title="Favorita">
            {paleta.favorite ? '★' : '☆'}
          </button>
          <button onClick={() => onEditar(paleta)}>Editar</button>
          <button
            onClick={() => {
              if (window.confirm(`¿Eliminar "${paleta.name}"?`)) onEliminar(paleta.id)
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  )
}
