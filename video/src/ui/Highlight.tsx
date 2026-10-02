import { useFilmTime } from '../film/clock'
import { brand } from '../theme/colors'
import { progress } from '../motion/ease'
import type { Box } from './useCapture'

type Props = { box: Box; from: number; to: number; radius?: number }

/**
 * Dikkatin gideceği yere ince bir ışık halkası: baret sarısı, yumuşak parıltı, sakin giriş-çıkış. Arayüzün kendisini
 * değiştirmez, yalnızca bakışı yönlendirir (spesifikasyon Madde 30: "pointer highlight" yapılabilir).
 */
export const Highlight = ({ box, from, to, radius = 12 }: Props) => {
  const t = useFilmTime()
  const shown = progress(t, from, 0.3) * (1 - progress(t, to - 0.3, 0.3))
  if (shown <= 0) return null
  const pad = 6 + (1 - shown) * 8
  return (
    <div style={{ position: 'absolute', left: box.x - pad, top: box.y - pad, width: box.width + pad * 2,
      height: box.height + pad * 2, borderRadius: radius + pad / 2, opacity: shown,
      border: `2.5px solid ${brand.signature}`,
      boxShadow: `0 0 0 4px rgb(250 204 21 / 0.18), 0 0 26px rgb(250 204 21 / 0.45)`, pointerEvents: 'none' }} />
  )
}
