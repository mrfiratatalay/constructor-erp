import { focusLaptop, followPhone } from '../kit/follow'
import { centerOf, type Pose } from '../kit/motion'
import { shots } from './shots'
import { DESK_CLICKS, END_CARD, FINALE, LAPTOP_ON, PHONE_ON, PHONE_TAPS, REPLY_SENT, STREAK } from './timeline'

/**
 * Kameranın yolu: telefonda alttaki yazma çubuğuna (＋, Sorun bildir, cümle, gönder), gönderince yukarıdaki sarı
 * satıra; laptopta listede öne çıkan Kartal'a, Saha'daki sarı satıra ve Sohbet'teki cevaba; sonunda iki cihaz.
 */
const WIDE = { x: 960, y: 540, scale: 1 }
const phone = (appY: number, scale = 1.45) => followPhone(PHONE_ON, appY, scale)

const site = focusLaptop(LAPTOP_ON, centerOf(shots.box('desk-site-row')), 1.6)
const issue = focusLaptop(LAPTOP_ON, centerOf(shots.box('desk-issue-row')), 1.5)
const reply = focusLaptop(LAPTOP_ON, centerOf(shots.box('desk-reply')), 1.5)

export const CAMERA: Pose[] = [
  { at: 0, ...WIDE },
  { at: 118, ...WIDE },
  { at: PHONE_TAPS.plus - 2, ...phone(540) },
  { at: PHONE_TAPS.send + 2, ...phone(540) },
  { at: PHONE_TAPS.send + 16, ...phone(380, 1.3) },
  { at: STREAK.start - 26, ...phone(380, 1.3) },
  { at: STREAK.start - 8, ...WIDE },
  { at: STREAK.end + 14, ...WIDE },
  { at: STREAK.end + 36, ...site },
  { at: DESK_CLICKS.saha - 4, ...site },
  { at: DESK_CLICKS.saha + 14, ...issue },
  { at: DESK_CLICKS.chat + 4, ...issue },
  { at: DESK_CLICKS.text + 8, ...reply },
  { at: REPLY_SENT + 40, ...reply },
  { at: FINALE, ...WIDE },
  { at: END_CARD, ...WIDE },
]
