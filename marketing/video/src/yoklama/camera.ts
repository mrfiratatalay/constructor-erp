import { LAPTOP, laptopPoint } from '../kit/Laptop'
import { centerOf, type Pose } from '../kit/motion'
import { phonePoint } from '../kit/Phone'
import { STAGE } from '../theme'
import { shots } from './shots'
import { LAPTOP_ON, PHONE_ON } from './timeline'

/**
 * Kameranın yolu. Odaklar çekimin kaydettiği yerlerden hesaplanır: uygulama değişip çekim yenilenince kamera yine
 * doğru yere bakar. Telefon sahnesinde kamera telefonu sağda tutar, soldaki söze yer kalır.
 */
const WIDE = { x: 960, y: 540, scale: 1 }

const ring = centerOf(shots.box('phone-ring'))
export const RING = phonePoint(PHONE_ON, ring)

/** Soldaki sözün sağ kenarı: telefona yaklaşırken telefonun sol kenarı bunun sağında kalır. */
const CAPTION_EDGE = 1110
/**
 * Telefonda dokunulan yere yaklaşmak: uygulamanın appY yüksekliği ekranın ortasına gelir, telefon sağda durur.
 * 1,5 kat yakınlıkta uygulamanın yazısı 1080p'de ~23 piksele çıkar: telefondan izleyen de okur.
 */
function followPhone(appY: number, scale: number) {
  const left = phonePoint(PHONE_ON, { x: 0, y: appY })
  return { x: left.x - (CAPTION_EDGE - 960) / scale, y: left.y, scale }
}

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
const detail = laptopPoint(LAPTOP_ON, {
  x: LAPTOP.app.width - STAGE.width / (2 * DETAIL_ZOOM * LAPTOP_ON.scale),
  y: header.y + 180,
})
const excel = laptopPoint(LAPTOP_ON, centerOf(shots.box('desk-tap-excel')))

export const EXCEL_BUTTON = excel

export const CAMERA: Pose[] = [
  { at: 0, ...WIDE },
  { at: 110, ...WIDE },
  { at: 134, ...followPhone(500, 1.45) },
  { at: 160, ...followPhone(500, 1.45) },
  { at: 172, ...followPhone(300, 1.45) },
  { at: 186, ...followPhone(300, 1.45) },
  { at: 206, ...followPhone(380, 1.55) },
  { at: 282, ...followPhone(380, 1.55) },
  { at: 298, ...followPhone(470, 1.55) },
  { at: 342, ...followPhone(470, 1.55) },
  { at: 384, ...followPhone(360, 1.25) },
  { at: 402, ...followPhone(ring.y + 60, 1.7) },
  { at: 426, ...followPhone(ring.y + 60, 1.7) },
  { at: 458, ...WIDE },
  { at: 500, ...WIDE },
  { at: 532, ...summaryRow, scale: 1.5 },
  { at: 598, ...summaryRow, scale: 1.5 },
  { at: 632, ...grid, scale: 1.3 },
  { at: 704, ...grid, scale: 1.3 },
  { at: 728, ...detail, scale: DETAIL_ZOOM },
  { at: 772, ...detail, scale: DETAIL_ZOOM },
  { at: 798, x: excel.x - 180, y: excel.y + 150, scale: 1.5 },
  { at: 850, x: excel.x - 180, y: excel.y + 150, scale: 1.5 },
]
