import { hslAHex } from '../utils/color'

const SEG = 24, ANILLOS = 7, R0 = 40, R1 = 195
const rad = (g) => (g * Math.PI) / 180
const pt = (r, a) => `${(200 + r * Math.cos(a)).toFixed(1)} ${(200 + r * Math.sin(a)).toFixed(1)}`

// Amarillo arriba y de ahí en sentido horario; claro en el centro y oscuro afuera
const CELDAS = []
for (let i = 0; i < SEG; i++) {
  for (let j = 0; j < ANILLOS; j++) {
    const a0 = rad(i * (360 / SEG) - 90 - 360 / SEG / 2), a1 = a0 + rad(360 / SEG)
    const r0 = R0 + ((R1 - R0) * j) / ANILLOS, r1 = R0 + ((R1 - R0) * (j + 1)) / ANILLOS
    CELDAS.push({
      k: `${i}-${j}`,
      color: hslAHex({ h: (60 - i * (360 / SEG) + 360) % 360, s: 85, l: 94 - j * (68 / (ANILLOS - 1)) }),
      d: `M${pt(r1, a0)}A${r1} ${r1} 0 0 1 ${pt(r1, a1)}L${pt(r0, a1)}A${r0} ${r0} 0 0 0 ${pt(r0, a0)}Z`,
    })
  }
}

export default function RuedaColor({ onElegir, tamano = 380 }) {
  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: tamano }} role="img"
      aria-label="Rueda de color: tocá un color para elegirlo">
      {CELDAS.map((c) => (
        <path key={c.k} d={c.d} fill={c.color} className="celda-rueda" onClick={() => onElegir(c.color)} />
      ))}
    </svg>
  )
}
