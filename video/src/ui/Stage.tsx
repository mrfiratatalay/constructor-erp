import type { ReactNode } from 'react'
import { AbsoluteFill } from 'remotion'
import { easeInOutCubic, mix } from '../motion/ease'
import type { Box } from './useCapture'

/** Kameranın bakışı: sahnedeki (x, y) noktası ekranın ortasına gelir, zoom kadar büyür. 1 = olduğu gibi. */
export type Shot = { x: number; y: number; zoom: number }

export const REST: Shot = { x: 960, y: 540, zoom: 1 }

/** Bir kutuya yaklaş: kutunun merkezi ekranın ortasına gelir. */
export const focusOn = (box: Box, zoom: number, offset = { x: 0, y: 0 }): Shot => ({
  x: box.x + box.width / 2 + offset.x,
  y: box.y + box.height / 2 + offset.y,
  zoom,
})

/**
 * Kamera durakları arasında yumuşak geçiş: [[zaman, bakış], ...]. İki durak arası her zaman yavaş başlar, yavaş
 * biter (spesifikasyon Madde 9: 300–700 ms, okunamayacak kadar zoom yok).
 */
export const cameraAt = (t: number, keys: Array<[number, Shot]>): Shot => {
  if (t <= keys[0][0]) return keys[0][1]
  for (let index = 1; index < keys.length; index++) {
    const [end, to] = keys[index]
    const [start, from] = keys[index - 1]
    if (t > end) continue
    const amount = end === start ? 1 : easeInOutCubic((t - start) / (end - start))
    return { x: mix(from.x, to.x, amount), y: mix(from.y, to.y, amount), zoom: mix(from.zoom, to.zoom, amount) }
  }
  return keys[keys.length - 1][1]
}

/** Sahnenin içeriğini kameranın bakışına göre taşır ve büyütür. İmleç de içeride çizilir: zoom'la birlikte büyür. */
export const Stage = ({ shot, children }: { shot: Shot; children: ReactNode }) => (
  <AbsoluteFill
    style={{
      transform: `translate(${960 - shot.x * shot.zoom}px, ${540 - shot.y * shot.zoom}px) scale(${shot.zoom})`,
      transformOrigin: '0 0',
    }}
  >
    {children}
  </AbsoluteFill>
)
