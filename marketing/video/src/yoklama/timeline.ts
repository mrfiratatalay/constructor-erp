import type { Line } from '../kit/Captions'
import type { Pose } from '../kit/motion'

/**
 * Yoklama videosunun bütün zamanlaması (30 kare = 1 sn). "Şurası erken" denince değişen sayı buradadır.
 * Müzik 120 BPM'dir (audio/music.mjs): bir vuruş 15 kare, bir ölçü 60 kare. Önemli anlar vuruşa oturur; müziğin
 * düşüşleri 120 (telefon gelir), 480 (laptop gelir) ve 840. karededir (logo). Bunlar değişirse müzik de değişir.
 */
export const DURATION = 960
export const BEAT = 15

export const INTRO = [
  { text: "Kızılkan Yapı'da sabah *08:00.*", from: 4, to: 58 },
  { text: 'Kim geldi, *kim gelmedi?*', from: 60, to: 112 },
]

/** Telefonda: satıra dokun → pencere → Gelmedi; Seç → altı satır sekizlik notalarla → kalanlar → Geldi. */
export const PHONE_TAPS = { row: 135, absent: 165, select: 195, picks: [240, 248, 255, 263, 270, 278], present: 330 }
export const SHEET = { open: 139, close: 167 }
export const PHONE_SCROLLS = { toList: 204, toEnd: 290, toTop: 354 }
export const RING_PULSE = 390
export const PHONE_TAG = { from: 116, to: 430 }

/** Masaüstünde: Puantaj sekmesi → cetvel dolar → Hüseyin'in beton dökümü günü → Excel. */
export const DESK_CLICKS = { puantaj: 600, cell: 690, excel: 780 }
/** Hücreye tıkladıktan sonra el fareyi kenara çeker: imleç açılan panelin takviminin üstünde kalmasın. */
export const CURSOR_REST = { at: 704, x: 1220, y: 900 }
export const GRID_FILL = { start: 612, end: 672 }
export const DRAWER = { open: 692, close: 756 }
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
  { from: 122, to: 200, text: 'Şef yoklamayı *telefondan* alır.', place: 'side' },
  { from: 206, to: 328, text: 'Seç, dokun, *Geldi.*', place: 'side' },
  { from: 340, to: 426, text: 'Bugünün yoklaması *tamam.*', place: 'side' },
  { from: 436, to: 590, text: 'Patron ofisten *anında* görür.' },
  { from: 604, to: 686, text: 'Ayın puantajı *kendiliğinden* dolar.' },
  { from: 694, to: 772, text: 'Kim, ne zaman yazdı: *kayıtlı.*' },
  { from: 782, to: 838, text: 'Tek tıkla *Excel.*' },
]

export const CLOSING = {
  line: 'Şef her sabah yazar, puantaj ay sonunda *hazır.*',
  note: "Kızılkan Yapı'nın şantiyeleri için.",
}
