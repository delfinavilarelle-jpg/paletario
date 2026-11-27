// The Color API (https://www.thecolorapi.com): API pública y gratuita, no pide clave.
// Responde en JSON: el nombre de un color y esquemas de colores a partir de uno base.
const BASE = 'https://www.thecolorapi.com'

async function pedir(ruta, signal) {
  const respuesta = await fetch(BASE + ruta, { signal })
  if (!respuesta.ok) throw new Error(`La API respondió con el error ${respuesta.status}`)
  return respuesta.json()
}

// Nombre del color más parecido, por ejemplo #1F6F4A → "Green Pea"
export async function nombreDeColor(hex, signal) {
  const datos = await pedir(`/id?hex=${hex.slice(1)}`, signal)
  return datos.name.value
}

// Esquema de colores a partir de un color base (modo: monochrome, analogic, complement…)
export async function pedirEsquema(hex, modo, cantidad, signal) {
  const ruta = `/scheme?hex=${hex.slice(1)}&mode=${modo}&count=${cantidad}`
  const datos = await pedir(ruta, signal)
  return datos.colors.map((c) => ({ hex: c.hex.value, nombre: c.name.value }))
}
