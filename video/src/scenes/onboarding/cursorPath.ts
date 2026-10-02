import { easeInOutCubic, progress } from '../../motion/ease'

type Point = { x: number; y: number }

/** İmlecin bir yolculuğu: başlangıç, varış, eğrinin kontrol noktası, zaman aralığı. */
type Leg = { from: Point; to: Point; bend: Point; start: number; end: number }

/**
 * İmleç ışınlanmaz: her yolculuk ikinci dereceden bir eğridir (elin doğal yayı), yavaş başlar, yavaş biter.
 * Varıştan sonra tıklamadan önce 100–250 ms duraksar (spesifikasyon Madde 9); bunu bir sonraki yolculuğun
 * başlangıç zamanı belirler.
 */
const LEGS: Leg[] = [
  // Part 1 sonu → part 2 başı: kadraja sağ alttan girer, header'daki "Fiyatlar"a gider.
  { from: { x: 1860, y: 1130 }, to: { x: 992, y: 145 }, bend: { x: 1480, y: 420 }, start: 22.55, end: 23.75 },
]

const along = (leg: Leg, amount: number): Point => {
  const inverse = 1 - amount
  return {
    x: inverse * inverse * leg.from.x + 2 * inverse * amount * leg.bend.x + amount * amount * leg.to.x,
    y: inverse * inverse * leg.from.y + 2 * inverse * amount * leg.bend.y + amount * amount * leg.to.y,
  }
}

/** İmlecin t anındaki yeri (video pikseli). Yolculuklar arasında son varış noktasında bekler. */
export const cursorAt = (t: number): Point => {
  const current = [...LEGS].reverse().find((leg) => t >= leg.start) ?? LEGS[0]
  return along(current, progress(t, current.start, current.end - current.start, easeInOutCubic))
}
