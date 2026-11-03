import { useState } from 'react'
import { PALETAS, MARCAS, CATEGORIAS } from '../data/paletas'
import { MOODS } from '../utils/constantes'
import { textoSobre, hexARgb, hexAHsl } from '../utils/color'
import Corazon from './Corazon'
import IconoApp from './IconoApp'
import './galeria.css'

const moodsDe = (p) => p.moods ?? [p.mood]
const clave = (nombre, colores) => `${nombre}|${colores.join('')}`

function Detalle({ hex, nombre }) {
  const { r, g, b } = hexARgb(hex)
  const { h, s, l } = hexAHsl(hex)
  return (
    <p className="gal-detalle">
      {nombre && <strong>{nombre}</strong>}
      <code>{hex}</code>
      <code>rgb({r}, {g}, {b})</code>
      <code>hsl({Math.round(h)}, {Math.round(s)}%, {Math.round(l)}%)</code>
    </p>
  )
}

// Ícono de una app que se puede pintar con otra paleta, como los íconos de Instagram.
function Icono({ item, misPaletas }) {
  const [elegida, setElegida] = useState('')
  const paleta = [...misPaletas, ...PALETAS].find((p) => p.name === elegida)

  return (
    <div className="gal-icono">
      <IconoApp icono={item.icono} nombre={item.name} colores={paleta?.colors} />
      <label>
        Ícono con otra paleta
        <select value={elegida} onChange={(e) => setElegida(e.target.value)}>
          <option value="">Original</option>
          {misPaletas.length > 0 && (
            <optgroup label="Mis paletas">
              {misPaletas.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </optgroup>
          )}
          <optgroup label="Ideas">
            {PALETAS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          </optgroup>
        </select>
      </label>
    </div>
  )
}

function Tarjeta({ item, guardada, misPaletas, onGuardar, onFavorita, onCopiar }) {
  const [sel, setSel] = useState(0)
  const etiquetas = [moodsDe(item).join(' y '), item.perfil ?? item.uso].join(' · ')
  const datos = {
    name: item.name,
    colors: item.colors,
    mood: moodsDe(item)[0],
    source: item.fuente ?? (item.categoria ? 'Marcas' : 'Explorar'),
  }
  const favorita = !!guardada?.favorite
  const tituloFav = favorita ? 'Quitar de favoritas' : 'Marcar como favorita'
  const marcarFavorita = () =>
    guardada ? onFavorita(guardada) : onGuardar({ ...datos, favorite: true })
  const chica = item.colors.length > 5 ? 9 : undefined

  return (
    <article className="gal-card">
      <div className="gal-tira">
        {item.colors.map((c, i) => (
          <button key={i} type="button" className={i === sel ? 'sel' : ''}
            style={{ background: c, color: textoSobre(c), fontSize: chica }}
            title={`Ver y copiar ${c}`} onClick={() => { setSel(i); onCopiar(c) }}>{c}</button>
        ))}
      </div>

      <div className="gal-cuerpo">
        <h3>{item.name}</h3>
        <p className="gal-meta">{etiquetas}</p>
        <Detalle hex={item.colors[sel]} nombre={item.nombres?.[sel]} />
        {item.nota && <p className="gal-nota">{item.nota}</p>}
        {item.fuente && <p className="gal-nota">Fuente: {item.fuente}.</p>}
        {item.icono && <Icono item={item} misPaletas={misPaletas} />}
        <div className="gal-acciones">
          <button type="button" className="gal-btn" disabled={!!guardada}
            onClick={() => onGuardar(datos)}>
            {guardada ? 'En tu colección ✓' : 'Guardar en mi colección'}
          </button>
          <button type="button" className="gal-fav" aria-pressed={favorita} aria-label={tituloFav}
            title={tituloFav} onClick={marcarFavorita}>
            <Corazon lleno={favorita} size={22} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Explorar({ paletas, onGuardar, onFavorita, onCopiar }) {
  const [grupo, setGrupo] = useState('paletas')
  const [mood, setMood] = useState('todas')
  const [categoria, setCategoria] = useState('todas')
  const [uso, setUso] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const guardadas = new Map(paletas.map((p) => [clave(p.name, p.colors), p]))
  const coincide = (p) =>
    (mood === 'todas' || moodsDe(p).includes(mood)) &&
    p.name.toLowerCase().includes(busqueda.trim().toLowerCase())

  const usos = [...new Set(PALETAS.map((p) => p.uso))]
  const lista = PALETAS.filter((p) => coincide(p) && (uso === 'todos' || p.uso === uso))
  const secciones = CATEGORIAS
    .filter((c) => categoria === 'todas' || categoria === c.nombre)
    .map((c) => ({ ...c, items: MARCAS.filter((m) => m.categoria === c.nombre && coincide(m)) }))
    .filter((s) => s.items.length > 0)

  const galeria = (items) => (
    <div className="gal-grilla">
      {items.map((item) => (
        <Tarjeta key={item.name} item={item} guardada={guardadas.get(clave(item.name, item.colors))}
          misPaletas={paletas} onGuardar={onGuardar} onFavorita={onFavorita} onCopiar={onCopiar} />
      ))}
    </div>
  )

  const pestana = (id, texto) => (
    <button type="button" className={grupo === id ? 'activa' : ''} onClick={() => setGrupo(id)}>
      {texto}
    </button>
  )

  return (
    <section className="gal">
      <div className="gal-in">
        <header className="gal-cab">
          <h2>Ideas para paletas</h2>
          <p>
            Inspirate con paletas armadas y con los colores de marcas conocidas. Tocá un color para
            copiarlo, guardá la paleta en tu colección o marcala como favorita.
          </p>
        </header>

        <div className="gal-filtros">
          <div className="gal-tabs">
            {pestana('paletas', 'Paletas')}
            {pestana('marcas', 'Marcas')}
          </div>
          <input className="gal-busca" placeholder="Buscar por nombre…"
            aria-label="Buscar por nombre" value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} />
          <select className="gal-select" aria-label="Filtrar por mood" value={mood}
            onChange={(e) => setMood(e.target.value)}>
            <option value="todas">Todos los moods</option>
            {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {grupo === 'paletas' && (
            <select className="gal-select" aria-label="Filtrar por uso" value={uso}
              onChange={(e) => setUso(e.target.value)}>
              <option value="todos">Todos los usos</option>
              {usos.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          )}
          {grupo === 'marcas' && (
            <select className="gal-select" aria-label="Filtrar por categoría" value={categoria}
              onChange={(e) => setCategoria(e.target.value)}>
              <option value="todas">Todas las categorías</option>
              {CATEGORIAS.map((c) => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
            </select>
          )}
        </div>

        {grupo === 'paletas' && lista.length === 0 && (
          <p className="gal-vacio">No hay paletas con ese filtro.</p>
        )}
        {grupo === 'paletas' && galeria(lista)}

        {grupo === 'marcas' && (
          <>
            <p className="gal-aviso">
              Códigos de referencia. Cuando dice «medido en el logo oficial», el color sale del
              archivo del logo; en el resto, confirmalo en la fuente de la marca antes de usarlo.
            </p>
            {secciones.length === 0 && <p className="gal-vacio">No hay marcas con ese filtro.</p>}
            {secciones.map((s) => (
              <section key={s.nombre} className="gal-seccion">
                <h3>{s.nombre}</h3>
                {s.nota && <p className="gal-aviso">{s.nota}</p>}
                {galeria(s.items)}
              </section>
            ))}
          </>
        )}
      </div>
    </section>
  )
}
