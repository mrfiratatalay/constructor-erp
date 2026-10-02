import { Img, staticFile } from 'remotion'
import { useFilmTime } from '../film/clock'
import { easeInOutCubic, progress } from '../motion/ease'

/** Bir çekim karesinin filmde görüneceği an. fade: önceki kareden geçiş süresi (0 = sert kesme, yazma gibi). */
export type FrameCue = { at: number; src: string; fade?: number }

const FILL = { position: 'absolute', inset: 0, width: '100%', height: '100%' } as const

const frameIndex = (t: number, frames: FrameCue[]): number => {
  let index = 0
  frames.forEach((frame, position) => {
    if (t >= frame.at) index = position
  })
  return index
}

/**
 * Gerçek ürün çekimlerini sırayla gösterir: yazma kareleri sert kesmeyle (gerçek yazma ritmi), sayfa ve durum
 * değişimleri kısa bir çapraz geçişle. Bir sonraki kare görünmeden yüklenir: önizlemede de takılma olmaz.
 */
export const FrameTrack = ({ frames }: { frames: FrameCue[] }) => {
  const t = useFilmTime()
  const index = frameIndex(t, frames)
  const current = frames[index]
  const previous = frames[index - 1]
  const upcoming = frames[index + 1]
  const fade = current.fade ?? 0.2
  const shown = previous && fade > 0 ? progress(t, current.at, fade, easeInOutCubic) : 1
  return (
    <>
      {previous && shown < 1 && <Img src={staticFile(`capture/${previous.src}.png`)} style={FILL} />}
      <Img src={staticFile(`capture/${current.src}.png`)} style={{ ...FILL, opacity: shown }} />
      {upcoming && <Img src={staticFile(`capture/${upcoming.src}.png`)} style={{ ...FILL, opacity: 0 }} />}
    </>
  )
}
