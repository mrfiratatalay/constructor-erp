import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/brand.json'
import { LogoLockup } from '../../brand/LogoLockup'
import { easeInOutCubic, easeOutCubic, mix, progress } from '../../motion/ease'
import type { Box } from '../../ui/useCapture'

const BIG = 4

/**
 * 21,05: logo ekranın ortasında çizilerek belirir (işaret inşaat sırasıyla, yazı soldan açılır).
 * 22,3 – 23,0: küçülerek tanıtım sitesinin header'ındaki markanın tam yerine iner. Header beyaz olduğu için
 * inerken koyu zemin sürümünden açık zemin sürümüne geçer; vardığında sayfanın kendi logosuyla birebir örtüşür.
 */
export const LogoReveal = ({ header }: { header: Box }) => {
  const t = useFilmTime()
  if (t < cues.logo.mark - 0.05) return null
  const [moveStart, moveEnd] = cues.toLanding
  const travel = progress(t, moveStart, moveEnd - moveStart, easeInOutCubic)
  const scale = mix(BIG, 1, travel)
  const centerX = 960 - (header.width * BIG) / 2
  const centerY = 540 - (header.height * BIG) / 2
  const x = mix(centerX, header.x, travel)
  const y = mix(centerY, header.y, travel)
  const appear = progress(t, cues.logo.mark - 0.05, 0.35)
  const grow = mix(0.94, 1, progress(t, cues.logo.mark, 0.8, easeOutCubic))
  const lightness = progress(t, moveStart + 0.3, moveEnd - moveStart - 0.3)
  const draw = progress(t, cues.logo.mark, 0.75)
  const reveal = progress(t, cues.logo.word, 0.55, easeOutCubic)
  const lockup = { position: 'absolute', left: 0, top: 0 } as const
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: appear * (1 - travel),
        background: 'radial-gradient(40% 32% at 50% 50%, rgb(37 99 235 / 0.28), transparent 70%)' }} />
      <div style={{ position: 'absolute', left: x, top: y, opacity: appear, transform: `scale(${travel < 1 ? grow : 1})`,
        transformOrigin: `${(header.width * scale) / 2}px ${(header.height * scale) / 2}px` }}>
        <div style={{ ...lockup, opacity: 1 - lightness }}>
          <LogoLockup scale={scale} surface="dark" draw={draw} reveal={reveal} />
        </div>
        <div style={{ ...lockup, opacity: lightness }}>
          <LogoLockup scale={scale} surface="light" />
        </div>
      </div>
    </AbsoluteFill>
  )
}
