import type { Line } from '../kit/Captions'
import type { Pose } from '../kit/motion'

/**
 * Malzeme videosunun bütün zamanlaması (30 kare = 1 sn). Müzik yoklamayla aynı iskelettedir (audio/scores.mjs,
 * "malzeme"): bir vuruş 15 kare, düşüşler 120 (telefon), 480 (laptop) ve 840. karede (logo).
 */
export const DURATION = 960

export const INTRO = [
  { text: "Kızılkan Yapı'nın *deposu.*", from: 4, to: 58 },
  { text: 'Ne çıktı, *nereye gitti?*', from: 60, to: 112 },
]

/** Telefonda depocu: Sevkiyat çıkar → Kartal → Çimento 50 → bir kalem daha: demir 2 → irsaliye → Gönder. */
export const PHONE_TAPS = {
  create: 135,
  site: 165,
  lines: [
    { pick: 186, material: 210, quantity: 228, digits: [234, 240] },
    { pick: 270, material: 292, quantity: 306, digits: [312] },
  ],
  add: 255,
  photo: 345,
  send: 375,
}
export const FORM = { open: 138, settled: 150, glide: 322 }
export const PICKERS = [
  { open: 189, close: 212 },
  { open: 273, close: 294 },
]
export const SENT_PULSE = 392
export const PHONE_TAG = { from: 116, to: 430 }

/** Masaüstünde patron: yeni satır parlar → "kalıp" araması → Aydın İnşaat → İade geldi → Excel. */
export const DESK_CLICKS = { search: 585, row: 660, returned: 735, excel: 795 }
export const TYPING = [600, 606, 612, 618, 624]
export const NEW_ROW = { from: 488, to: 572 }
export const DRAWER = { open: 663, close: 752 }
export const STREAK = { start: 456, end: 480 }
export const LAPTOP_TAG = { from: 482, to: 600 }
export const END_CARD = 840

export const PHONE_ON = { x: 1360, y: 548, scale: 1 }
export const PHONE_POSES: Pose[] = [
  { at: 96, x: 1360, y: 1580, scale: 1 },
  { at: 120, ...PHONE_ON },
  { at: 420, ...PHONE_ON },
  { at: 460, x: 1700, y: 780, scale: 0.42 },
  { at: 520, x: 1700, y: 780, scale: 0.42 },
  { at: 556, x: 2260, y: 900, scale: 0.42 },
]

export const LAPTOP_ON = { x: 960, y: 540, scale: 0.86 }
export const LAPTOP_POSES: Pose[] = [
  { at: 432, x: 900, y: 1720, scale: 0.86 },
  { at: 480, ...LAPTOP_ON },
]

export const CAPTIONS: Line[] = [
  { from: 124, to: 236, text: 'Depocu sevkiyatı *telefondan* çıkarır.', place: 'side' },
  { from: 242, to: 350, text: 'Nereye, ne, ne kadar: *üç soru.*', place: 'side' },
  { from: 356, to: 430, text: 'İrsaliyesiyle *kayıtta.*', place: 'side' },
  { from: 436, to: 575, text: 'Patron ofisten *anında* görür.' },
  { from: 590, to: 652, text: 'Hangi malzeme *nerede?*' },
  { from: 666, to: 776, text: 'Geri gelecek mi? *Takipte.*' },
  { from: 784, to: 838, text: 'Tek tıkla *Excel.*' },
]

export const CLOSING = {
  line: 'Ne çıktı, nereye gitti, geri gelecek mi: *tek defterde.*',
  note: "Kızılkan Yapı'nın deposu için.",
}
