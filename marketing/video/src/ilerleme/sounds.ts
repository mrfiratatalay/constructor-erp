import type { Cue } from '../kit/Soundtrack'
import {
  CARD_PULSE,
  DEMIR_ROW,
  DESK_CLICKS,
  DRAWER,
  END_CARD,
  FINALE,
  INTRO,
  NOTE,
  NOTICE,
  PHONE_POSES,
  PHONE_TAPS,
  QUANTITY_KEYS,
  SHEET,
  STREAK,
  WORKER_KEYS,
} from './timeline'

/** İlerleme videosunun efektleri. Kaydedince çan (bildirim), yeni rakamlarda çan arpeji: günün tatmin anı. */
const tap = (at: number): Cue => ({ at, sound: 'tap', volume: 0.5 })
const key = (at: number): Cue => ({ at, sound: 'key', volume: 0.3 })
const click = (at: number): Cue => ({ at, sound: 'click', volume: 0.45 })
const slide = (at: number, up: boolean): Cue => ({ at, sound: up ? 'sheet-up' : 'sheet-down', volume: up ? 0.3 : 0.26 })

const PHONE: Cue[] = [
  { at: INTRO[1].from - 8, sound: 'whoosh', volume: 0.28 },
  { at: PHONE_POSES[0].at + 4, sound: 'whoosh', volume: 0.32 },
  tap(PHONE_TAPS.tab),
  tap(PHONE_TAPS.update),
  slide(SHEET.open, true),
  tap(PHONE_TAPS.quantity),
  ...QUANTITY_KEYS.map(key),
  tap(PHONE_TAPS.workers),
  ...WORKER_KEYS.map(key),
  { at: SHEET.glide, sound: 'scroll', volume: 0.2 },
  tap(PHONE_TAPS.save),
  slide(PHONE_TAPS.save + 2, false),
  { at: NOTICE.open + 2, sound: 'chime', volume: 0.45 },
  { at: CARD_PULSE, sound: 'cascade', volume: 0.4 },
]

const DESK: Cue[] = [
  { at: STREAK.start, sound: 'zip', volume: 0.42 },
  { at: DEMIR_ROW.from + 2, sound: 'ding', volume: 0.36 },
  click(DESK_CLICKS.delayed),
  click(DESK_CLICKS.detail),
  slide(DRAWER.open, true),
  { at: NOTE.from, sound: 'tick', volume: 0.35 },
  { at: FINALE, sound: 'whoosh', volume: 0.3 },
  { at: END_CARD + 12, sound: 'shine', volume: 0.45 },
]

export const CUES: Cue[] = [...PHONE, ...DESK]
export const MUSIC = { name: 'ilerleme-muzik', volume: 0.78 }
