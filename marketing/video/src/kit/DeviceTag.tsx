import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { progress, settle } from './motion'

/** Cihazın üstünde küçük etiket: kimin elinde, nerede ("Şef · sahada"). Dünyadadır, cihazla birlikte yürür. */
export const DeviceTag: React.FC<{ at: { x: number; y: number }; text: string; frames: { from: number; to: number } }> = ({
  at,
  text,
  frames,
}) => {
  const frame = useCurrentFrame()
  const appear = progress(frame, frames.from, frames.from + 12, settle) * (1 - progress(frame, frames.to - 8, frames.to))
  if (appear <= 0) return null
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x,
        top: at.y,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 22px 10px 16px',
        borderRadius: 999,
        background: COLOR.white,
        color: COLOR.deep,
        fontSize: 26,
        fontWeight: 800,
        whiteSpace: 'nowrap',
        boxShadow: '0 12px 30px rgb(0 0 0 / 0.3)',
        opacity: appear,
        transform: `translate(-50%, -100%) scale(${0.8 + 0.2 * appear})`,
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 7, background: COLOR.signature, boxShadow: `0 0 0 4px ${COLOR.deep}` }} />
      {text}
    </div>
  )
}
