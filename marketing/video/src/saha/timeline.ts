import type { Line } from '../kit/Captions'
import type { Pose } from '../kit/motion'

/**
 * Saha videosunun zamanlaması (30 kare = 1 sn). Müzik aynı iskelettedir (audio/scores.mjs, "saha"): düşüşler 120
 * (şefin telefonu), 480 (patronun laptopu) ve 840. karede (logo). Sonda şefin telefonu cevapla geri gelir.
 */
export const DURATION = 960

export const INTRO = [
  { text: 'Şantiyede *bir sorun var.*', from: 4, to: 58 },
  { text: 'Patron *nasıl duyacak?*', from: 60, to: 112 },
]

/** Şefin telefonu, Saha sekmesi: ＋ → Sorun bildir → cümle → gönder; akışta sarı satır. */
export const PHONE_TAPS = { plus: 140, issue: 170, text: 196, send: 262 }
export const MENU = { open: 143, close: 172 }
export const PHONE_TYPING = [204, 214, 224, 234, 244]
export const ISSUE_ROW = { from: 272, to: 426 }
export const PHONE_TAG = { from: 116, to: 146 }

/** Masaüstünde patron: listede Kartal öne çıkmış → Saha'da sarı satır → Sohbet'te cevap. */
export const DESK_CLICKS = { saha: 562, chat: 640, text: 656 }
export const DESK_TYPING = [666, 680, 694]
export const REPLY_SENT = 710
export const SITE_ROW = { from: 488, to: 556 }
export const DESK_ISSUE = { from: 572, to: 636 }
export const REPLY = { from: 716, to: 790 }
export const STREAK = { start: 456, end: 480 }
export const LAPTOP_TAG = { from: 476, to: 506 }
/** Kapanıştan önce şefin telefonu cevapla geri gelir. */
export const FINALE = 760
export const PHONE_REPLY = { from: 796, to: 838 }
export const END_CARD = 840

export const PHONE_ON = { x: 1360, y: 548, scale: 1 }
export const PHONE_POSES: Pose[] = [
  { at: 96, x: 1360, y: 1580, scale: 1 },
  { at: 120, ...PHONE_ON },
  { at: 430, ...PHONE_ON },
  { at: 460, x: 1700, y: 780, scale: 0.42 },
  { at: 520, x: 1700, y: 780, scale: 0.42 },
  { at: 556, x: 2260, y: 900, scale: 0.42 },
  { at: FINALE, x: 2260, y: 520, scale: 0.6 },
  { at: FINALE + 30, x: 1560, y: 520, scale: 0.6 },
]

export const LAPTOP_ON = { x: 960, y: 540, scale: 0.86 }
export const LAPTOP_POSES: Pose[] = [
  { at: 432, x: 900, y: 1720, scale: 0.86 },
  { at: 480, ...LAPTOP_ON },
  { at: FINALE, ...LAPTOP_ON },
  { at: FINALE + 30, x: 780, y: 500, scale: 0.6 },
]

export const CAPTIONS: Line[] = [
  { from: 124, to: 192, text: 'Şef sorunu *sahadan* bildirir.', place: 'side' },
  { from: 196, to: 268, text: 'Bir cümle, *gönder.*', place: 'side' },
  { from: 272, to: 430, text: 'Akışta *sarı satır* olur.', place: 'side' },
  { from: 440, to: 556, text: 'Patron ofisten *hemen görür.*' },
  { from: 562, to: 636, text: 'Günün sahası *tek akışta.*' },
  { from: 644, to: 756, text: 'Cevap *şantiyenin sohbetinde.*' },
  { from: 770, to: 838, text: 'Şef *aynı dakikada* okur.' },
]

export const CLOSING = {
  line: 'Sahada ne olursa, *ofiste o an bilinir.*',
  note: "Kızılkan Yapı'nın şantiyeleri için.",
}
