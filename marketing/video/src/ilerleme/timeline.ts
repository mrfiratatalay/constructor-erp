import type { Line } from '../kit/Captions'
import type { Pose } from '../kit/motion'

/**
 * İlerleme videosunun zamanlaması (30 kare = 1 sn). Müzik aynı iskelettedir (audio/scores.mjs, "ilerleme"): düşüşler
 * 120 (şefin telefonu), 480 (patronun laptopu) ve 840. karede (logo).
 */
export const DURATION = 960

export const INTRO = [
  { text: 'Akşam 17:30, *iş bitti.*', from: 4, to: 58 },
  { text: 'Bugün ne kadar *yapıldı?*', from: 60, to: 112 },
]

/** Şefin telefonu: İlerleme sekmesi → Demir İşleri'nde Güncelle → 3,5 ton, 12 çalışan → kaydet. */
export const PHONE_TAPS = { tab: 140, update: 176, quantity: 206, workers: 240, save: 286 }
export const QUANTITY_KEYS = [212, 218, 224]
export const WORKER_KEYS = [246, 252]
export const SHEET = { open: 179, settled: 193, glide: 262 }
/** Kaydettikten sonra: pencere iner, üstte "kaydedildi" bildirimi, kartta yeni rakamlar parlar. */
export const NOTICE = { open: 292, close: 356 }
export const CARD_PULSE = 300
export const PHONE_TAG = { from: 116, to: 146 }

/** Masaüstünde patron: bugünün girişi Demir İşleri'nde → Geciken → Bodrum Tesisatı'nın detayı, şefin notu. */
export const DESK_CLICKS = { delayed: 572, detail: 648 }
export const DEMIR_ROW = { from: 488, to: 562 }
export const BODRUM_ROW = { from: 580, to: 644 }
export const DRAWER = { open: 651, settled: 665 }
export const NOTE = { from: 672, to: 748 }
export const STREAK = { start: 456, end: 480 }
export const LAPTOP_TAG = { from: 476, to: 506 }
export const FINALE = 752
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
  { from: 124, to: 202, text: 'Demir İşleri → *Güncelle.*', place: 'side' },
  { from: 206, to: 282, text: 'Bugün yapılan: *3,5 ton.*', place: 'side' },
  { from: 294, to: 430, text: 'Yüzde, kalan, durum: *kendiliğinden.*', place: 'side' },
  { from: 440, to: 566, text: 'Patron ofisten *aynı akşam* görür.' },
  { from: 574, to: 644, text: 'Geciken iş *kırmızıyla* öne çıkar.' },
  { from: 652, to: 748, text: 'Neden gecikti? *Şefin notu orada.*' },
  { from: 760, to: 838, text: 'Her kalem, her gün: *kayıtlı.*' },
]

export const CLOSING = {
  line: 'Şef yazar, *yüzdeyi uygulama hesaplar.*',
  note: "Kızılkan Yapı'nın şantiyeleri için.",
}
