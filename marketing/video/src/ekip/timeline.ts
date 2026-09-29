import type { Line } from '../kit/Captions'
import type { Pose } from '../kit/motion'

/**
 * Ekip videosunun zamanlaması (30 kare = 1 sn). Müzik aynı iskelettedir (audio/scores.mjs, "ekip"): düşüşler 120
 * (patronun telefonu), 480 (laptop) ve 840. karede (logo). Arada bağlantı patronun telefonundan ustanınkine uçar.
 */
export const DURATION = 960

export const INTRO = [
  { text: "Kızılkan Yapı'ya *yeni usta.*", from: 4, to: 58 },
  { text: 'Uygulamaya nasıl *girecek?*', from: 60, to: 112 },
]

/** Patronun telefonu: ＋ → Kişi ekle → bağlantı → Kopyala. */
export const BOSS_TAPS = { add: 135, people: 165, copy: 225 }
export const BOSS_MENU = { open: 138, close: 167 }
export const BOSS_LINK = { open: 169, close: 250 }

/** Bağlantı uçar, ustanın telefonunda bildirim olur; usta dokunur, adını ve numarasını yazar, katılır. */
export const LINK_FLIGHT = { start: 238, end: 268 }
export const NOTICE = 266
export const WORKER_TAPS = { notice: 300, name: 318, phone: 356, join: 395, site: 420 }
export const NAME_KEYS = Array.from({ length: 10 }, (_, index) => 324 + Math.round(index * 2.5))
export const PHONE_KEYS = [362, 368, 374, 380]
export const WORKER_SCREENS = { join: 305, sites: 398, feed: 423 }

/** Masaüstünde patron: akışta "katıldı" satırı parlar → sol menüden Yoklama → Ali listede. */
export const DESK_CLICKS = { roll: 600 }
export const JOINED_LINE = { from: 488, to: 580 }
export const NEW_ROW = { from: 612, to: 700 }
export const STREAK = { start: 456, end: 480 }
export const FINALE = 700
export const END_CARD = 840

export const PHONE_ON = { x: 1360, y: 548, scale: 1 }
/** Bağlantı uçarken iki telefon yan yana: patron solda, usta sağda. */
const BOSS_ASIDE = { x: 620, y: 560, scale: 0.8 }
const WORKER_ASIDE = { x: 1420, y: 560, scale: 0.8 }

export const BOSS_POSES: Pose[] = [
  { at: 96, x: 1360, y: 1580, scale: 1 },
  { at: 120, ...PHONE_ON },
  { at: 232, ...PHONE_ON },
  { at: 250, ...BOSS_ASIDE },
  { at: 272, ...BOSS_ASIDE },
  { at: 292, x: -420, y: 560, scale: 0.8 },
  { at: FINALE, x: -420, y: 600, scale: 0.5 },
  { at: FINALE + 30, x: 330, y: 600, scale: 0.5 },
]

export const WORKER_POSES: Pose[] = [
  { at: 232, x: 2360, y: 560, scale: 0.8 },
  { at: 256, ...WORKER_ASIDE },
  { at: 272, ...WORKER_ASIDE },
  { at: 292, ...PHONE_ON },
  { at: 436, ...PHONE_ON },
  { at: 466, x: 1700, y: 780, scale: 0.42 },
  { at: 520, x: 1700, y: 780, scale: 0.42 },
  { at: 556, x: 2260, y: 900, scale: 0.42 },
  { at: FINALE, x: 2260, y: 600, scale: 0.5 },
  { at: FINALE + 30, x: 1590, y: 600, scale: 0.5 },
]

export const LAPTOP_ON = { x: 960, y: 540, scale: 0.86 }
export const LAPTOP_POSES: Pose[] = [
  { at: 432, x: 900, y: 1720, scale: 0.86 },
  { at: 480, ...LAPTOP_ON },
  { at: FINALE, ...LAPTOP_ON },
  { at: FINALE + 30, x: 960, y: 520, scale: 0.56 },
]

export const CAPTIONS: Line[] = [
  { from: 124, to: 232, text: 'Patron *tek bağlantıyı* paylaşır.', place: 'side' },
  { from: 294, to: 352, text: 'Şifre yok, *indirme yok.*', place: 'side' },
  { from: 356, to: 436, text: 'Adını yazar, *katılır.*', place: 'side' },
  { from: 442, to: 590, text: 'Patron akışta *hemen görür.*' },
  { from: 604, to: 696, text: 'Yoklamaya *kendiliğinden* girer.' },
  { from: 712, to: 838, text: 'Herkes her şantiyede, *tek bağlantıyla.*' },
]

export const CLOSING = {
  line: 'Tek bağlantı, *herkes içeride.*',
  note: "Kızılkan Yapı'nın ekibi için.",
}
