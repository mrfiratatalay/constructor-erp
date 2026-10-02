import { easeInOutCubic, progress } from '../motion/ease'

export type Point = { x: number; y: number }

/** İmlecin bir yolculuğu: başlangıç, varış, eğrinin kontrol noktası (bend), zaman aralığı. */
export type Leg = { from: Point; to: Point; bend?: Point; start: number; end: number }

const along = (leg: Leg, amount: number): Point => {
  const bend = leg.bend ?? { x: (leg.from.x + leg.to.x) / 2 + (leg.to.y - leg.from.y) * 0.18, y: (leg.from.y + leg.to.y) / 2 - (leg.to.x - leg.from.x) * 0.12 }
  const inverse = 1 - amount
  return {
    x: inverse * inverse * leg.from.x + 2 * inverse * amount * bend.x + amount * amount * leg.to.x,
    y: inverse * inverse * leg.from.y + 2 * inverse * amount * bend.y + amount * amount * leg.to.y,
  }
}

/**
 * İmleç ışınlanmaz: her yolculuk ikinci dereceden bir eğridir (elin doğal yayı), yavaş başlar, yavaş biter.
 * Bend verilmezse yola dik, hafif bir yay kendiliğinden çizilir. Yolculuklar arasında son varışta bekler; tıklama
 * varıştan 100–250 ms sonra gelir (spesifikasyon Madde 9).
 */
export const cursorOn = (t: number, legs: Leg[]): Point => {
  const current = [...legs].reverse().find((leg) => t >= leg.start) ?? legs[0]
  return along(current, progress(t, current.start, current.end - current.start, easeInOutCubic))
}
