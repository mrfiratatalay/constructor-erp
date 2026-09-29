import { Img, staticFile, useCurrentFrame } from 'remotion'
import type { Layer } from './captures'
import { progress, settle } from './motion'

/**
 * Ayrı çekilmiş pencere, gerçek fizikle: arkası kararır, pencere alttan (telefonda seçim penceresi), sağdan
 * (masaüstünde kişinin ayı) ya da üstten (telefonda "kaydedildi" bildirimi) kayarak gelir, kapanırken aynı yoldan döner. dim: arkanın ne kadar kararacağı
 * (Vant 0,7, Element Plus 0,5; tam ekran pencerede 0).
 *
 * frames.open: kaymaya başladığı kare (instant ise o karede açık belirir: altındaki ekranla aynıdır, yalnızca
 * kapanışı oynatılır). frames.close: kayarak kapanır. frames.cut: o karede birden kaybolur (altındaki ekran onun
 * aynısını göstermeye başlamıştır). swap: pencere açıkken içeriği değişir (ör. "İade geldi"den sonra).
 */
export type SlideFrames = { open: number; close?: number; cut?: number; instant?: boolean }

type SlideLayerProps = {
  layer: Layer
  from: 'bottom' | 'right' | 'top'
  frames: SlideFrames
  app: { width: number; height: number }
  dim: number
  swap?: { at: number; layer: Layer }
}

export const SlideLayer: React.FC<SlideLayerProps> = ({ layer, from, frames, app, dim, swap }) => {
  const frame = useCurrentFrame()
  const openness = opennessAt(frame, frames)
  if (openness <= 0) return null
  const shown = swap && frame >= swap.at ? swap.layer : layer
  const { box } = shown
  const shift = {
    bottom: `translateY(${(1 - openness) * (app.height - box.y)}px)`,
    right: `translateX(${(1 - openness) * (app.width - box.x)}px)`,
    top: `translateY(${-(1 - openness) * (box.y + box.height)}px)`,
  }[from]
  return (
    <>
      {dim > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgb(0 0 0 / ${dim * openness})` }} />}
      <Img
        src={staticFile(shown.src)}
        style={{ position: 'absolute', left: box.x, top: box.y, width: box.width, height: box.height, transform: shift }}
      />
    </>
  )
}

function opennessAt(frame: number, frames: SlideFrames): number {
  if (frame < frames.open || (frames.cut !== undefined && frame >= frames.cut)) return 0
  const opening = frames.instant ? 1 : progress(frame, frames.open, frames.open + 12, settle)
  const closing = frames.close === undefined ? 0 : progress(frame, frames.close, frames.close + 10)
  return opening * (1 - closing)
}
