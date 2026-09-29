import type { Cue } from '../kit/Soundtrack'
import {
  DESK_CLICKS,
  DRAWER,
  END_CARD,
  FORM,
  INTRO,
  PHONE_POSES,
  PHONE_TAPS,
  PICKERS,
  SENT_PULSE,
  STREAK,
  TYPING,
} from './timeline'

/** Malzeme videosunun efektleri, görüntüdeki anlara bağlı; yükseklikler yoklamadaki gibi ölçülerek ayarlandı. */
const tap = (at: number): Cue => ({ at, sound: 'tap', volume: 0.5 })
const click = (at: number): Cue => ({ at, sound: 'click', volume: 0.45 })
const slide = (at: number, up: boolean): Cue => ({ at, sound: up ? 'sheet-up' : 'sheet-down', volume: up ? 0.3 : 0.26 })

const PHONE: Cue[] = [
  { at: INTRO[1].from - 8, sound: 'whoosh', volume: 0.28 },
  { at: PHONE_POSES[0].at + 4, sound: 'whoosh', volume: 0.32 },
  tap(PHONE_TAPS.create),
  slide(FORM.open, true),
  tap(PHONE_TAPS.site),
  ...PHONE_TAPS.lines.flatMap((line) => [tap(line.pick), tap(line.material), tap(line.quantity), ...line.digits.map(tap)]),
  ...PICKERS.flatMap((picker) => [slide(picker.open, true), slide(picker.close, false)]),
  tap(PHONE_TAPS.add),
  { at: FORM.glide, sound: 'scroll', volume: 0.2 },
  tap(PHONE_TAPS.photo),
  { at: PHONE_TAPS.photo + 2, sound: 'shutter', volume: 0.5 },
  tap(PHONE_TAPS.send),
  slide(PHONE_TAPS.send + 2, false),
  { at: SENT_PULSE - 10, sound: 'cascade', volume: 0.4 },
]

const DESK: Cue[] = [
  { at: STREAK.start, sound: 'zip', volume: 0.42 },
  click(DESK_CLICKS.search),
  ...TYPING.map((at) => ({ at, sound: 'key', volume: 0.45 })),
  click(DESK_CLICKS.row),
  slide(DRAWER.open, true),
  click(DESK_CLICKS.returned),
  { at: DESK_CLICKS.returned + 2, sound: 'chime', volume: 0.5 },
  slide(DRAWER.close, false),
  click(DESK_CLICKS.excel),
  { at: DESK_CLICKS.excel + 2, sound: 'pop', volume: 0.5 },
  { at: END_CARD + 12, sound: 'shine', volume: 0.45 },
]

export const CUES: Cue[] = [...PHONE, ...DESK]
export const MUSIC = { name: 'malzeme-muzik', volume: 0.78 }
