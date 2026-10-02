// Şantiye ofisinin penceresi: sabah ışığı, Karadeniz tepeleri, kule vinci ve kaba inşaat silueti; hafif pus.
// Tamamen kodla çizilir (SVG). calm: kapanışta aynı pencere, daha sıcak ve sakin.
import { useCurrentFrame } from 'remotion'

const Frame: React.FC<{ x: number; floors: number; bays: number; w: number }> = ({ x, floors, bays, w }) => {
  const storey = 46
  const base = 820
  const bay = w / bays
  return (
    <g fill="#5d6b80" opacity={0.9}>
      {Array.from({ length: floors + 1 }, (_, f) => <rect key={`s${f}`} x={x - 6} y={base - f * storey - 6} width={w + 12} height={7} />)}
      {Array.from({ length: bays + 1 }, (_, b) => <rect key={`c${b}`} x={x + b * bay - 3} y={base - floors * storey} width={6} height={floors * storey} />)}
      {Array.from({ length: Math.max(0, floors - 2) }, (_, f) => (
        <rect key={`w${f}`} x={x} y={base - (f + 1) * storey} width={w} height={storey - 7} fill="#7a6a62" opacity={0.55} />
      ))}
    </g>
  )
}

const Crane: React.FC<{ x: number; height: number; sway: number }> = ({ x, height, sway }) => {
  const top = 820 - height
  const lattice = Array.from({ length: Math.floor(height / 18) }, (_, i) => (
    <path key={i} d={`M${x - 7} ${820 - i * 18} L${x + 7} ${820 - (i + 1) * 18} M${x + 7} ${820 - i * 18} L${x - 7} ${820 - (i + 1) * 18}`} />
  ))
  return (
    <g stroke="#4b5568" strokeWidth={2} fill="none">
      <path d={`M${x - 7} 820 V${top} M${x + 7} 820 V${top}`} strokeWidth={3} />
      {lattice}
      <g transform={`rotate(${sway} ${x} ${top})`}>
        <path d={`M${x - 120} ${top} H${x + 420} M${x - 120} ${top + 12} H${x + 420}`} strokeWidth={3} />
        <path d={`M${x} ${top - 46} L${x + 420} ${top} M${x} ${top - 46} L${x - 120} ${top}`} strokeWidth={1.5} />
        <rect x={x - 118} y={top + 8} width={46} height={30} fill="#4b5568" />
        <path d={`M${x + 260} ${top + 12} V${top + 200}`} strokeWidth={1.2} />
        <rect x={x + 252} y={top + 200} width={16} height={22} fill="#4b5568" />
      </g>
    </g>
  )
}

export const SiteWindow: React.FC<{ calm?: boolean; viewBox?: string; width?: number; height?: number }> = ({
  calm = false, viewBox = '0 0 1920 1080', width = 1920, height = 1080,
}) => {
  const t = useCurrentFrame() / 30
  const sway = Math.sin(t * 0.25) * 0.6
  return (
    <svg viewBox={viewBox} width={width} height={height} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={calm ? '#86a6cf' : '#7d9cc4'} />
          <stop offset="0.55" stopColor={calm ? '#f2d3a6' : '#e9cfa9'} />
          <stop offset="1" stopColor="#f6e2c4" />
        </linearGradient>
        <radialGradient id="sun" cx="0.78" cy="0.62" r="0.35">
          <stop offset="0" stopColor="#fff4d6" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff4d6" stopOpacity="0" />
        </radialGradient>
        <filter id="haze"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>
      <rect width="1920" height="1080" fill="url(#sky)" />
      <rect width="1920" height="1080" fill="url(#sun)" />
      <g filter="url(#haze)">
        <path d="M0 700 Q240 560 520 640 T1060 600 T1600 640 T1920 590 V1080 H0Z" fill="#9db0a4" opacity={0.75} />
        <path d="M0 760 Q300 660 640 720 T1280 690 T1920 700 V1080 H0Z" fill="#7f9787" opacity={0.85} />
        <Frame x={260} floors={6} bays={5} w={300} />
        <Frame x={1180} floors={4} bays={6} w={360} />
        <Crane x={760} height={420} sway={sway} />
        <rect x="0" y="818" width="1920" height="262" fill="#a89a86" />
      </g>
    </svg>
  )
}
