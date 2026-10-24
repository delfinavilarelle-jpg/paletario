import { useState } from 'react'
import { hslAHex, hexAHsv, hsvAHex, generarEsquema } from '../utils/color'
import SelectorColor from './SelectorColor'
import './home.css'

const paso = (n, a, b) => Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1))

// 12 familias de color: [tono, saturación]; cada una en 9 matices del más claro al más oscuro
const FAMILIAS = [[48, 92], [28, 95], [325, 90], [350, 78], [195, 90], [178, 70],
  [212, 90], [272, 65], [140, 55], [62, 45], [24, 50], [215, 18]]

// Cada fila cambia una sola variable, para que se entienda qué es cada cosa
const MEDIDAS = [
  { t: 'Tono', d: 'Es el color en sí mismo, aquello que nos permite distinguir entre rojo, azul, amarillo o verde.',
    c: paso(8, 0, 315).map((h) => hslAHex({ h, s: 70, l: 50 })) },
  { t: 'Saturación', d: 'Indica la intensidad o pureza de un color. Los colores muy saturados son más vibrantes, mientras que los poco saturados se perciben más apagados.',
    c: paso(8, 10, 100).map((s) => hslAHex({ h: 215, s, l: 50 })) },
  { t: 'Luminosidad', d: 'Se refiere a qué tan claro u oscuro es un color. Modificarla permite crear profundidad, jerarquías y contraste.',
    c: paso(8, 90, 15).map((l) => hslAHex({ h: 270, s: 70, l })) },
  { t: 'Temperatura', d: 'Los colores cálidos, como rojos, naranjas y amarillos, suelen transmitir energía y cercanía. Los fríos, como azules, verdes y violetas, pueden sugerir calma, frescura o distancia.',
    c: [350, 15, 35, 50, 165, 195, 215, 245].map((h) => hslAHex({ h, s: 75, l: 50 })), nota: 'Cálidos → fríos' },
]

const USOS = [
  { t: 'Aplicaciones (UX/UI)', img: '/home/uso-ux.jpg', fondo: 'linear-gradient(135deg,#f2b35e,#e07b39)',
    d: 'El color ayuda a guiar la navegación, diferenciar botones, señalar estados y organizar la información. Una paleta suele incluir colores principales, secundarios, neutros y de acento. Es importante mantener la coherencia visual y asegurar que el texto sea legible.' },
  { t: 'Póster', img: '/home/uso-poster.jpg', fondo: 'linear-gradient(135deg,#f7e3d0,#e64a3b)',
    d: 'El color permite captar la atención a distancia y establecer un orden de lectura. Los contrastes fuertes destacan títulos y mensajes principales, mientras que las combinaciones más suaves pueden transmitir elegancia, tranquilidad o delicadeza.' },
  { t: 'Diseño digital', img: '/home/uso-digital.jpg', fondo: 'linear-gradient(135deg,#6fa8ff,#e9863a)',
    d: 'En ilustraciones, piezas para redes sociales, presentaciones y animaciones, las combinaciones de color aportan unidad, ritmo y personalidad. La elección depende del objetivo de la pieza y de cómo se relacionan el fondo, las imágenes, la tipografía y los elementos gráficos.' },
]

const DIVISIONES = [
  ['Complementarios', 'complementaria', 'Son colores opuestos en la rueda cromática. Generan un contraste fuerte y funcionan bien para destacar elementos importantes.'],
  ['Análogos', 'analoga', 'Son colores vecinos en la rueda cromática. Generan armonía y suavidad, y funcionan bien para fondos y degradados.'],
  ['Triádicos', 'triadica', 'Combinan tres colores distribuidos de forma equidistante en la rueda. Ofrecen variedad y equilibrio, aunque conviene elegir uno como protagonista.'],
  ['Monocromáticos', 'monocromatica', 'Utilizan variaciones de un mismo tono, modificando su luminosidad y saturación. Aportan unidad y permiten crear profundidad sin introducir demasiados colores.'],
]

function Rueda({ base, onElegir }) {
  const R0 = 38, R1 = 190, anillos = 6, rad = (g) => (g * Math.PI) / 180
  const pt = (r, a) => `${200 + r * Math.cos(a)} ${200 + r * Math.sin(a)}`
  const elegido = Math.round(hexAHsv(base).h / 30) % 12
  const celdas = []
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < anillos; j++) {
      const a0 = rad(i * 30 - 165), a1 = a0 + rad(30)
      const r0 = R0 + ((R1 - R0) * j) / anillos, r1 = R0 + ((R1 - R0) * (j + 1)) / anillos
      const color = hslAHex({ h: i * 30, s: 80, l: 92 - j * 11 })
      celdas.push(
        <path key={`${i}-${j}`} fill={color} className="celda" onClick={() => onElegir(color)}
          stroke={i === elegido ? '#1d1b1a' : 'none'} strokeWidth="1.5"
          d={`M${pt(r1, a0)}A${r1} ${r1} 0 0 1 ${pt(r1, a1)}L${pt(r0, a1)}A${r0} ${r0} 0 0 0 ${pt(r0, a0)}Z`} />
      )
    }
  }
  return <svg viewBox="0 0 400 400" role="img" aria-label="Rueda de color: tocá un color para elegirlo">{celdas}</svg>
}

function Tira({ colores, onCopiar }) {
  return (
    <div className="tira">
      {colores.map((c, i) => (
        <span key={i} style={{ background: c }} title={c} onClick={() => onCopiar(c)} />
      ))}
    </div>
  )
}

export default function Home({ onCopiar }) {
  const [hsv, setHsv] = useState(() => hexAHsv('#E4572E'))
  const base = hsvAHex(hsv)

  return (
    <div className="home">
      <div className="hero">
        <img className="hero-abanico" src="/home/abanico.webp" alt="" />
        <h1>
          <img className="hero-logo" src="/home/logo-matices.png" alt="matices, by Delfina Vilarelle" />
        </h1>
      </div>

      <section className="intro">
        <div>
          <h2>ABC de la teoría del color</h2>
          <p>La teoría del color es el conjunto de principios que permite comprender cómo se relacionan los colores, cómo se perciben y qué efectos producen cuando se combinan. En diseño, el color es una herramienta de comunicación visual: ayuda a transmitir sensaciones, destacar información, crear identidad y dirigir la atención del usuario.</p>
        </div>
        <div className="familias">
          {FAMILIAS.map(([h, s]) => (
            <div className="familia" key={h + '-' + s}>
              {paso(9, 88, 28).map((l) => {
                const c = hslAHex({ h, s, l })
                return <button key={l} className="muestra" style={{ background: c }} title={`Copiar ${c}`} onClick={() => onCopiar(c)} />
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="medidas">
        {MEDIDAS.map((m) => (
          <article className="medida" key={m.t}>
            <h3>{m.t}</h3>
            <div><Tira colores={m.c} onCopiar={onCopiar} />{m.nota && <p className="nota-tira">{m.nota}</p>}</div>
            <p>{m.d}</p>
          </article>
        ))}
      </section>

      <section className="usos">
        <h2>Cómo se usan las combinaciones de color</h2>
        <div className="tarjetas">
          {USOS.map((u) => (
            <article className="uso" key={u.t} tabIndex={0}>
              <div className="media" style={{ backgroundImage: `url(${u.img}), ${u.fondo}` }}><span>{u.t}</span></div>
              <p>{u.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rueda">
        <div className="rueda-izq">
          <Rueda base={base} onElegir={(hex) => setHsv(hexAHsv(hex))} />
          <SelectorColor hsv={hsv} onCambio={setHsv} />
        </div>
        <div>
          <h2>Divisiones de la rueda de colores</h2>
          <p className="nota-rueda">Elegí un color en la rueda o en el selector y mirá cómo cambian las combinaciones.</p>
          <div className="divisiones">
            {DIVISIONES.map(([nombre, tipo, texto]) => (
              <div className="division" key={tipo}>
                <h3>{nombre}</h3>
                <Tira colores={generarEsquema(base, tipo)} onCopiar={onCopiar} />
                <p>{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
