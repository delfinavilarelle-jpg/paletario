import { useState } from 'react'
import { MockWeb, MockApp, MockPoster } from './Mockups'
import Probador from './Probador'
import EditorPaleta from './EditorPaleta'
import Corazon from './Corazon'
import { textoSobre } from '../utils/color'
import './paletas.css'

const MODOS = {
  digital: {
    titulo: 'Testeo de paleta',
    intro: 'Probá cómo funciona tu paleta en una web, en una app y en un póster.',
    demo: ['#27E3D9', '#C10AC2', '#FFE224', '#000000'],
    tipos: [
      { id: 'web', nombre: 'Web', titulo: 'Tu paleta en una web', Comp: MockWeb, ancho: 600 },
      { id: 'app', nombre: 'App', titulo: 'Tu paleta en una app', Comp: MockApp, ancho: 300 },
      { id: 'poster', nombre: 'Póster', titulo: 'Tu paleta en un póster', Comp: MockPoster,
        ancho: 420 },
    ],
  },
  mundo: {
    titulo: 'Ropa y ambientes',
    intro: 'Armá un outfit o un ambiente pieza por pieza: elegí qué color lleva cada prenda o '
      + 'cada mueble y mirá si la proporción funciona.',
    demo: ['#E6D3B3', '#3B2F2F', '#8B5E3C', '#5B6B4E', '#C28E5C'],
    tipos: [],
  },
}

const SIN_FAVORITAS = 'Todavía no tenés favoritas: tocá el corazón en una paleta de '
  + '«Creación de paletas» o de «Ideas para paletas».'

function Bloque({ tipo, base, aprobada, puedeAprobar, onAprobar, onEditar, onCopiar }) {
  const [orden, setOrden] = useState(() => base.map((_, i) => i))
  const colores = orden.map((i) => base[i])
  const Mock = tipo.Comp

  // Mezcla el orden de los colores (algoritmo de Fisher-Yates)
  const mezclar = () => {
    const o = [...orden]
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]]
    }
    setOrden(o)
  }

  return (
    <section className="tes-bloque" aria-label={tipo.titulo}
      style={{ '--mock': `${tipo.ancho}px` }}>
      <div className={`tes-mock mock-${tipo.id}`}><Mock c={colores} /></div>
      <div className="tes-ctrl">
        <div className="tes-tira">
          {colores.map((c, i) => (
            <button key={i} type="button" style={{ background: c, color: textoSobre(c) }}
              title={`Copiar ${c}`} aria-label={`Copiar ${c}`} onClick={() => onCopiar(c)} />
          ))}
        </div>
        <button type="button" className="pill btn-azul" onClick={mezclar}>Mezclar paleta</button>
        <button type="button" className="pill btn-lav" onClick={onAprobar} disabled={!puedeAprobar}
          aria-pressed={aprobada}>
          Aprobar <span className={`check ${aprobada ? 'on' : ''}`}>{aprobada ? '✓' : ''}</span>
        </button>
        <button type="button" className="pill btn-lav" onClick={() => onEditar(colores)}>
          Editar paleta
        </button>
      </div>
    </section>
  )
}

export default function Testeo({ modo = 'digital', paletas, onActualizar, onAprobar, onCopiar }) {
  const cfg = MODOS[modo]
  const [tab, setTab] = useState('guardados')
  const [elegidaId, setElegidaId] = useState(null)
  const [donde, setDonde] = useState('todo')
  const [editor, setEditor] = useState(null)
  const [demo, setDemo] = useState(cfg.demo)

  const lista = tab === 'favoritos' ? paletas.filter((p) => p.favorite) : paletas
  const elegida = paletas.find((p) => p.id === elegidaId) ?? lista[0] ?? paletas[0] ?? null
  const base = elegida ? elegida.colors : demo
  // Lo que comparten los bloques de Combinaciones y el probador de Ropa y ambientes
  const comun = {
    aprobada: elegida?.status === 'aprobada',
    puedeAprobar: !!elegida,
    onAprobar: () => onAprobar(elegida),
    onCopiar,
  }

  const guardarEditor = async ({ colors }) => {
    if (!elegida) {
      setDemo(colors)
      setEditor(null)
    } else if (await onActualizar(elegida.id, { colors })) {
      setEditor(null)
    }
  }

  const pestana = (id, contenido) => (
    <button type="button" className={`pill ${tab === id ? 'btn-azul' : 'btn-lav'}`}
      onClick={() => setTab(id)}>
      {contenido}
    </button>
  )

  return (
    <div className="pag tes">
      <header className="tes-cab">
        <h2>{cfg.titulo}</h2>
        <p>{cfg.intro}</p>
      </header>

      <div className="tes-in">
        <div className="tes-barra">
          <div className="tes-tabs">
            {pestana('favoritos', (
              <>Favoritos <span className="blanco"><Corazon lleno size={22} /></span></>
            ))}
            {pestana('guardados', 'Guardados')}
          </div>
          {cfg.tipos.length > 0 && (
            <label className="tes-donde">Dónde testear
              <select value={donde} onChange={(e) => setDonde(e.target.value)}>
                <option value="todo">En todo</option>
                {cfg.tipos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </label>
          )}
        </div>

        <div className="tes-paletas">
          {lista.length === 0 && (
            <p className="nota">
              {tab === 'favoritos' ? SIN_FAVORITAS : 'Todavía no guardaste paletas.'}
              {' '}Mientras tanto probá una de ejemplo.
            </p>
          )}
          {lista.map((p) => (
            <button key={p.id} type="button" className={`mini ${elegida?.id === p.id ? 'sel' : ''}`}
              onClick={() => setElegidaId(p.id)}>
              <span className="mini-tira">
                {p.colors.map((c, i) => <i key={i} style={{ background: c }} />)}
              </span>
              <span>{p.name}</span>
              {p.favorite && <Corazon lleno size={16} />}
            </button>
          ))}
        </div>

        {cfg.tipos.filter((t) => donde === 'todo' || donde === t.id).map((tipo) => (
          <Bloque key={`${modo}-${tipo.id}-${elegida?.id ?? 'demo'}-${base.join('')}`} tipo={tipo}
            base={base} onEditar={(colores) => setEditor({ colores })} {...comun} />
        ))}

        {modo === 'mundo' && (
          <Probador key={`${elegida?.id ?? 'demo'}-${base.join('')}`} colores={base}
            onEditar={() => setEditor({ colores: base })} {...comun} />
        )}
      </div>

      {editor && (
        <EditorPaleta titulo="Editar paleta" coloresIniciales={editor.colores} exigirCompleta
          onGuardar={guardarEditor} onCerrar={() => setEditor(null)} />
      )}
    </div>
  )
}
