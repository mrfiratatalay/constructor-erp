import boxes from '../film/boxes.json'
import { DESKTOP_STAGE } from '../film/stage'
import { toVideo } from './AppWindow'
import type { Point } from './cursorPath'
import type { Box } from './useCapture'

/** Telefonun filmdeki yeri: ekranın merkezi (video pikseli) ve ölçeği. Ekran 390×844 CSS pikselidir. */
export type PhonePlacement = { x: number; y: number; scale: number }

const ALL = boxes as Record<string, Record<string, Box>>

/** Bir çekimdeki öğenin kutusu (CSS pikseli): capture/*.mjs'in kaydettiği. */
export const box = (capture: string, name: string): Box => {
  const found = ALL[capture]?.[name]
  if (!found) throw new Error(`Kutu yok: ${capture} → ${name} (node scripts/boxes.mjs)`)
  return found
}

/** Masaüstü penceresindeki öğenin videodaki yeri. */
export const onDesktop = (capture: string, name: string): Box => toVideo(box(capture, name), DESKTOP_STAGE)

/** Telefon ekranındaki öğenin videodaki yeri. */
export const onPhone = (capture: string, name: string, phone: PhonePlacement): Box => {
  const found = box(capture, name)
  return {
    x: phone.x + (found.x - 195) * phone.scale,
    y: phone.y + (found.y - 422) * phone.scale,
    width: found.width * phone.scale,
    height: found.height * phone.scale,
  }
}

export const middle = (target: Box): Point => ({ x: target.x + target.width / 2, y: target.y + target.height / 2 })

/** Pencere içinde elle ölçülmüş bir alan (CSS pikseli) → video. */
export const desktopArea = (area: Box): Box => toVideo(area, DESKTOP_STAGE)
