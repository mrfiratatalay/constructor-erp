import { brand } from '../theme/colors'
import { clamp01, easeInOutCubic } from '../motion/ease'

/**
 * Ürünün işareti (frontend/src/shared/atoms/ProductMark.vue): kule vinç, aynı yollar, aynı çizgi kalınlığı.
 * Çizim sırası inşaat sırasıdır: önce zemin, sonra direk, bom, tepe, halat ve yük.
 */
const STROKES = ['M6.5 26h7', 'M10 26V8', 'M6 8h20', 'M10 8l4.5-4', 'M22 8v6', 'M20 14h4v3.5h-4z']

type Props = {
  size: number
  /** Koyu zeminde sarı kare + lacivert vinç; açık zeminde lacivert kare + sarı vinç (tokens.css kuralı). */
  surface: 'dark' | 'light'
  /** 0 → hiçbir çizgi yok, 1 → işaret tamam. Çizgiler sırayla, üst üste binerek çizilir. */
  draw?: number
}

const strokeProgress = (draw: number, index: number): number => {
  const span = 0.42
  const start = (index / (STROKES.length - 1)) * (1 - span)
  return easeInOutCubic(clamp01((draw - start) / span))
}

export const CraneMark = ({ size, surface, draw = 1 }: Props) => {
  const square = surface === 'dark' ? brand.signature : brand.deep
  const crane = surface === 'dark' ? brand.deep : brand.signature
  return (
    <div style={{ width: size, height: size, borderRadius: '28%', background: square, display: 'grid',
      placeItems: 'center', flex: 'none' }}>
      <svg viewBox="0 0 32 32" width={size * 0.66} height={size * 0.66} fill="none" stroke={crane} strokeWidth={2.6}
        strokeLinecap="round" strokeLinejoin="round">
        {STROKES.map((d, index) => (
          <path key={d} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strokeProgress(draw, index)} />
        ))}
      </svg>
    </div>
  )
}
