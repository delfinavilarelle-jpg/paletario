import { textoSobre } from '../utils/color'
import Corazon from './Corazon'

export default function TarjetaPaleta({ colores, nombre, favorita, onFavorita, onEditar, onEliminar, onCopiar }) {
  return (
    <article className="tarjeta">
      <div className="tarjeta-tira">
        {colores.map((c, i) => (
          <button key={i} type="button" style={{ background: c ?? '#D9D9D9', color: c ? textoSobre(c) : '#999' }}
            title={c ? `Copiar ${c}` : 'Color sin elegir'} onClick={() => c && onCopiar?.(c)}>{c ?? ''}</button>
        ))}
      </div>
      <div className="tarjeta-pie">
        <div className="fila">
          <span className="chip nombre">{nombre || 'Nombre'}</span>
          <button type="button" className="corazon" onClick={onFavorita} aria-pressed={!!favorita}
            aria-label={favorita ? 'Quitar de favoritas' : 'Marcar como favorita'}><Corazon lleno={favorita} /></button>
        </div>
        <div className="fila">
          <button type="button" className="chip" onClick={onEditar}>Editar</button>
          <button type="button" className="chip" onClick={onEliminar}>Eliminar</button>
        </div>
      </div>
    </article>
  )
}
