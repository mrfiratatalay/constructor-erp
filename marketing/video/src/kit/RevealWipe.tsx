import { useCurrentFrame } from 'remotion'
import type { Box } from './captures'
import { progress } from './motion'

/**
 * Bir alanı soldan sağa açar: üstündeki örtü sağa doğru çekilir, kenarı yumuşaktır. Puantaj cetvelinde günler
 * sırayla dolar, en son toplamlar görünür. Örtünün rengi alanın kendi zeminidir (tablo beyaz).
 */
export const RevealWipe: React.FC<{ box: Box; frames: { start: number; end: number }; cover: string }> = ({
  box,
  frames,
  cover,
}) => {
  const frame = useCurrentFrame()
  const amount = progress(frame, frames.start, frames.end)
  if (amount >= 1) return null
  const edge = 90
  const left = box.x - edge + amount * (box.width + edge)
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: box.y,
        width: box.x + box.width - left,
        height: box.height,
        background: `linear-gradient(90deg, transparent, ${cover} ${edge}px)`,
      }}
    />
  )
}
