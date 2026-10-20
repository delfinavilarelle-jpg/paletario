import { useState } from 'react'
import { PALETAS, MARCAS, CATEGORIAS } from '../data/paletas'
import { MOODS } from '../utils/constantes'
import { textoSobre, hexARgb, hexAHsl } from '../utils/color'

const moodsDe = (p) => p.moods ?? [p.mood]

function Detalle({ hex, nombre }) {
  const { r, g, b } = hexARgb(hex)
  const { h, s, l } = hexAHsl(hex)
  return (
    <p className="detalle">
      {nombre && <strong>{nombre}</strong>}
      <code>{hex}</code>
      <code>rgb({r}, {g}, {b})</code>
      <code>hsl({Math.round(h)}, {Math.round(s)}%, {Math.round(l)}%)</code>
    </p>
  )
}

function Tarjeta({ item, onGuardar, onCopiar }) {
  const [sel, setSel] = useState(0)
  const etiquetas = [moodsDe(item).join(' y '), item.perfil ?? item.uso]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="card">
      <div className="swatches">
        {item.colors.map((c, i) => (
          <button
            key={i}
            className={`swatch ${i === sel ? 'sel' : ''}`}
            style={{ background: c, color: textoSobre(c), fontSize: item.colors.length > 5 ? 9 : undefined }}
            onClick={() => {
              setSel(i)
              onCopiar(c)
            }}
            title={`Ver y copiar ${c}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="card-body">
        <h3>{item.name}</h3>
        <p className="meta">{etiquetas}</p>
        <Detalle hex={item.colors[sel]} nombre={item.nombres?.[sel]} />
        {item.nota && <p className="nota">{item.nota}</p>}
        {item.fuente && <p className="nota">Fuente: {item.fuente}</p>}
        <div className="acciones">
          <button
            onClick={() =>
              onGuardar({
                name: item.name,
                colors: item.colors,
                mood: moodsDe(item)[0],
                source: item.fuente ?? (item.categoria ? 'Marcas' : 'Explorar'),
              })
            }
          >
            Guardar en mi colección
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Explorar({ onGuardar, onCopiar }) {
  const [grupo, setGrupo] = useState('paletas')
  const [mood, setMood] = useState('todas')
  const [categoria, setCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  const coincide = (p) =>
    (mood === 'todas' || moodsDe(p).includes(mood)) &&
    p.name.toLowerCase().includes(busqueda.trim().toLowerCase())

  const paletas = PALETAS.filter(coincide)
  const categorias = CATEGORIAS.filter((c) => categoria === 'todas' || categoria === c)
  const secciones = categorias
    .map((c) => ({ nombre: c, items: MARCAS.filter((m) => m.categoria === c && coincide(m)) }))
    .filter((s) => s.items.length > 0)

  const grilla = (items) => (
    <div className="lista">
      {items.map((item) => (
        <Tarjeta key={item.name} item={item} onGuardar={onGuardar} onCopiar={onCopiar} />
      ))}
    </div>
  )

  return (
    <section>
      <div className="filtros">
        <div className="tabs">
          <button className={grupo === 'paletas' ? 'activa' : ''} onClick={() => setGrupo('paletas')}>
            Paletas
          </button>
          <button className={grupo === 'marcas' ? 'activa' : ''} onClick={() => setGrupo('marcas')}>
            Marcas
          </button>
        </div>
        <input
          placeholder="Buscar por nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="todas">Todos los moods</option>
          {MOODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        {grupo === 'marcas' && (
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      {grupo === 'paletas' &&
        (paletas.length === 0 ? <p>No hay paletas con ese filtro.</p> : grilla(paletas))}

      {grupo === 'marcas' && (
        <>
          <p className="nota">
            Códigos de referencia tomados de guías públicas de cada marca. Confirmalos en la fuente oficial antes de usarlos.
          </p>
          {secciones.length === 0 && <p>No hay marcas con ese filtro.</p>}
          {secciones.map((s) => (
            <section key={s.nombre} className="categoria">
              <h3>{s.nombre}</h3>
              {grilla(s.items)}
            </section>
          ))}
        </>
      )}
    </section>
  )
}
