import { useFilmTime } from '../../film/clock'
import { brand } from '../../theme/colors'

type Curve = [[number, number], [number, number], [number, number], [number, number]]

const CURVES: Curve[] = [
  [[470, 330], [560, 230], [690, 230], [720, 330]],
  [[920, 330], [990, 210], [1110, 210], [1150, 300]],
  [[470, 760], [700, 920], [1100, 900], [1300, 820]],
]

/** Kübik Bézier üzerindeki nokta: her kare aynı yerde (belirlenimci), tarayıcı animasyonuna güvenmeden. */
const pointOn = ([a, b, c, d]: Curve, amount: number): [number, number] => {
  const inverse = 1 - amount
  const weights = [inverse ** 3, 3 * inverse ** 2 * amount, 3 * inverse * amount ** 2, amount ** 3]
  return [0, 1].map((axis) => weights[0] * a[axis] + weights[1] * b[axis] + weights[2] * c[axis] + weights[3] * d[axis]) as [number, number]
}

const pathOf = ([a, b, c, d]: Curve): string => `M ${a} C ${b} ${c} ${d}`

/**
 * Cihazlar arasında ince blueprint bağlantıları: kesikli sarı çizgi ve üstünde akan küçük noktalar. Abartılı bir ağ
 * grafiği değil; aynı kaydın üç ekranda olduğunu hissettiren sakin bir akış (spesifikasyon 01:48).
 */
export const Links = ({ shown }: { shown: number }) => {
  const t = useFilmTime()
  if (shown <= 0) return null
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', opacity: shown }}>
      {CURVES.map((curve, index) => {
        const [x, y] = pointOn(curve, (t * 0.45 + index * 0.33) % 1)
        return (
          <g key={index}>
            <path d={pathOf(curve)} fill="none" stroke={brand.signature} strokeWidth={2} strokeDasharray="6 10" opacity={0.55} />
            <circle cx={x} cy={y} r={5} fill={brand.signature} />
            <circle cx={x} cy={y} r={12} fill={brand.signature} opacity={0.18} />
          </g>
        )
      })}
    </svg>
  )
}
