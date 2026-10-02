import { useFilmTime } from '../../../film/clock'

export const WINDOW = { left: 250, top: 58, right: 1670, bottom: 656 }
const MULLIONS = [716, 1194]

/** Duvar: pencere boşluğu olan karanlık yüzey. Pencereye yakın kısım yansıyan ışıkla biraz aydınlık. */
const Wall = () => {
  const { left, top, right, bottom } = WINDOW
  const hole = `M${left} ${top} H${right} V${bottom} H${left}Z`
  return (
    <g>
      <defs>
        <radialGradient id="wall-bounce" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#2a2b36" />
          <stop offset="0.62" stopColor="#13161f" />
          <stop offset="1" stopColor="#090b12" />
        </radialGradient>
      </defs>
      <path d={`M-400 -300 H2320 V1380 H-400Z ${hole}`} fillRule="evenodd" fill="url(#wall-bounce)" />
    </g>
  )
}

/** Alüminyum çerçeve, kayıtlar ve pervaz: iç kenarlar sabah ışığını yakalar. */
const WindowFrame = () => {
  const { left, top, right, bottom } = WINDOW
  return (
    <g>
      <rect x={left - 14} y={top - 14} width={right - left + 28} height={bottom - top + 28} fill="none"
        stroke="#262c3a" strokeWidth={28} />
      <rect x={left} y={top} width={right - left} height={bottom - top} fill="none" stroke="#f0c98f"
        strokeWidth={1.5} opacity={0.45} />
      {MULLIONS.map((x) => (
        <g key={x}>
          <rect x={x - 8} y={top} width={16} height={bottom - top} fill="#232937" />
          <rect x={x + 6} y={top} width={2} height={bottom - top} fill="#f3cf98" opacity={0.5} />
        </g>
      ))}
      <rect x={left - 40} y={bottom + 6} width={right - left + 80} height={20} fill="#222838" />
      <rect x={left - 40} y={bottom + 6} width={right - left + 80} height={2} fill="#e8c18a" opacity={0.35} />
    </g>
  )
}

/** Yarı toplanmış jaluzi: ışık lamellerin arasından süzülür. */
const Blinds = () => {
  const { left, top, right } = WINDOW
  return (
    <g>
      {Array.from({ length: 3 }, (_, index) => (
        <rect key={index} x={left} y={top + index * 10} width={right - left} height={7} fill="#cbbfae" opacity={0.92} />
      ))}
      <rect x={left} y={top + 30} width={right - left} height={5} fill="#a99c8a" />
      <line x1={1630} y1={top + 34} x2={1630} y2={top + 220} stroke="#a99c8a" strokeWidth={1.4} />
    </g>
  )
}

/** Mantar pano: iğnelenmiş kâğıtlar ve yapışkan notlar. Bilginin dağınıklığının sessiz bir işareti. */
const Corkboard = () => {
  const notes: Array<[number, number, number, number, string, number]> = [
    [58, 182, 70, 88, '#bcb6a9', -4], [130, 176, 70, 60, '#c7c1b3', 3], [64, 288, 60, 56, '#d6bd57', 5],
    [134, 262, 66, 82, '#b9b3a6', -2], [74, 360, 54, 50, '#cf8c90', -6], [138, 366, 58, 54, '#d6bd57', 4],
    [60, 424, 76, 38, '#bdb7aa', 2],
  ]
  return (
    <g>
      <rect x={40} y={160} width={176} height={316} fill="#3f342a" stroke="#241e19" strokeWidth={8} />
      {notes.map(([x, y, w, h, fill, angle]) => (
        <g key={`${x}-${y}`} transform={`rotate(${angle} ${x + w / 2} ${y + h / 2})`}>
          <rect x={x} y={y} width={w} height={h} fill={fill} opacity={0.62} />
          <circle cx={x + w / 2} cy={y + 5} r={2.6} fill="#a33a3a" opacity={0.8} />
        </g>
      ))}
    </g>
  )
}

/** Duvar saati: 06:52. Gün yeni başlamış; kaos çoktan başlamış. */
const Clock = ({ calm }: { calm: boolean }) => {
  const t = useFilmTime()
  const second = (Math.floor(t) * 6 + 180) % 360
  return (
    <g transform="translate(1796 214)">
      <circle r={56} fill="#252a37" />
      <circle r={49} fill="#77777a" />
      {Array.from({ length: 12 }, (_, index) => (
        <rect key={index} x={-1.2} y={-45} width={2.4} height={7} fill="#2c2f38" transform={`rotate(${index * 30})`} />
      ))}
      <rect x={-2.2} y={-26} width={4.4} height={28} rx={2} fill="#22252e" transform={`rotate(${calm ? 160 : 206})`} />
      <rect x={-1.6} y={-40} width={3.2} height={42} rx={1.5} fill="#22252e" transform={`rotate(${calm ? 120 : 312})`} />
      <rect x={-0.6} y={-42} width={1.2} height={48} fill="#8f2d2d" transform={`rotate(${second})`} />
      <circle r={3} fill="#22252e" />
    </g>
  )
}

/** Şantiye ofisinin içi: karanlık duvar, geniş pencere, pano ve saat. */
export const OfficeWall = ({ calm = false }: { calm?: boolean }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', overflow: 'visible' }}>
    <Blinds />
    <Wall />
    <WindowFrame />
    <Corkboard />
    <Clock calm={calm} />
  </svg>
)
