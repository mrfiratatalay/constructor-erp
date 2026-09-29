import type { Line } from '../kit/Captions'
import type { Pose } from '../kit/motion'

/**
 * Yoklama videosunun bütün zamanlaması (30 kare = 1 sn). "Şurası erken" denince değişen sayı buradadır.
 * Sabah (0-84) soru, telefon (84-430) şef, geçiş (430-500), masaüstü (500-846) patron, sonra kapanış.
 */
export const DURATION = 960

export const INTRO = [
  { text: 'Sabah *08:00.*', from: 6, to: 46 },
  { text: 'Kim geldi, *kim gelmedi?*', from: 46, to: 90 },
]

/** Telefonda: satıra dokun → pencere → Gelmedi; Seç → altı satır tek tek → kalanlar → Geldi. */
export const PHONE_TAPS = { row: 124, absent: 150, select: 176, picks: [232, 241, 250, 259, 268, 277], present: 330 }
export const SHEET = { open: 128, close: 152 }
export const PHONE_SCROLLS = { toList: 194, toEnd: 290, toTop: 352 }
export const RING_PULSE = 394

/** Masaüstünde: Puantaj sekmesi → cetvel dolar → Hüseyin'in beton dökümü günü → Excel. */
export const DESK_CLICKS = { puantaj: 612, cell: 704, excel: 806 }
/** Hücreye tıkladıktan sonra el fareyi kenara çeker: imleç açılan panelin takviminin üstünde kalmasın. */
export const CURSOR_REST = { at: 718, x: 1220, y: 900 }
export const GRID_FILL = { start: 626, end: 690 }
export const DRAWER = { open: 706, close: 772 }
export const STREAK = { start: 470, end: 496 }
export const END_CARD = 846

export const PHONE_ON = { x: 1360, y: 548, scale: 1 }
export const PHONE_POSES: Pose[] = [
  { at: 84, x: 1360, y: 1580, scale: 1 },
  { at: 108, ...PHONE_ON },
  { at: 428, ...PHONE_ON },
  { at: 470, x: 1700, y: 780, scale: 0.42 },
  { at: 536, x: 1700, y: 780, scale: 0.42 },
  { at: 570, x: 2260, y: 900, scale: 0.42 },
]

export const LAPTOP_ON = { x: 960, y: 540, scale: 0.86 }
export const LAPTOP_POSES: Pose[] = [
  { at: 440, x: 900, y: 1720, scale: 0.86 },
  { at: 488, ...LAPTOP_ON },
]

export const CAPTIONS: Line[] = [
  { from: 112, to: 202, text: 'Şef yoklamayı *telefondan* alır.', place: 'side' },
  { from: 206, to: 326, text: 'Seç, dokun, *Geldi.*', place: 'side' },
  { from: 334, to: 430, text: 'Bugünün yoklaması *tamam.*', place: 'side' },
  { from: 446, to: 600, text: 'Patron ofisten *anında* görür.' },
  { from: 616, to: 700, text: 'Ayın puantajı *kendiliğinden* dolar.' },
  { from: 708, to: 798, text: 'Kim, ne zaman yazdı: *kayıtlı.*' },
  { from: 802, to: 852, text: 'Tek tıkla *Excel.*' },
]

export const CLOSING = {
  line: 'Şef her sabah yazar, puantaj ay sonunda *hazır.*',
  note: 'Telefonda saha, bilgisayarda yönetim.',
}
