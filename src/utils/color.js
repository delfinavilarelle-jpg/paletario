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
