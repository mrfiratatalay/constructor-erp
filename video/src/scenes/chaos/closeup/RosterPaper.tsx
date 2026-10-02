import { useFilmTime } from '../../../film/clock'
import { HAND, SANS } from '../../../theme/fonts'
import { progress } from '../../../motion/ease'

const NAMES = ['Ali', 'Murat', 'Emre', 'Hasan', 'Kemal', 'Yusuf', 'İbrahim']
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
const GRID = { left: 70, top: 190, nameWidth: 190, column: 92, row: 74 }
const INK = '#1f3a8a'

type Mark = 'tick' | 'cross' | 'half' | 'izin' | '?' | ''
const MARKS: Mark[] = ['tick', 'tick', 'half', 'tick', 'cross', 'tick', 'izin', 'tick', '?', 'tick', 'tick', 'cross']
const markFor = (row: number, day: number): Mark => (day >= 4 ? '' : MARKS[(row * 5 + day * 2) % MARKS.length])

/** Elle çizilmiş işaret: tik, çarpı ya da yazı. Yol biraz eğri, kalem baskısı biraz değişken. */
const HandMark = ({ mark, x, y }: { mark: Mark; x: number; y: number }) => {
  if (mark === 'tick') return <path d={`M${x - 16} ${y} l10 13 l22 -30`} stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
  if (mark === 'cross') return <path d={`M${x - 13} ${y - 14} l26 26 M${x + 13} ${y - 14} l-25 27`} stroke="#9f1239" strokeWidth={4} fill="none" strokeLinecap="round" />
  if (mark === '') return null
  const label = mark === 'half' ? '1/2' : mark
  return <text x={x} y={y + 12} textAnchor="middle" fontFamily={HAND} fontSize={36} fill={INK}>{label}</text>
}

/** Şu an çizilen tik: Murat, Cuma (bugün). Kalemin ucu çizgiyi izler. */
const LiveTick = ({ from }: { from: number }) => {
  const t = useFilmTime()
  const drawn = progress(t, from, 0.32)
  const x = GRID.left + GRID.nameWidth + GRID.column * 4.5
  const y = GRID.top + GRID.row * 1.5
  return (
    <path d={`M${x - 16} ${y} l10 13 l22 -30`} stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round"
      strokeDasharray={60} strokeDashoffset={60 * (1 - drawn)} />
  )
}

/** Panoya kıstırılmış yoklama kâğıdı: matbu çizelge, elle doldurulmuş, kahve lekeli. */
export const RosterPaper = ({ tickAt }: { tickAt: number }) => (
  <svg viewBox="0 0 860 820" width={860} height={820}>
    <rect width={860} height={820} fill="#f3eee2" />
    <text x={70} y={92} fontFamily={SANS} fontWeight={800} fontSize={30} fill="#3c4558" letterSpacing={2}>GÜNLÜK YOKLAMA</text>
    <text x={560} y={92} fontFamily={HAND} fontSize={40} fill={INK}>40. hafta</text>
    <g stroke="#9aa7bd" strokeWidth={1.5}>
      {Array.from({ length: NAMES.length + 2 }, (_, index) => (
        <line key={index} x1={GRID.left} x2={800} y1={GRID.top - GRID.row + index * GRID.row} y2={GRID.top - GRID.row + index * GRID.row} />
      ))}
      {Array.from({ length: DAYS.length + 1 }, (_, index) => (
        <line key={index} y1={GRID.top - GRID.row} y2={GRID.top + GRID.row * NAMES.length}
          x1={GRID.left + GRID.nameWidth + index * GRID.column} x2={GRID.left + GRID.nameWidth + index * GRID.column} />
      ))}
    </g>
    {DAYS.map((day, index) => (
      <text key={day} x={GRID.left + GRID.nameWidth + GRID.column * (index + 0.5)} y={GRID.top - 26} textAnchor="middle"
        fontFamily={SANS} fontWeight={700} fontSize={20} fill="#4b5563">{day}</text>
    ))}
    {NAMES.map((name, row) => (
      <g key={name}>
        <text x={GRID.left + 14} y={GRID.top + GRID.row * row + 50} fontFamily={HAND} fontSize={44} fill={INK}>{name}</text>
        {DAYS.map((day, column) => (
          <HandMark key={day} mark={markFor(row, column)} x={GRID.left + GRID.nameWidth + GRID.column * (column + 0.5)}
            y={GRID.top + GRID.row * row + 34} />
        ))}
      </g>
    ))}
    <path d="M276 448 l170 -4" stroke={INK} strokeWidth={3} opacity={0.8} />
    <text x={470} y={720} fontFamily={HAND} fontSize={38} fill="#9f1239" transform="rotate(-4 470 720)">Ali yarım mı?? sor!</text>
    <circle cx={690} cy={640} r={74} stroke="#8b5e3c" strokeWidth={9} fill="none" opacity={0.22} />
    <LiveTick from={tickAt} />
  </svg>
)
