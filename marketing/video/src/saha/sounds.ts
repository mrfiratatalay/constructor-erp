import type { Cue } from '../kit/Soundtrack'
import {
  DESK_CLICKS,
  DESK_TYPING,
  END_CARD,
  FINALE,
  INTRO,
  ISSUE_ROW,
  MENU,
  PHONE_POSES,
  PHONE_REPLY,
  PHONE_TAPS,
  PHONE_TYPING,
  REPLY_SENT,
  SITE_ROW,
  STREAK,
} from './timeline'

/** Saha videosunun efektleri. Sarı satır bir uyarı çanıyla gelir; cevap gidince ve şefe düşünce "ding". */
const tap = (at: number): Cue => ({ at, sound: 'tap', volume: 0.5 })
const key = (at: number): Cue => ({ at, sound: 'key', volume: 0.3 })
const click = (at: number): Cue => ({ at, sound: 'click', volume: 0.45 })

const PHONE: Cue[] = [
  { at: INTRO[1].from - 8, sound: 'whoosh', volume: 0.28 },
  { at: PHONE_POSES[0].at + 4, sound: 'whoosh', volume: 0.32 },
  tap(PHONE_TAPS.plus),
  { at: MENU.open, sound: 'sheet-up', volume: 0.3 },
  tap(PHONE_TAPS.issue),
  { at: MENU.close, sound: 'sheet-down', volume: 0.26 },
  tap(PHONE_TAPS.text),
  ...PHONE_TYPING.map(key),
  tap(PHONE_TAPS.send),
  { at: ISSUE_ROW.from, sound: 'chime', volume: 0.42 },
]

const DESK: Cue[] = [
  { at: STREAK.start, sound: 'zip', volume: 0.42 },
  { at: SITE_ROW.from + 2, sound: 'ding', volume: 0.36 },
  click(DESK_CLICKS.saha),
  click(DESK_CLICKS.chat),
  click(DESK_CLICKS.text),
  ...DESK_TYPING.map(key),
  { at: REPLY_SENT, sound: 'pop', volume: 0.45 },
  { at: FINALE, sound: 'whoosh', volume: 0.3 },
  { at: PHONE_REPLY.from, sound: 'ding', volume: 0.4 },
  { at: END_CARD + 12, sound: 'shine', volume: 0.45 },
]

export const CUES: Cue[] = [...PHONE, ...DESK]
export const MUSIC = { name: 'saha-muzik', volume: 0.78 }
