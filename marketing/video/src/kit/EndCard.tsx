import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { Blueprint } from './Blueprint'
import { mix, progress, settle } from './motion'
import { Words } from './Words'

/**
 * Kapanış: uygulamanın marka imzası (shared/molecules/BrandMark.vue: sarı kare içinde KŞ, yanında ad), altında
 * videonun tek cümlesi. Sahnenin üstüne alttan kayarak gelir.
 */
export const EndCard: React.FC<{ start: number; line: string; note: string }> = ({ start, line, note }) => {
  const frame = useCurrentFrame()
  const cover = progress(frame, start, start + 16, settle)
  const badge = progress(frame, start + 10, start + 28, settle)
  const name = progress(frame, start + 18, start + 34, settle)
  if (frame < start) return null
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - cover) * 100}%)` }}>
      <Blueprint drawFrom={start} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 150,
              height: 150,
              borderRadius: 44,
              background: COLOR.signature,
              color: COLOR.deep,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              transform: `scale(${badge}) rotate(${mix(-14, 0, badge)}deg)`,
            }}
          >
            KŞ
          </div>
          <div style={{ color: COLOR.white, fontSize: 104, fontWeight: 800, letterSpacing: '-0.03em', opacity: name, transform: `translateX(${(1 - name) * 40}px)` }}>
            Kızılkan Şantiye
          </div>
        </div>
        <Words text={line} from={start + 34} style={{ justifyContent: 'center', color: COLOR.white, fontSize: 52, fontWeight: 700, maxWidth: 1400 }} />
        <div style={{ color: 'rgb(255 255 255 / 0.7)', fontSize: 32, fontWeight: 600, opacity: progress(frame, start + 56, start + 70) }}>{note}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
