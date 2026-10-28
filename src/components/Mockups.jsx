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

export function MockRopa({ c }) {
  const camisa = rol(c, 0), pantalon = rol(c, 1), calzado = rol(c, 2), detalle = rol(c, 3), gorro = rol(c, 4)
  return (
    <svg viewBox="0 0 400 520" className="mock" role="img" aria-label="Tu paleta en un outfit">
      <rect width="400" height="520" rx="28" fill="#EFEDE8" />
      <path d="M22 78q0-48 52-48q52 0 52 48z" fill={gorro} />
      <rect x="14" y="76" width="128" height="12" rx="6" fill={gorro} opacity=".8" />
      <path d="M120 66L160 46Q200 84 240 46L280 66L330 116L295 146L270 126V266H130V126L105 146L70 116Z" fill={camisa} />
      <path d="M160 46Q200 84 240 46Q200 66 160 46Z" fill="#EFEDE8" />
      <rect x="214" y="156" width="38" height="42" rx="5" fill={detalle} />
      <path d="M130 280H270L284 470H214L200 346L186 470H116Z" fill={pantalon} />
      <rect x="130" y="280" width="140" height="14" fill={detalle} />
      <path d="M98 474H190V500Q190 508 182 508H106Q98 508 98 500Z" fill={calzado} />
      <path d="M210 474H302V500Q302 508 294 508H218Q210 508 210 500Z" fill={calzado} />
      <rect x="98" y="500" width="92" height="8" rx="4" fill="#fff" opacity=".85" />
      <rect x="210" y="500" width="92" height="8" rx="4" fill="#fff" opacity=".85" />
      <path d="M322 340q0-28 28-28q28 0 28 28" fill="none" stroke={detalle} strokeWidth="8" />
      <rect x="312" y="336" width="76" height="86" rx="12" fill={detalle} />
      <rect x="326" y="352" width="48" height="10" rx="5" fill="#fff" opacity=".35" />
    </svg>
  )
}

export function MockAmbiente({ c }) {
  const pared = rol(c, 0), piso = rol(c, 1), sillon = rol(c, 2), almohadon = rol(c, 3), planta = rol(c, 4)
  return (
    <svg viewBox="0 0 520 400" className="mock" role="img" aria-label="Tu paleta en un ambiente">
      <rect width="520" height="290" fill={pared} />
      <rect y="290" width="520" height="110" fill={piso} />
      <rect y="286" width="520" height="8" fill="#000" opacity=".12" />
      <rect x="56" y="50" width="130" height="150" rx="6" fill="#fff" />
      <rect x="64" y="58" width="114" height="134" fill={sillon} opacity=".35" />
      <path d="M121 58V192M64 125H178" stroke="#fff" strokeWidth="6" />
      <rect x="296" y="62" width="96" height="122" rx="4" fill={almohadon} />
      <rect x="306" y="72" width="76" height="102" fill={pared} opacity=".9" />
      <circle cx="344" cy="112" r="22" fill={sillon} />
      <path d="M318 160q26-30 52 0z" fill={planta} />
      <ellipse cx="270" cy="352" rx="190" ry="34" fill={almohadon} opacity=".85" />
      <ellipse cx="270" cy="352" rx="130" ry="22" fill={pared} opacity=".7" />
      <rect x="150" y="176" width="240" height="84" rx="20" fill={sillon} />
      <rect x="132" y="206" width="48" height="84" rx="16" fill={sillon} />
      <rect x="360" y="206" width="48" height="84" rx="16" fill={sillon} />
      <rect x="178" y="226" width="184" height="64" rx="12" fill={sillon} />
      <rect x="178" y="226" width="184" height="64" rx="12" fill="#000" opacity=".08" />
      <rect x="196" y="204" width="52" height="46" rx="10" fill={almohadon} transform="rotate(-8 222 227)" />
      <rect x="296" y="208" width="52" height="42" rx="10" fill={pared} transform="rotate(7 322 229)" />
      <rect x="146" y="290" width="10" height="14" rx="3" fill="#000" opacity=".5" />
      <rect x="384" y="290" width="10" height="14" rx="3" fill="#000" opacity=".5" />
      <rect x="446" y="150" width="6" height="170" fill="#000" opacity=".55" />
      <path d="M424 150L474 150L462 96L436 96Z" fill={almohadon} />
      <ellipse cx="449" cy="322" rx="26" ry="7" fill="#000" opacity=".5" />
      <path d="M30 330L60 330L56 290L34 290Z" fill={almohadon} />
      <path d="M45 292q-30-30-12-64q22 22 12 64zM45 292q30-26 22-62q-26 18-22 62z" fill={planta} />
    </svg>
  )
}
