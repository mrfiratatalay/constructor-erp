import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { progress, settle } from './motion'

const NUMBER = {
  fontSize: 26,
  fontWeight: 700,
  color: COLOR.deep,
  background: COLOR.signature,
  borderRadius: 10,
  padding: '4px 12px',
}

type ChapterTagProps = { index: number; count: number; name: string; frames: { from: number; to: number } }

/** Ana videoda bölümün adı, sol üstte: "1 / 4 · Yoklama". Bölüm başında soldan kayar, bitmeden söner. */
export const ChapterTag: React.FC<ChapterTagProps> = ({ index, count, name, frames }) => {
  const frame = useCurrentFrame()
  const enter = progress(frame, frames.from + 4, frames.from + 18, settle)
  const appear = enter * (1 - progress(frame, frames.to - 10, frames.to))
  if (appear <= 0) return null
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        top: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '14px 28px 14px 18px',
        borderRadius: 18,
        background: 'rgb(12 20 50 / 0.82)',
        boxShadow: '0 16px 40px rgb(0 0 0 / 0.35)',
        color: COLOR.white,
        opacity: appear,
        transform: `translateX(${(1 - appear) * -60}px)`,
      }}
    >
      <span style={NUMBER}>
        {index} / {count}
      </span>
      <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.01em' }}>{name}</span>
    </div>
  )
}
