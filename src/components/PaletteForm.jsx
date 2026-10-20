import { useState } from 'react'
import { MOODS } from '../utils/constantes'

export default function PaletteForm({ editando, onGuardar, onCancelar }) {
  const [name, setName] = useState(editando?.name ?? '')
  const [colors, setColors] = useState(
    editando?.colors ?? ['#E4572E', '#F3A712', '#29335C']
  )
  const [mood, setMood] = useState(editando?.mood ?? MOODS[0])
  const [source, setSource] = useState(editando?.source ?? '')
  const [error, setError] = useState('')

  const cambiarColor = (i, valor) =>
    setColors(colors.map((c, j) => (j === i ? valor : c)))
  const agregarColor = () =>
    colors.length < 6 && setColors([...colors, '#CCCCCC'])
  const quitarColor = (i) =>
    colors.length > 3 && setColors(colors.filter((_, j) => j !== i))

  async function enviar(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Poné un nombre a la paleta')
      return
    }
    setError('')
    await onGuardar({
      name: name.trim(),
      colors: colors.map((c) => c.toUpperCase()),
      mood,
      source: source.trim(),
    })
  }

  return (
    <form className="form" onSubmit={enviar}>
      <h2>{editando ? 'Editar paleta' : 'Nueva paleta'}</h2>

      <label>
        Nombre
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <div className="colores">
        {colors.map((c, i) => (
          <div key={i} className="color-input">
            <input type="color" value={c} onChange={(e) => cambiarColor(i, e.target.value)} />
            <code>{c.toUpperCase()}</code>
            {colors.length > 3 && (
              <button type="button" onClick={() => quitarColor(i)}>×</button>
            )}
          </div>
        ))}
        {colors.length < 6 && (
          <button type="button" onClick={agregarColor}>+ Color</button>
        )}
      </div>

      <label>
        Mood
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          {MOODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>

      <label>
        Fuente (opcional)
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Una peli, una foto, un cartel…"
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="acciones">
        <button type="submit">{editando ? 'Guardar cambios' : 'Guardar paleta'}</button>
        {editando && <button type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}
