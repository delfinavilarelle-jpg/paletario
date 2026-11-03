import { contraste } from '../utils/color'

// Íconos simplificados de apps, dibujados a mano en una grilla de 100 x 100.
// c[0] es el fondo, c[1] la figura y c[2] un detalle.
// "original" son los colores de la marca.
const ICONOS = {
  steam: {
    original: ['#171A21', '#FFFFFF', '#66C0F4'],
    Dibujo: ({ c }) => (
      <>
        <path d="M36 66L60 42" stroke={c[1]} strokeWidth="9" strokeLinecap="round" />
        <circle cx="62" cy="40" r="17" fill={c[1]} />
        <circle cx="62" cy="40" r="10" fill={c[0]} />
        <circle cx="62" cy="40" r="6" fill={c[2]} />
        <circle cx="36" cy="66" r="10" fill={c[1]} />
        <circle cx="36" cy="66" r="5" fill={c[0]} />
      </>
    ),
  },
  epic: {
    original: ['#121212', '#FFFFFF'],
    Dibujo: ({ c }) => (
      <>
        <path d="M26 16H74V68Q74 74 68 77L50 86L32 77Q26 74 26 68Z" fill={c[1]} />
        <g fill={c[0]} fontFamily="Arial, sans-serif" fontWeight="800" textAnchor="middle">
          <text x="50" y="48" fontSize="17">EPIC</text>
          <text x="50" y="63" fontSize="9">GAMES</text>
        </g>
      </>
    ),
  },
  firefox: {
    original: ['#FFFFFF', '#FF7139', '#9059FF'],
    Dibujo: ({ c }) => (
      <>
        <circle cx="60" cy="42" r="19" fill={c[2]} />
        <path fill={c[1]} fillRule="evenodd"
          d="M16 54a34 34 0 1 0 68 0a34 34 0 1 0-68 0ZM41 42a19 19 0 1 0 38 0a19 19 0 1 0-38 0Z" />
        <path d="M20 40L24 12L44 26Z" fill={c[1]} />
      </>
    ),
  },
  riot: {
    original: ['#EB0029', '#FFFFFF'],
    Dibujo: ({ c }) => (
      <>
        <rect x="28" y="30" width="44" height="36" rx="8" fill={c[1]} />
        <rect x="36" y="66" width="28" height="14" rx="3" fill={c[1]} />
        <path d="M39 30V46M50 30V46M61 30V46M30 54H54" stroke={c[0]} strokeWidth="3" />
      </>
    ),
  },
  spotify: {
    original: ['#191414', '#1ED760'],
    Dibujo: ({ c }) => (
      <>
        <circle cx="50" cy="50" r="32" fill={c[1]} />
        <g fill="none" stroke={c[0]} strokeLinecap="round">
          <path d="M30 40Q52 32 72 42" strokeWidth="6" />
          <path d="M33 52Q51 46 68 54" strokeWidth="5" />
          <path d="M36 63Q50 59 64 65" strokeWidth="4" />
        </g>
      </>
    ),
  },
  twitch: {
    original: ['#9147FF', '#FFFFFF'],
    Dibujo: ({ c }) => (
      <>
        <path d="M28 20H76V58L62 72H50L42 80V72H28Z" fill={c[1]} />
        <path d="M50 32V46M64 32V46" stroke={c[0]} strokeWidth="6" />
      </>
    ),
  },
}

// Pasa una paleta cualquiera a los tres roles del ícono:
// el fondo es el primer color y la figura, el que más contrasta con él.
function colorearIcono(paleta) {
  const [fondo, ...resto] = paleta
  if (resto.length === 0) return [fondo, fondo, fondo]
  const figura = resto.reduce((a, b) => (contraste(fondo, b) > contraste(fondo, a) ? b : a))
  const detalle = resto.find((x) => x !== figura) ?? figura
  return [fondo, figura, detalle]
}

export default function IconoApp({ icono, colores, nombre, size = 72 }) {
  const { original, Dibujo } = ICONOS[icono]
  const c = colores ? colorearIcono(colores) : original
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img"
      aria-label={`Ícono de ${nombre}`}>
      <rect width="100" height="100" rx="22" fill={c[0]} />
      <Dibujo c={c} />
    </svg>
  )
}
