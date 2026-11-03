// Ayudas para dibujar ruedas de color en un SVG de 400 x 400 (centro en 200, 200).

export const rad = (grados) => (grados * Math.PI) / 180

const punto = (r, a) =>
  `${(200 + r * Math.cos(a)).toFixed(1)} ${(200 + r * Math.sin(a)).toFixed(1)}`

// Trazo de una celda de la rueda: el pedazo de anillo entre los radios r0 y r1
// y entre los ángulos a0 y a1 (en radianes).
export function sector(r0, r1, a0, a1) {
  return (
    `M${punto(r1, a0)}A${r1} ${r1} 0 0 1 ${punto(r1, a1)}` +
    `L${punto(r0, a1)}A${r0} ${r0} 0 0 0 ${punto(r0, a0)}Z`
  )
}
