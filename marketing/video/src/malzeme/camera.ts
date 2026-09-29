import { focusLaptop, followPhone } from '../kit/follow'
import { laptopPoint } from '../kit/Laptop'
import { centerOf, type Pose } from '../kit/motion'
import { phonePoint } from '../kit/Phone'
import { shots } from './shots'
import { DESK_CLICKS, DRAWER, END_CARD, LAPTOP_ON, PHONE_ON, SENT_PULSE, STREAK } from './timeline'

/**
 * Kameranın yolu. Telefonda dokunulan yerin yüksekliğini izler (form yukarıdan aşağı dolar, seçici en alttaki
 * Çimento'ya iner, en sonda Gönder); masaüstünde sırayla yeni satıra, aramaya, açılan panele ve Excel'e bakar.
 */
const WIDE = { x: 960, y: 540, scale: 1 }
const phone = (appY: number, scale = 1.45) => followPhone(PHONE_ON, appY, scale)

export const SENT = phonePoint(PHONE_ON, centerOf(shots.box('phone-detail-title')))

const alert = shots.box('desk-alert')
const newRow = shots.box('desk-new-row')
const drawer = shots.box('desk-drawer-layer')
const returnButton = centerOf(shots.box('desk-tap-return'))
const excel = centerOf(shots.box('desk-tap-excel'))

export const EXCEL_BUTTON = laptopPoint(LAPTOP_ON, excel)
export const RETURN_BUTTON = laptopPoint(LAPTOP_ON, returnButton)

const top = focusLaptop(LAPTOP_ON, { x: newRow.x + newRow.width / 2, y: (alert.y + newRow.y + newRow.height) / 2 }, 1.55)
const table = focusLaptop(LAPTOP_ON, { x: 700, y: 330 }, 1.45)
const facts = focusLaptop(LAPTOP_ON, { x: drawer.x + drawer.width / 2, y: 300 }, 1.9)
const history = focusLaptop(LAPTOP_ON, { x: drawer.x + drawer.width / 2, y: returnButton.y - 260 }, 1.9)
const header = focusLaptop(LAPTOP_ON, { x: excel.x, y: 260 }, 1.5)

export const CAMERA: Pose[] = [
  { at: 0, ...WIDE },
  { at: 118, ...WIDE },
  { at: 140, ...phone(300) },
  { at: 186, ...phone(300) },
  { at: 200, ...phone(480) },
  { at: 214, ...phone(480) },
  { at: 226, ...phone(330) },
  { at: 250, ...phone(330) },
  { at: 262, ...phone(370) },
  { at: 296, ...phone(370) },
  { at: 330, ...phone(560) },
  { at: 378, ...phone(560) },
  { at: SENT_PULSE - 8, ...phone(380, 1.3) },
  { at: 420, ...phone(380, 1.3) },
  { at: STREAK.start - 8, ...WIDE },
  { at: STREAK.end + 6, ...WIDE },
  { at: STREAK.end + 32, ...top },
  { at: DESK_CLICKS.search - 8, ...top },
  { at: DESK_CLICKS.search + 10, ...table },
  { at: DESK_CLICKS.row + 4, ...table },
  { at: DRAWER.open + 18, ...facts },
  { at: DESK_CLICKS.returned - 26, ...facts },
  { at: DESK_CLICKS.returned - 8, ...history },
  { at: DRAWER.close, ...history },
  { at: DESK_CLICKS.excel - 12, ...header },
  { at: END_CARD, ...header },
]
