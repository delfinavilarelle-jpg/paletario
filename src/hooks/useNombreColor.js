import { useEffect, useState } from 'react'
import { nombreDeColor } from '../services/colorApi'

// Consulta el nombre del color cada vez que cambia el hex (useEffect con dependencia).
// Espera 400 ms para no pedir uno por cada movimiento y cancela el pedido anterior.
export default function useNombreColor(hex) {
  const [estado, setEstado] = useState({ nombre: '', cargando: false, error: false })

  useEffect(() => {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return
    const control = new AbortController()
    const espera = setTimeout(async () => {
      setEstado({ nombre: '', cargando: true, error: false })
      try {
        const nombre = await nombreDeColor(hex, control.signal)
        setEstado({ nombre, cargando: false, error: false })
      } catch (e) {
        if (e.name !== 'AbortError') setEstado({ nombre: '', cargando: false, error: true })
      }
    }, 400)
    return () => {
      clearTimeout(espera)
      control.abort()
    }
  }, [hex])

  return estado
}
