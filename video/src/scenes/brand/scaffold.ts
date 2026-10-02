import type { Box } from '../../ui/useCapture'
import { between } from '../../motion/random'

/**
 * İskelenin ölçüleri: 4 sütun × 3 sıra modül. Dikmeler modüllerin arasındaki boşluklarda durur; ortadaki dikme
 * tam ekranın ortasındadır (x = 960): filmin "ilk temiz çizgisi" iskelenin ilk dikmesi olur.
 */
export const MODULE = { width: 200, height: 124, gap: 22, columns: 4, rows: 3 }
const WIDTH = MODULE.columns * MODULE.width + (MODULE.columns - 1) * MODULE.gap
export const FRAME = { left: 960 - WIDTH / 2, top: 150, width: WIDTH, height: 3 * MODULE.height + 2 * MODULE.gap }

export const moduleBox = (index: number): Box => {
  const column = index % MODULE.columns
  const row = Math.floor(index / MODULE.columns)
  return {
    x: FRAME.left + column * (MODULE.width + MODULE.gap),
    y: FRAME.top + row * (MODULE.height + MODULE.gap),
    width: MODULE.width,
    height: MODULE.height,
  }
}

const half = MODULE.gap / 2
/** Dikmeler: iskelenin iki dış kenarı ve modül aralarındaki üç çizgi. */
export const STANDARDS = Array.from({ length: MODULE.columns + 1 }, (_, index) =>
  FRAME.left - half + index * (MODULE.width + MODULE.gap))
/** Yatay borular: sıraların üstünde ve altında. */
export const LEDGERS = Array.from({ length: MODULE.rows + 1 }, (_, index) =>
  FRAME.top - half + index * (MODULE.height + MODULE.gap))
/** Çapraz destekler: birkaç bölmede, alttan üste. */
export const BRACES = [8, 3, 5, 10]

export type Ghost = Box & { angle: number; vx: number; vy: number }

/** Kaostan kalan "hayalet kartlar": dağınık yer, eğik açı, kendi yönünde yavaş sürüklenme. Belirlenimci. */
export const GHOSTS: Ghost[] = Array.from({ length: MODULE.columns * MODULE.rows }, (_, index) => {
  const column = index % 4
  const row = Math.floor(index / 4)
  return {
    x: 120 + column * 430 + between(index, -90, 90),
    y: 90 + row * 300 + between(index + 40, -60, 80),
    width: between(index + 80, 170, 320),
    height: between(index + 120, 70, 190),
    angle: between(index + 160, -16, 16),
    vx: between(index + 200, -22, 22),
    vy: between(index + 240, -14, 14),
  }
})

/** Hayalet kartın içindeki silik "içerik" çizgileri: mesaj, tablo, kâğıt satırı izlenimi. */
export const ghostLines = (index: number): number[] => [0.62, 0.4 + (index % 3) * 0.12, 0.28 + (index % 2) * 0.2]

/** İskele modüllerinin landing sayfasında dönüşeceği öğeler (sıra modül sırasıdır). */
export const MODULE_TARGETS = [
  'header', 'links', 'eyebrow', 'headline', 'lead', 'apply', 'explore', 'promises', 'preview', 'viewport',
  'viewport', 'viewport',
]
