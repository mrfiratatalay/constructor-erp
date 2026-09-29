import type { CSSProperties } from 'react'
import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { progress, settle } from './motion'

/**
 * Kelime kelime beliren yazı: her kelime bir öncekinden üç kare sonra aşağıdan yükselir. *Yıldızlı* kelimeler baret
 * sarısıyla yanar; vurgu tek yerde, cümlenin asıl sözünde.
 */
export const Words: React.FC<{ text: string; from: number; style?: CSSProperties }> = ({ text, from, style }) => {
  const frame = useCurrentFrame()
  const words = text.split(' ')
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', columnGap: '0.28em', ...style }}>
      {words.map((word, index) => {
        const appear = progress(frame, from + index * 3, from + index * 3 + 12, settle)
        const accent = word.includes('*')
        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: 'inline-block',
              opacity: appear,
              transform: `translateY(${(1 - appear) * 0.45}em)`,
              color: accent ? COLOR.signature : undefined,
            }}
          >
            {word.replaceAll('*', '')}
          </span>
        )
      })}
    </span>
  )
}
