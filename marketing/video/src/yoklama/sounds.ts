import type { Cue } from '../kit/Soundtrack'
import {
  BEAT,
  DESK_CLICKS,
  DRAWER,
  END_CARD,
  GRID_FILL,
  INTRO,
  PHONE_POSES,
  PHONE_SCROLLS,
  PHONE_TAPS,
  RING_PULSE,
  SHEET,
  STREAK,
} from './timeline'

/**
 * Yoklama videosunun efektleri, görüntüdeki anlara bağlı. Yükseklikler kulakla değil ölçüyle ayarlandı: dokunuşlar
 * müziğin üstünde net duyulur, hava sesleri (kayma, kaydırma) arkada kalır. Fare tıkı en keskin sestir, en kısığıdır.
 */
const tap = (at: number): Cue => ({ at, sound: 'tap', volume: 0.5 })
const click = (at: number): Cue => ({ at, sound: 'click', volume: 0.45 })

/** Açılıştaki saat: "sabah 08:00" yazarken dört vuruş tik-tak. */
const CLOCK: Cue[] = [0, 1, 2, 3].map((beat) => ({ at: beat * BEAT, sound: beat % 2 ? 'tock' : 'tick', volume: 0.4 }))

const PHONE: Cue[] = [
  { at: INTRO[1].from - 8, sound: 'whoosh', volume: 0.28 },
  { at: PHONE_POSES[0].at + 4, sound: 'whoosh', volume: 0.32 },
  tap(PHONE_TAPS.row),
  { at: SHEET.open, sound: 'sheet-up', volume: 0.3 },
  tap(PHONE_TAPS.absent),
  { at: SHEET.close, sound: 'sheet-down', volume: 0.26 },
  tap(PHONE_TAPS.select),
  { at: PHONE_SCROLLS.toList, sound: 'scroll', volume: 0.22 },
  ...PHONE_TAPS.picks.map((at, index) => ({ at, sound: `pick-${index + 1}`, volume: 0.42 })),
  { at: PHONE_SCROLLS.toEnd, sound: 'scroll', volume: 0.22 },
  tap(PHONE_TAPS.present),
  { at: PHONE_TAPS.present + 3, sound: 'cascade', volume: 0.4 },
  { at: PHONE_SCROLLS.toTop, sound: 'scroll', volume: 0.22 },
  { at: RING_PULSE, sound: 'chime', volume: 0.5 },
]

const DESK: Cue[] = [
  { at: STREAK.start, sound: 'zip', volume: 0.42 },
  click(DESK_CLICKS.puantaj),
  { at: GRID_FILL.start, sound: 'fill', volume: 0.32 },
  click(DESK_CLICKS.cell),
  { at: DRAWER.open, sound: 'sheet-up', volume: 0.3 },
  { at: DRAWER.close, sound: 'sheet-down', volume: 0.26 },
  click(DESK_CLICKS.excel),
  { at: DESK_CLICKS.excel + 2, sound: 'pop', volume: 0.5 },
  { at: END_CARD + 12, sound: 'shine', volume: 0.45 },
]

export const CUES: Cue[] = [...CLOCK, ...PHONE, ...DESK]
/** Müzik bütün karışımın -15 LUFS civarında durduğu yükseklikte; tepeler -1,5 dBFS'in altında kalır. */
export const MUSIC = { name: 'yoklama-muzik', volume: 0.78 }
