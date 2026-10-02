import { useFilmTime } from '../../../film/clock'

const LEFT = 975
const RIGHT = 1525
const GROUND = 640
const FLOOR = 62
const LEVELS = 7
const COLUMNS = [988, 1073, 1158, 1243, 1328, 1413, 1498]
const CONCRETE = '#6d788c'
const SHADOW = '#5d687c'

const slabY = (level: number): number => GROUND - FLOOR * level

/** Kolonlar ve döşemeler: güneş arkada, yüzler gölgede, üst kenarlar ışık alır. */
const Frame = () => (
  <g>
    {COLUMNS.map((x) => (
      <rect key={x} x={x - 7} y={slabY(LEVELS)} width={14} height={GROUND - slabY(LEVELS)} fill={SHADOW} />
    ))}
    {Array.from({ length: LEVELS + 1 }, (_, level) => (
      <g key={level}>
        <rect x={LEFT} y={slabY(level) - 9} width={RIGHT - LEFT} height={10} fill={CONCRETE} />
        <rect x={LEFT} y={slabY(level) - 9} width={RIGHT - LEFT} height={1.6} fill="#e9c99c" opacity={0.5} />
      </g>
    ))}
    <rect x={1428} y={slabY(LEVELS) - 46} width={78} height={GROUND - slabY(LEVELS) + 46} fill="#626e83" />
    <rect x={1428} y={slabY(LEVELS) - 46} width={2} height={GROUND - slabY(LEVELS) + 46} fill="#f2d3a4" opacity={0.45} />
  </g>
)

/** Alt iki katta tuğla dolgu duvar ve pencere boşlukları: bina aşağıdan yukarı tamamlanıyor. */
const Infill = () => (
  <g>
    {[1, 2].map((level) =>
      COLUMNS.slice(0, -2).map((x, index) => (
        <g key={`${level}-${x}`}>
          <rect x={x + 7} y={slabY(level)} width={71} height={FLOOR - 10} fill="#7d6a66" />
          {index % 2 === 0 && <rect x={x + 26} y={slabY(level) + 14} width={30} height={26} fill="#2d3445" />}
        </g>
      )),
    )}
  </g>
)

/** En üst kat: kolon kalıpları (kontrplak) ve filiz demirleri. */
const TopFormwork = () => (
  <g>
    {COLUMNS.slice(1, -1).map((x) => (
      <g key={x}>
        <rect x={x - 13} y={slabY(LEVELS) - 58} width={26} height={50} fill="#8c7863" />
        <rect x={x - 13} y={slabY(LEVELS) - 58} width={26} height={2} fill="#f0cf9e" opacity={0.6} />
        {[-6, 0, 6].map((dx) => (
          <line key={dx} x1={x + dx} y1={slabY(LEVELS) - 58} x2={x + dx} y2={slabY(LEVELS) - 78}
            stroke="#5a6273" strokeWidth={1.4} />
        ))}
      </g>
    ))}
  </g>
)

/** Sol cephedeki iskele: dikmeler, yatay borular, çaprazlar ve güvenlik filesi. */
const Scaffold = () => {
  const standards = [960, 1018, 1076, 1134]
  const top = slabY(LEVELS) - 30
  const ledgers = Array.from({ length: 15 }, (_, index) => GROUND - index * 31)
  return (
    <g stroke="#4a5568" strokeWidth={2.2}>
      {standards.map((x) => (
        <line key={x} x1={x} y1={GROUND} x2={x} y2={top} />
      ))}
      {ledgers.map((y) => (
        <line key={y} x1={standards[0]} y1={y} x2={standards[3]} y2={y} strokeWidth={1.6} />
      ))}
      {ledgers.slice(0, -1).map((y, index) => (
        <line key={`d${y}`} x1={standards[index % 3]} y1={y} x2={standards[(index % 3) + 1]} y2={y - 31}
          strokeWidth={1.2} opacity={0.8} />
      ))}
      <rect x={standards[0]} y={top} width={standards[3] - standards[0]} height={140} fill="#5b6f6a"
        opacity={0.32} stroke="none" />
    </g>
  )
}

/** En üst katta çalışan küçük siluetler: şantiye uyanıyor. */
const Workers = () => {
  const t = useFilmTime()
  const people = [
    { x: 1110, speed: 9 },
    { x: 1290, speed: -6 },
    { x: 1365, speed: 4 },
  ]
  return (
    <g fill="#3c4558">
      {people.map(({ x, speed }) => {
        const px = x + Math.sin(t * 0.25 + x) * 6 + t * speed * 0.35
        return (
          <g key={x} transform={`translate(${px} ${slabY(LEVELS) - 9})`}>
            <rect x={-3} y={-16} width={6} height={12} rx={2} />
            <circle cx={0} cy={-19} r={3.2} />
            <path d="M-4 -20 a4 4 0 0 1 8 0z" fill="#d7ad3c" />
            <rect x={-3} y={-5} width={2.4} height={5} />
            <rect x={0.6} y={-5} width={2.4} height={5} />
          </g>
        )
      })}
    </g>
  )
}

/** Arkadan ışık alan, pusun içinde duran betonarme iskelet. */
export const SiteBuilding = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute' }}>
    <defs>
      <linearGradient id="building-haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f4dcc0" stopOpacity={0.05} />
        <stop offset="1" stopColor="#f4dcc0" stopOpacity={0.55} />
      </linearGradient>
    </defs>
    <Infill />
    <Frame />
    <TopFormwork />
    <Scaffold />
    <Workers />
    <rect x={930} y={150} width={620} height={500} fill="url(#building-haze)" />
  </svg>
)
