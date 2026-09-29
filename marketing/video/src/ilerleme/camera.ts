import { focusLaptop, followPhone } from '../kit/follow'
import { centerOf, type Pose } from '../kit/motion'
import { shots } from './shots'
import { DESK_CLICKS, DRAWER, END_CARD, FINALE, LAPTOP_ON, NOTICE, PHONE_ON, PHONE_TAPS, SHEET, STREAK } from './timeline'

/**
 * Kameranın yolu: telefonda sekmeye, karttaki Güncelle'ye, penceredeki alanlara ve Kaydet'e; kaydedince hem üstteki
 * bildirim hem kart görünsün diye biraz geri, sonra yeni rakamlara yakın. Laptopta Demir İşleri satırı (Geciken'e
 * basınca Bodrum aynı yere gelir), sonra detaydaki not; sonunda iki cihaz birlikte.
 */
const WIDE = { x: 960, y: 540, scale: 1 }
const phone = (appY: number, scale = 1.45) => followPhone(PHONE_ON, appY, scale)

const rows = focusLaptop(LAPTOP_ON, centerOf(shots.box('desk-demir-row')), 1.5)
const note = focusLaptop(LAPTOP_ON, centerOf(shots.box('desk-delay-note')), 1.8)

export const CAMERA: Pose[] = [
  { at: 0, ...WIDE },
  { at: 118, ...WIDE },
  { at: PHONE_TAPS.tab - 2, ...phone(300) },
  { at: PHONE_TAPS.update - 12, ...phone(300) },
  { at: PHONE_TAPS.update - 2, ...phone(520) },
  { at: SHEET.settled - 4, ...phone(520) },
  { at: PHONE_TAPS.quantity - 4, ...phone(420) },
  { at: SHEET.glide - 4, ...phone(420) },
  { at: PHONE_TAPS.save - 6, ...phone(560) },
  { at: PHONE_TAPS.save + 2, ...phone(560) },
  { at: NOTICE.open + 4, ...phone(400, 1.25) },
  { at: NOTICE.close - 16, ...phone(400, 1.25) },
  { at: NOTICE.close + 4, ...phone(600, 1.6) },
  { at: STREAK.start - 26, ...phone(600, 1.6) },
  { at: STREAK.start - 8, ...WIDE },
  { at: STREAK.end + 14, ...WIDE },
  { at: STREAK.end + 36, ...rows },
  { at: DESK_CLICKS.detail - 2, ...rows },
  { at: DRAWER.open + 16, ...note },
  { at: FINALE - 6, ...note },
  { at: FINALE + 30, ...WIDE },
  { at: END_CARD, ...WIDE },
]
