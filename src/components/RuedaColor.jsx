import { hslAHex } from '../utils/color'
import { rad, sector } from '../utils/geometria'

const SEG = 24
const ANILLOS = 7
const R0 = 40
const R1 = 195

// Amarillo arriba y de ahí en sentido horario; claro en el centro y oscuro afuera
const CELDAS = []
for (let i = 0; i < SEG; i++) {
  for (let j = 0; j < ANILLOS; j++) {
    const a0 = rad(i * (360 / SEG) - 90 - 360 / SEG / 2)
    const r0 = R0 + ((R1 - R0) * j) / ANILLOS
    const r1 = R0 + ((R1 - R0) * (j + 1)) / ANILLOS
    const h = (60 - i * (360 / SEG) + 360) % 360
    CELDAS.push({
      k: `${i}-${j}`,
      color: hslAHex({ h, s: 85, l: 94 - j * (68 / (ANILLOS - 1)) }),
      d: sector(r0, r1, a0, a0 + rad(360 / SEG)),
    })
  }
}

export default function RuedaColor({ onElegir, tamano = 380 }) {
  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: tamano }} role="img"
      aria-label="Rueda de color: tocá un color para elegirlo">
      {CELDAS.map((c) => (
        <path key={c.k} d={c.d} fill={c.color} className="celda-rueda"
          onClick={() => onElegir(c.color)} />
      ))}
    </svg>
  )
}
