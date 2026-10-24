import { textoSobre } from '../utils/color'

const rol = (c, i) => c[i % c.length]

export function MockWeb({ c }) {
  const fondo = rol(c, 1), pill = rol(c, 2), img = rol(c, 0), oscuro = rol(c, 3)
  return (
    <svg viewBox="0 0 537 357" className="mock" role="img" aria-label="Tu paleta en una web">
      <rect width="537" height="357" fill={fondo} />
      {[14, 112, 210].map((x) => <rect key={x} x={x} y="20" width="91" height="26" rx="13" fill={pill} />)}
      <g fill={textoSobre(fondo)} fontSize="18">
        <text x="40" y="104">Aquí pruebas tu</text>
        <text x="40" y="127">paleta en una</text>
        <text x="40" y="150">web</text>
      </g>
      <rect x="245" y="65" width="270" height="139" rx="14" fill={img} />
      {[28, 201, 370].map((x) => (
        <g key={x}>
          <path d={`M${x} 287V262a22 22 0 0 1 22-22h110a22 22 0 0 1 22 22v25z`} fill="#D9D9D9" />
          <rect x={x} y="287" width="154" height="48" fill={oscuro} />
        </g>
      ))}
    </svg>
  )
}

export function MockApp({ c }) {
  const pantalla = rol(c, 1), tarjeta = rol(c, 0), circulos = rol(c, 2), arriba = rol(c, 3), abajo = rol(c, 0)
  return (
    <svg viewBox="0 0 311 543" className="mock" role="img" aria-label="Tu paleta en una app">
      <rect width="311" height="543" rx="52" fill="#FFFDFD" />
      <rect x="24" y="31" width="264" height="483" rx="40" fill={pantalla} />
      <rect x="43" y="50" width="227" height="127" rx="40" fill={tarjeta} />
      {[79, 154, 234].map((cx) => <circle key={cx} cx={cx} cy="219" r="27" fill={circulos} />)}
      <clipPath id="bloque-app"><rect x="52" y="280" width="84" height="163" rx="8" /></clipPath>
      <g clipPath="url(#bloque-app)">
        <rect x="52" y="280" width="84" height="103" fill={arriba} />
        <rect x="52" y="383" width="84" height="60" fill={abajo} />
      </g>
      <g fill={textoSobre(pantalla)} fontSize="18">
        <text x="151" y="304">Aquí</text>
        <text x="151" y="327">puedes ver</text>
        <text x="151" y="350">tu paleta</text>
        <text x="151" y="373">en una app</text>
      </g>
    </svg>
  )
}

export function MockPoster({ c }) {
  const fondo = rol(c, 2), bloque = rol(c, 1), oscuro = rol(c, 3), circulo = rol(c, 0)
  const linea = textoSobre(fondo)
  return (
    <svg viewBox="0 0 437 624" className="mock" role="img" aria-label="Tu paleta en un póster">
      <rect width="437" height="624" fill={fondo} />
      <g stroke={linea} strokeWidth="1.2" opacity=".85">
        {[41, 103, 164, 225, 274, 335, 398].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="624" />)}
        {[62, 126, 190, 254, 319, 385, 450, 514, 579].map((y) => <line key={y} x1="0" y1={y} x2="437" y2={y} />)}
      </g>
      <polygon points="274,0 398,0 398,190 335,190 335,254 274,254" fill={bloque} />
      <polygon points="0,319 66,319 66,450 122,450 122,624 0,624" fill={oscuro} />
      <rect x="164" y="579" width="189" height="45" fill={bloque} />
      <circle cx="267" cy="408" r="107" fill={circulo} />
      <g fill={linea} fontSize="20">
        <text x="10" y="174">Aquí puedes probar</text>
        <text x="10" y="202">tu paleta en un póster</text>
      </g>
    </svg>
  )
}
