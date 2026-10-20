export function hexARgb(hex) {
  const h = hex.replace('#', '')
  const completo = h.length === 3 ? h.split('').map((x) => x + x).join('') : h
  const n = parseInt(completo, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function luminancia({ r, g, b }) {
  const f = (v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

export function textoSobre(hex) {
  return luminancia(hexARgb(hex)) > 0.179 ? '#111111' : '#ffffff'
}

export function hexAHsl(hex) {
  const { r, g, b } = hexARgb(hex)
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min
  let h = 0, s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: s * 100, l: l * 100 }
}

export function hslAHex({ h, s, l }) {
  const sn = s / 100, ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const hh = (((h % 360) + 360) % 360) / 60
  const x = c * (1 - Math.abs((hh % 2) - 1))
  let r = 0, g = 0, b = 0
  if (hh < 1) [r, g, b] = [c, x, 0]
  else if (hh < 2) [r, g, b] = [x, c, 0]
  else if (hh < 3) [r, g, b] = [0, c, x]
  else if (hh < 4) [r, g, b] = [0, x, c]
  else if (hh < 5) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const m = ln - c / 2
  const a2 = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${a2(r)}${a2(g)}${a2(b)}`.toUpperCase()
}

// Cada esquema es una lista de [giro de tono en grados, cambio de luminosidad]
const DEF = {
  complementaria: [[0, 0], [180, 0], [0, 25], [180, -20]],
  analoga: [[-30, 0], [-15, 0], [0, 0], [15, 0], [30, 0]],
  triadica: [[0, 0], [120, 0], [240, 0]],
  tetradica: [[0, 0], [90, 0], [180, 0], [270, 0]],
  monocromatica: [[0, -30], [0, -15], [0, 0], [0, 15], [0, 30]],
}

export const ESQUEMAS = [
  ['complementaria', 'Complementaria'],
  ['analoga', 'Análoga'],
  ['triadica', 'Triádica'],
  ['tetradica', 'Tetrádica'],
  ['monocromatica', 'Monocromática'],
]

const limitar = (v, min, max) => Math.min(max, Math.max(min, v))

export function generarEsquema(base, tipo) {
  const { h, s, l } = hexAHsl(base)
  return DEF[tipo].map(([dh, dl]) =>
    hslAHex({ h: h + dh, s, l: limitar(l + dl, 8, 92) })
  )
}

export function contraste(a, b) {
  const la = luminancia(hexARgb(a))
  const lb = luminancia(hexARgb(b))
  const [alto, bajo] = la > lb ? [la, lb] : [lb, la]
  return (alto + 0.05) / (bajo + 0.05)
}
