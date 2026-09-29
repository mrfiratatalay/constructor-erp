import type { CSSProperties } from 'react'
import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { progress, settle } from './motion'
import { Words } from './Words'

/**
 * Bir söz: hangi karede girip hangisinde çıkacağı. Ses kapalı izleyen de anlasın diye mesaj yazıyla verilir.
 * side: telefon sağdayken solun ortasında büyük yazı; lower: ekran dolarken sol altta levha.
 */
export type Line = { from: number; to: number; text: string; place?: 'side' | 'lower' }

const LOOKS: Record<'side' | 'lower', CSSProperties> = {
  side: {
    left: 120,
    top: '50%',
    maxWidth: 900,
    paddingTop: 34,
    borderTop: `10px solid ${COLOR.signature}`,
    fontSize: 88,
    letterSpacing: '-0.03em',
    lineHeight: 1.08,
    textShadow: '0 6px 30px rgb(0 0 0 / 0.35)',
  },
  lower: {
    left: 96,
    bottom: 92,
    maxWidth: 1240,
    padding: '26px 40px 30px 36px',
    borderLeft: `10px solid ${COLOR.signature}`,
    borderRadius: 22,
    background: 'rgb(15 25 64 / 0.9)',
    boxShadow: '0 24px 60px rgb(0 0 0 / 0.35)',
    fontSize: 56,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
  },
}

export const Captions: React.FC<{ lines: Line[] }> = ({ lines }) => {
  const frame = useCurrentFrame()
  const line = lines.find((candidate) => frame >= candidate.from && frame < candidate.to)
  if (!line) return null
  const place = line.place ?? 'lower'
  const enter = progress(frame, line.from, line.from + 10, settle)
  const leave = progress(frame, line.to - 8, line.to)
  const lift = place === 'side' ? 'translateY(-50%) ' : ''
  return (
    <div
      style={{
        position: 'absolute',
        color: COLOR.white,
        fontWeight: 800,
        ...LOOKS[place],
        opacity: enter * (1 - leave),
        transform: `${lift}translateX(${(1 - enter) * -40}px) translateY(${leave * 16}px)`,
      }}
    >
      <Words key={line.from} text={line.text} from={line.from + 2} />
    </div>
  )
}
