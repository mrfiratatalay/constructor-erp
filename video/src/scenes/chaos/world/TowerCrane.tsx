import { useFilmTime } from '../../../film/clock'

const MAST_X = 820
const MAST_TOP = 178
const GROUND = 660
const JIB_Y = 168
const JIB_END = 1660
const COUNTER_END = 652
const COLOR = '#9c8545'
const DARK = '#7c6a3c'

/** Kafes direk: iki dikme ve aralarında zikzak çaprazlar. */
const Mast = () => {
  const steps = Math.floor((GROUND - MAST_TOP) / 24)
  const zigzag = Array.from({ length: steps }, (_, index) => {
    const y = GROUND - index * 24
    const fromLeft = index % 2 === 0
    return `M${MAST_X + (fromLeft ? -12 : 12)} ${y} L${MAST_X + (fromLeft ? 12 : -12)} ${y - 24}`
  }).join(' ')
  return (
    <g stroke={COLOR} fill="none">
      <line x1={MAST_X - 12} y1={GROUND} x2={MAST_X - 12} y2={MAST_TOP} strokeWidth={3} />
      <line x1={MAST_X + 12} y1={GROUND} x2={MAST_X + 12} y2={MAST_TOP} strokeWidth={3} />
      <path d={zigzag} strokeWidth={1.4} />
    </g>
  )
}

/** Bom ve karşı bom: üçgen kafes, uçlara gergi halatları, karşı ağırlık blokları. */
const Jib = () => {
  const panels = Math.floor((JIB_END - MAST_X) / 30)
  const truss = Array.from({ length: panels }, (_, index) => {
    const x = MAST_X + index * 30
    return `M${x} ${JIB_Y + 8} L${x + 15} ${JIB_Y - 7} L${x + 30} ${JIB_Y + 8}`
  }).join(' ')
  return (
    <g stroke={COLOR} fill="none">
      <line x1={COUNTER_END} y1={JIB_Y} x2={JIB_END} y2={JIB_Y + 1} strokeWidth={3} />
      <line x1={MAST_X} y1={JIB_Y - 7} x2={JIB_END - 10} y2={JIB_Y - 5} strokeWidth={1.6} />
      <path d={truss} strokeWidth={1.1} />
      <path d={`M${MAST_X - 12} ${MAST_TOP - 18} L${MAST_X} ${MAST_TOP - 76} L${MAST_X + 12} ${MAST_TOP - 18}`}
        strokeWidth={2.6} />
      <line x1={MAST_X} y1={MAST_TOP - 76} x2={1290} y2={JIB_Y - 6} strokeWidth={1} />
      <line x1={MAST_X} y1={MAST_TOP - 76} x2={COUNTER_END + 8} y2={JIB_Y - 2} strokeWidth={1} />
      <g fill={DARK} stroke="none">
        <rect x={COUNTER_END + 6} y={JIB_Y + 3} width={34} height={26} />
        <rect x={COUNTER_END + 44} y={JIB_Y + 3} width={30} height={22} />
      </g>
      <rect x={MAST_X - 15} y={MAST_TOP - 14} width={30} height={20} fill={DARK} stroke="none" />
    </g>
  )
}

/** Araba, halat ve sallanan yük (demir demeti): sahnede yavaş, sürekli bir hayat. */
const Hook = () => {
  const t = useFilmTime()
  const trolley = 1170 + t * 2.4
  const swing = Math.sin(t * 0.85) * 2.2
  const length = 205 + Math.sin(t * 0.4) * 4
  return (
    <g transform={`translate(${trolley} ${JIB_Y + 4})`}>
      <rect x={-9} y={-3} width={18} height={8} fill={DARK} />
      <g transform={`rotate(${swing})`}>
        <line x1={-2} y1={4} x2={-2} y2={length} stroke="#5d5640" strokeWidth={1.2} />
        <line x1={2} y1={4} x2={2} y2={length} stroke="#5d5640" strokeWidth={1.2} />
        <path d={`M0 ${length} L-38 ${length + 22} M0 ${length} L38 ${length + 22}`} stroke="#5d5640" strokeWidth={1} />
        <rect x={-6} y={length - 8} width={12} height={10} fill={DARK} />
        <g fill="#586276">
          <rect x={-46} y={length + 21} width={92} height={4} />
          <rect x={-44} y={length + 26} width={88} height={4} />
          <rect x={-46} y={length + 31} width={92} height={4} />
        </g>
      </g>
    </g>
  )
}

/** Şantiyenin kule vinci. Ürünün logosu da bir kule vinç: film sonunda bu şekil işarete dönüşür. */
export const TowerCrane = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute' }}>
    <Mast />
    <Jib />
    <Hook />
  </svg>
)
