import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { mix, progress, smooth } from './motion'

type Point = { x: number; y: number }

/**
 * Paylaşılan bağlantı: bir mesaj baloncuğu olarak bir telefondan ötekine kavis çizerek uçar, varınca küçülüp
 * bildirime dönüşür. Dünyadadır (kameranın içinde), cihazlarla aynı ölçekte.
 */
export const LinkFly: React.FC<{ from: Point; to: Point; frames: { start: number; end: number }; title: string; link: string }> = ({
  from,
  to,
  frames,
  title,
  link,
}) => {
  const frame = useCurrentFrame()
  if (frame < frames.start || frame > frames.end + 6) return null
  const t = progress(frame, frames.start, frames.end, smooth)
  const arc = Math.sin(t * Math.PI) * -220
  const fade = 1 - progress(frame, frames.end, frames.end + 6)
  return (
    <div
      style={{
        position: 'absolute',
        left: mix(from.x, to.x, t),
        top: mix(from.y, to.y, t) + arc,
        width: 360,
        padding: '16px 20px',
        borderRadius: '22px 22px 22px 6px',
        background: COLOR.white,
        boxShadow: `0 20px 50px rgb(0 0 0 / 0.4), 0 0 0 4px ${COLOR.signature}`,
        color: COLOR.ink,
        opacity: Math.min(1, t * 4) * fade,
        transform: `translate(-50%, -50%) scale(${0.55 + Math.sin(t * Math.PI) * 0.45}) rotate(${mix(-6, 4, t)}deg)`,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 17, color: COLOR.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {link}
      </div>
    </div>
  )
}
