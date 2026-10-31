// Escenas para probar una paleta pieza por pieza.
// Cada pieza tiene un peso (cuánto ocupa a la vista) y un rol inicial (qué color de la paleta toma).
// El dibujo recibe p(id), que devuelve el color, el clic y la marca de selección de esa pieza.

function Casual({ p }) {
  return (
    <svg viewBox="0 0 400 520" className="mock escena" role="img" aria-label="Outfit casual">
      <rect width="400" height="520" fill="#F3F1EC" />
      <ellipse cx="200" cy="506" rx="150" ry="10" fill="#000" opacity=".06" />
      <g {...p('gorra')}>
        <path d="M150 52q0-40 50-40q50 0 50 40z" />
        <rect x="140" y="48" width="140" height="11" rx="5.5" />
      </g>
      <path {...p('remera')} d="M120 86L162 66Q200 102 238 66L280 86L328 134L294 164L270 146V276H130V146L106 164L72 134Z" />
      <path d="M162 66Q200 102 238 66Q200 84 162 66Z" fill="#F3F1EC" />
      <rect {...p('detalle')} x="214" y="172" width="36" height="40" rx="5" />
      <path {...p('pantalon')} d="M130 290H270L282 474H214L200 352L186 474H118Z" />
      <rect {...p('detalle')} x="130" y="290" width="140" height="13" />
      <g {...p('zapatillas')}>
        <path d="M100 478H190V502Q190 510 182 510H108Q100 510 100 502Z" />
        <path d="M210 478H300V502Q300 510 292 510H218Q210 510 210 502Z" />
      </g>
      <rect x="100" y="502" width="90" height="8" rx="4" fill="#fff" opacity=".85" pointerEvents="none" />
      <rect x="210" y="502" width="90" height="8" rx="4" fill="#fff" opacity=".85" pointerEvents="none" />
      <g {...p('bolso')}>
        <path d="M318 330q0-30 30-30q30 0 30 30" fill="none" strokeWidth="8" stroke="currentColor" />
        <rect x="306" y="326" width="84" height="94" rx="14" />
      </g>
    </svg>
  )
}

function Formal({ p }) {
  return (
    <svg viewBox="0 0 400 520" className="mock escena" role="img" aria-label="Outfit formal">
      <rect width="400" height="520" fill="#F3F1EC" />
      <ellipse cx="200" cy="506" rx="150" ry="10" fill="#000" opacity=".06" />
      <path {...p('camisa')} d="M164 48H236L244 280H156Z" />
      <path {...p('corbata')} d="M193 66H207L213 160L200 178L187 160Z" />
      <g {...p('saco')}>
        <path d="M116 80L166 50L200 180L234 50L284 80L298 284H102Z" />
        <path d="M116 80L82 108L70 256H100L112 150Z" />
        <path d="M284 80L318 108L330 256H300L288 150Z" />
      </g>
      <path d="M166 50L200 180L184 104L176 96Z M234 50L200 180L216 104L224 96Z" fill="#000" opacity=".12" pointerEvents="none" />
      <rect {...p('panuelo')} x="236" y="124" width="30" height="12" rx="3" />
      <g fill="#000" opacity=".35" pointerEvents="none">
        <circle cx="200" cy="214" r="4" /><circle cx="200" cy="244" r="4" />
      </g>
      <rect {...p('cinturon')} x="118" y="284" width="164" height="14" />
      <path {...p('pantalon')} d="M118 298H282L290 474H216L200 350L184 474H110Z" />
      <g {...p('zapatos')}>
        <path d="M96 478H192V500Q192 510 182 510H104Q96 510 96 500Z" />
        <path d="M208 478H304V500Q304 510 294 510H216Q208 510 208 500Z" />
      </g>
    </svg>
  )
}

function Living({ p }) {
  return (
    <svg viewBox="0 0 520 400" className="mock escena" role="img" aria-label="Living">
      <rect {...p('pared')} width="520" height="290" />
      <rect {...p('piso')} y="290" width="520" height="110" />
      <rect y="286" width="520" height="8" fill="#000" opacity=".12" pointerEvents="none" />
      <g pointerEvents="none">
        <rect x="56" y="50" width="130" height="150" rx="6" fill="#fff" />
        <rect x="64" y="58" width="114" height="134" fill="#DDE7EE" />
        <path d="M121 58V192M64 125H178" stroke="#fff" strokeWidth="6" />
      </g>
      <rect {...p('cuadro')} x="296" y="62" width="96" height="122" rx="4" />
      <rect x="306" y="72" width="76" height="102" fill="#fff" opacity=".85" pointerEvents="none" />
      <circle {...p('almohadones')} cx="344" cy="112" r="22" />
      <path {...p('planta')} d="M318 160q26-30 52 0z" />
      <g {...p('alfombra')}>
        <ellipse cx="270" cy="352" rx="190" ry="34" />
      </g>
      <ellipse cx="270" cy="352" rx="130" ry="22" fill="#fff" opacity=".25" pointerEvents="none" />
      <g {...p('sillon')}>
        <rect x="150" y="176" width="240" height="84" rx="20" />
        <rect x="132" y="206" width="48" height="84" rx="16" />
        <rect x="360" y="206" width="48" height="84" rx="16" />
        <rect x="178" y="226" width="184" height="64" rx="12" />
      </g>
      <rect x="178" y="226" width="184" height="64" rx="12" fill="#000" opacity=".08" pointerEvents="none" />
      <g {...p('almohadones')}>
        <rect x="196" y="204" width="52" height="46" rx="10" transform="rotate(-8 222 227)" />
        <rect x="296" y="208" width="52" height="42" rx="10" transform="rotate(7 322 229)" />
      </g>
      <g fill="#000" opacity=".5" pointerEvents="none">
        <rect x="146" y="290" width="10" height="14" rx="3" />
        <rect x="384" y="290" width="10" height="14" rx="3" />
        <rect x="446" y="150" width="6" height="170" />
        <ellipse cx="449" cy="322" rx="26" ry="7" />
      </g>
      <path {...p('lampara')} d="M424 150L474 150L462 96L436 96Z" />
      <path {...p('maceta')} d="M30 330L60 330L56 290L34 290Z" />
      <path {...p('planta')} d="M45 292q-30-30-12-64q22 22 12 64zM45 292q30-26 22-62q-26 18-22 62z" />
    </svg>
  )
}

function Dormitorio({ p }) {
  return (
    <svg viewBox="0 0 520 400" className="mock escena" role="img" aria-label="Dormitorio">
      <rect {...p('pared')} width="520" height="290" />
      <rect {...p('piso')} y="290" width="520" height="110" />
      <rect y="286" width="520" height="8" fill="#000" opacity=".12" pointerEvents="none" />
      <rect x="380" y="46" width="104" height="150" rx="4" fill="#DDE7EE" pointerEvents="none" />
      <g {...p('cortinas')}>
        <path d="M368 36H408Q398 120 412 214H368Z" />
        <path d="M456 36H496V214H452Q466 120 456 36Z" />
      </g>
      <rect x="364" y="30" width="136" height="8" rx="4" fill="#000" opacity=".45" pointerEvents="none" />
      <rect {...p('cuadro')} x="196" y="54" width="92" height="60" rx="3" />
      <rect x="204" y="62" width="76" height="44" fill="#fff" opacity=".8" pointerEvents="none" />
      <ellipse {...p('alfombra')} cx="250" cy="358" rx="200" ry="30" />
      <rect {...p('respaldo')} x="116" y="132" width="252" height="150" rx="22" />
      <g {...p('almohadas')}>
        <rect x="140" y="190" width="94" height="42" rx="14" />
        <rect x="250" y="190" width="94" height="42" rx="14" />
      </g>
      <path {...p('acolchado')} d="M96 228H388V300Q388 314 374 314H110Q96 314 96 300Z" />
      <rect x="96" y="228" width="292" height="18" fill="#fff" opacity=".22" pointerEvents="none" />
      <rect x="106" y="314" width="10" height="16" rx="3" fill="#000" opacity=".45" pointerEvents="none" />
      <rect x="368" y="314" width="10" height="16" rx="3" fill="#000" opacity=".45" pointerEvents="none" />
      <rect {...p('mesa')} x="24" y="226" width="62" height="72" rx="6" />
      <rect x="32" y="258" width="46" height="4" rx="2" fill="#000" opacity=".2" pointerEvents="none" />
      <rect x="51" y="188" width="8" height="38" fill="#000" opacity=".45" pointerEvents="none" />
      <path {...p('lampara')} d="M32 192H78L68 156H42Z" />
    </svg>
  )
}

export const ESCENAS = [
  {
    id: 'casual', grupo: 'Ropa', nombre: 'Outfit casual', Dibujo: Casual,
    partes: [
      { id: 'remera', nombre: 'Remera', peso: 34, rol: 0 },
      { id: 'pantalon', nombre: 'Pantalón', peso: 30, rol: 1 },
      { id: 'bolso', nombre: 'Bolso', peso: 12, rol: 2 },
      { id: 'zapatillas', nombre: 'Zapatillas', peso: 9, rol: 3 },
      { id: 'gorra', nombre: 'Gorra', peso: 8, rol: 0 },
      { id: 'detalle', nombre: 'Bolsillo y cinturón', peso: 5, rol: 4 },
    ],
  },
  {
    id: 'formal', grupo: 'Ropa', nombre: 'Outfit formal', Dibujo: Formal,
    partes: [
      { id: 'saco', nombre: 'Saco', peso: 40, rol: 0 },
      { id: 'pantalon', nombre: 'Pantalón', peso: 28, rol: 0 },
      { id: 'camisa', nombre: 'Camisa', peso: 10, rol: 1 },
      { id: 'zapatos', nombre: 'Zapatos', peso: 9, rol: 2 },
      { id: 'cinturon', nombre: 'Cinturón', peso: 4, rol: 2 },
      { id: 'corbata', nombre: 'Corbata', peso: 6, rol: 3 },
      { id: 'panuelo', nombre: 'Pañuelo', peso: 2, rol: 3 },
    ],
  },
  {
    id: 'living', grupo: 'Ambientes', nombre: 'Living', Dibujo: Living,
    partes: [
      { id: 'pared', nombre: 'Pared', peso: 46, rol: 0 },
      { id: 'piso', nombre: 'Piso', peso: 16, rol: 1 },
      { id: 'sillon', nombre: 'Sillón', peso: 16, rol: 2 },
      { id: 'alfombra', nombre: 'Alfombra', peso: 9, rol: 3 },
      { id: 'almohadones', nombre: 'Almohadones', peso: 4, rol: 4 },
      { id: 'cuadro', nombre: 'Cuadro', peso: 4, rol: 3 },
      { id: 'lampara', nombre: 'Lámpara', peso: 2, rol: 4 },
      { id: 'planta', nombre: 'Planta', peso: 2, rol: 1 },
      { id: 'maceta', nombre: 'Maceta', peso: 1, rol: 3 },
    ],
  },
  {
    id: 'dormitorio', grupo: 'Ambientes', nombre: 'Dormitorio', Dibujo: Dormitorio,
    partes: [
      { id: 'pared', nombre: 'Pared', peso: 42, rol: 0 },
      { id: 'piso', nombre: 'Piso', peso: 14, rol: 1 },
      { id: 'acolchado', nombre: 'Acolchado', peso: 14, rol: 2 },
      { id: 'respaldo', nombre: 'Respaldo', peso: 10, rol: 1 },
      { id: 'alfombra', nombre: 'Alfombra', peso: 7, rol: 3 },
      { id: 'cortinas', nombre: 'Cortinas', peso: 6, rol: 3 },
      { id: 'almohadas', nombre: 'Almohadas', peso: 3, rol: 4 },
      { id: 'mesa', nombre: 'Mesa de luz', peso: 2, rol: 1 },
      { id: 'cuadro', nombre: 'Cuadro', peso: 1, rol: 4 },
      { id: 'lampara', nombre: 'Lámpara', peso: 1, rol: 4 },
    ],
  },
]
