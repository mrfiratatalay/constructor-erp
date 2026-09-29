import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { progress } from './motion'
import { Words } from './Words'

/** Ekranın ortasında büyük söz: açılışta soruyu sorar. Çıkarken hafifçe büyüyüp söner. */
export const Title: React.FC<{ text: string; from: number; to: number; size?: number }> = ({ text, from, to, size = 118 }) => {
  const frame = useCurrentFrame()
  const leave = progress(frame, to - 8, to)
  if (frame < from || frame >= to) return null
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - leave, transform: `scale(${1 + leave * 0.06})` }}>
      <Words
        text={text}
        from={from}
        style={{ justifyContent: 'center', maxWidth: 1500, color: COLOR.white, fontSize: size, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, textAlign: 'center' }}
      />
    </AbsoluteFill>
  )
}
