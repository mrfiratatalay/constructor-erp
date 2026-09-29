import { LAPTOP, laptopPoint } from '../kit/Laptop'
import { centerOf, type Pose } from '../kit/motion'
import { phonePoint } from '../kit/Phone'
import { focusLaptop, followPhone as follow } from '../kit/follow'
import { shots } from './shots'
import {
  DESK_CLICKS,
  DRAWER,
  END_CARD,
  LAPTOP_ON,
  PHONE_ON,
  PHONE_SCROLLS,
  PHONE_TAPS,
  RING_PULSE,
  STREAK,
} from './timeline'

/**
 * Kameranın yolu. Odaklar çekimin kaydettiği yerlerden hesaplanır: uygulama değişip çekim yenilenince kamera yine
 * doğru yere bakar. Telefon sahnesinde kamera telefonu sağda tutar, soldaki söze yer kalır.
 */
const WIDE = { x: 960, y: 540, scale: 1 }

const ring = centerOf(shots.box('phone-ring'))
export const RING = phonePoint(PHONE_ON, ring)

const followPhone = (appY: number, scale: number) => follow(PHONE_ON, appY, scale)

const summary = shots.box('desk-summary')
/** Bugünün özet kartları: ilk karttan ekranın sağ kenarına bir sıra; altındaki süzgeç de görünsün. */
const summaryRow = laptopPoint(LAPTOP_ON, { x: (summary.x + LAPTOP.app.width - 20) / 2, y: summary.y + summary.height })
const grid = laptopPoint(LAPTOP_ON, { x: (summary.x + LAPTOP.app.width - 20) / 2 + 60, y: 560 })
const header = shots.box('desk-day-header')
const DETAIL_ZOOM = 1.85
/**
 * Kişinin ayı: solda takvim, sağda gün ayrıntısı (durum, mesai, not, "Kaydedildi · saat · şef"). Panel ekranın sağ
 * kenarına yaslıdır; kamera o kenarı aşmaz, yoksa ekranın dışındaki çerçeve ve zemin görünür.
 */
const detailFocus = focusLaptop(LAPTOP_ON, { x: header.x, y: header.y + 180 }, DETAIL_ZOOM)
const excel = laptopPoint(LAPTOP_ON, centerOf(shots.box('desk-tap-excel')))

export const EXCEL_BUTTON = excel

const ringFocus = followPhone(ring.y + 60, 1.7)
const summaryFocus = { ...summaryRow, scale: 1.5 }
const gridFocus = { ...grid, scale: 1.3 }
const excelFocus = { x: excel.x - 180, y: excel.y + 150, scale: 1.5 }
const taps = PHONE_TAPS
const clicks = DESK_CLICKS

/** Kamera anlara bağlıdır (timeline.ts): zamanlama değişince kamera da kendiliğinden kayar. */
export const CAMERA: Pose[] = [
  { at: 0, ...WIDE },
  { at: taps.row - 17, ...WIDE },
  { at: taps.row + 5, ...followPhone(500, 1.45) },
  { at: taps.absent + 7, ...followPhone(500, 1.45) },
  { at: taps.select - 9, ...followPhone(300, 1.45) },
  { at: taps.select + 5, ...followPhone(300, 1.45) },
  { at: PHONE_SCROLLS.toList + 14, ...followPhone(380, 1.55) },
  { at: PHONE_SCROLLS.toEnd - 6, ...followPhone(380, 1.55) },
  { at: PHONE_SCROLLS.toEnd + 8, ...followPhone(470, 1.55) },
  { at: PHONE_SCROLLS.toTop - 10, ...followPhone(470, 1.55) },
  { at: PHONE_SCROLLS.toTop + 22, ...followPhone(360, 1.25) },
  { at: RING_PULSE + 4, ...ringFocus },
  { at: RING_PULSE + 28, ...ringFocus },
  { at: STREAK.start - 8, ...WIDE },
  { at: STREAK.end + 6, ...WIDE },
  { at: STREAK.end + 34, ...summaryFocus },
  { at: clicks.puantaj - 12, ...summaryFocus },
  { at: clicks.puantaj + 22, ...gridFocus },
  { at: clicks.cell - 2, ...gridFocus },
  { at: clicks.cell + 22, ...detailFocus },
  { at: DRAWER.close + 2, ...detailFocus },
  { at: clicks.excel - 4, ...excelFocus },
  { at: END_CARD, ...excelFocus },
]
