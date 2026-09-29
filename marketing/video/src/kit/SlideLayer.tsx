import { Img, staticFile, useCurrentFrame } from 'remotion'
import type { Layer } from './captures'
import { progress, settle } from './motion'

/**
 * Ayrı çekilmiş pencere, gerçek fizikle: arkası kararır, pencere alttan (telefonda seçim penceresi) ya da sağdan
 * (masaüstünde kişinin ayı) kayarak gelir, kapanırken aynı yoldan döner. dim: arkanın ne kadar kararacağı
 * (Vant 0,7, Element Plus 0,5).
 */
type SlideLayerProps = {
  layer: Layer
  from: 'bottom' | 'right'
  frames: { open: number; close?: number }
  app: { width: number; height: number }
  dim: number
}

export const SlideLayer: React.FC<SlideLayerProps> = ({ layer, from, frames, app, dim }) => {
  const frame = useCurrentFrame()
  const opening = progress(frame, frames.open, frames.open + 12, settle)
  const closing = frames.close === undefined ? 0 : progress(frame, frames.close, frames.close + 10)
  const openness = opening * (1 - closing)
  if (openness <= 0) return null
  const { box } = layer
  const shift =
    from === 'bottom'
      ? `translateY(${(1 - openness) * (app.height - box.y)}px)`
      : `translateX(${(1 - openness) * (app.width - box.x)}px)`
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: `rgb(0 0 0 / ${dim * openness})` }} />
      <Img
        src={staticFile(layer.src)}
        style={{ position: 'absolute', left: box.x, top: box.y, width: box.width, height: box.height, transform: shift }}
      />
    </>
  )
}
