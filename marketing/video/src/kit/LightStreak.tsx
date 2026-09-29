import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLOR, STAGE } from '../theme'
import { progress, smooth } from './motion'

type Point = { x: number; y: number }

/**
 * Telefonda yazılan kaydın ofise gidişi: baret sarısı bir ışık, kavis çizerek bir cihazdan ötekine uçar, arkasında
 * kısa bir iz bırakır. Varınca hedefte bir parıltı yanar.
 */
export const LightStreak: React.FC<{ from: Point; to: Point; frames: { start: number; end: number } }> = ({
  from,
  to,
  frames,
}) => {
  const frame = useCurrentFrame()
  const head = progress(frame, frames.start, frames.end, smooth)
  const flash = progress(frame, frames.end, frames.end + 14)
  if (frame < frames.start || flash >= 1) return null
  const control = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 260 }
  const trail = Array.from({ length: 18 }, (_, index) => curve(from, control, to, Math.max(0, head - 0.28 + index * 0.0165)))
  const tip = curve(from, control, to, head)
  const points = trail.map((point) => `${point.x},${point.y}`).join(' ')
  return (
    <AbsoluteFill>
      <svg width={STAGE.width} height={STAGE.height} style={{ overflow: 'visible' }}>
        <polyline points={points} fill="none" stroke={COLOR.signature} strokeWidth={22} strokeLinecap="round" opacity={0.25 * (1 - flash)} style={{ filter: 'blur(8px)' }} />
        <polyline points={points} fill="none" stroke={COLOR.signature} strokeWidth={6} strokeLinecap="round" opacity={1 - flash} />
        <circle cx={tip.x} cy={tip.y} r={12 + flash * 60} fill={COLOR.signature} opacity={(1 - flash) * 0.9} style={{ filter: 'blur(3px)' }} />
      </svg>
    </AbsoluteFill>
  )
}

/** İkinci dereceden Bézier eğrisinde t anındaki nokta. */
function curve(from: Point, control: Point, to: Point, t: number): Point {
  const rest = 1 - t
  return {
    x: rest * rest * from.x + 2 * rest * t * control.x + t * t * to.x,
    y: rest * rest * from.y + 2 * rest * t * control.y + t * t * to.y,
  }
}
