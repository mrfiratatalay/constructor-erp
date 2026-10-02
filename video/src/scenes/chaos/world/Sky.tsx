import { useFilmTime } from '../../../film/clock'

export const SUN = { x: 1288, y: 480 }

const Hills = () => (
  <g>
    <path
      d="M0 575 C140 548 260 540 380 556 C520 574 610 536 760 530 C900 524 1010 552 1140 548 C1290 543 1400 520 1560 530 C1700 539 1820 556 1920 548 V700 H0Z"
      fill="#b9b7bd"
      opacity={0.75}
    />
    <path
      d="M0 600 C180 586 300 594 470 586 C640 578 760 598 930 592 C1120 585 1260 600 1450 590 C1640 580 1780 596 1920 588 V700 H0Z"
      fill="#a3a7b3"
      opacity={0.8}
    />
  </g>
)

/** Uzaktaki şehir: pusun içinde kaybolan apartman blokları. */
const DistantBlocks = () => {
  const blocks = [
    [270, 548, 46, 52], [326, 536, 34, 64], [372, 556, 58, 44], [1580, 540, 40, 60], [1630, 552, 64, 48],
    [1712, 530, 36, 70], [1760, 556, 52, 44], [520, 560, 40, 40], [570, 546, 30, 54],
  ]
  return (
    <g fill="#a9aab4" opacity={0.7}>
      {blocks.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
      ))}
    </g>
  )
}

/** Sabah gökyüzü: alçak güneş, puslu ufuk. Işık arkadan gelir; şantiye silüete döner. */
export const Sky = () => {
  const t = useFilmTime()
  const sunPulse = 1 + Math.sin(t * 0.9) * 0.015
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="sky-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c6188" />
          <stop offset="0.26" stopColor="#8d92a6" />
          <stop offset="0.42" stopColor="#d4ae8c" />
          <stop offset="0.5" stopColor="#f2bf82" />
          <stop offset="0.58" stopColor="#fbd6a0" />
          <stop offset="1" stopColor="#f5d5ae" />
        </linearGradient>
        <radialGradient id="sky-sun-glow">
          <stop offset="0" stopColor="#fff6e2" stopOpacity={1} />
          <stop offset="0.18" stopColor="#ffe7bd" stopOpacity={0.85} />
          <stop offset="0.5" stopColor="#ffd59a" stopOpacity={0.3} />
          <stop offset="1" stopColor="#ffd59a" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="sky-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe6c8" stopOpacity={0} />
          <stop offset="1" stopColor="#fbe6c8" stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#sky-base)" />
      <circle cx={SUN.x} cy={SUN.y} r={640 * sunPulse} fill="url(#sky-sun-glow)" />
      <DistantBlocks />
      <Hills />
      <circle cx={SUN.x} cy={SUN.y} r={40} fill="#fffaf0" />
      <rect y={470} width={1920} height={200} fill="url(#sky-haze)" />
    </svg>
  )
}
