import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import type { Box } from './captures'
import { progress } from './motion'

/**
 * Ekranda bir yeri işaret eder: baret sarısı bir çerçeve iki kez nabız gibi atar, sonra söner. "Bakın, az önce
 * telefondan girilen kayıt burada" demek için. Kutu uygulamanın ölçüsündedir (cihazın içinde çizilir).
 */
export const Spotlight: React.FC<{ box: Box; frames: { from: number; to: number } }> = ({ box, frames }) => {
  const frame = useCurrentFrame()
  if (frame < frames.from || frame >= frames.to) return null
  const appear = progress(frame, frames.from, frames.from + 8) * (1 - progress(frame, frames.to - 10, frames.to))
  const beat = (Math.sin(((frame - frames.from) / 15) * Math.PI * 2 - Math.PI / 2) + 1) / 2
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x - 6,
        top: box.y - 4,
        width: box.width + 12,
        height: box.height + 8,
        borderRadius: 12,
        border: `4px solid ${COLOR.signature}`,
        boxShadow: `0 0 ${18 + beat * 22}px rgb(250 204 21 / ${0.35 + beat * 0.35})`,
        background: `rgb(250 204 21 / ${0.06 + beat * 0.06})`,
        opacity: appear,
      }}
    />
  )
}
