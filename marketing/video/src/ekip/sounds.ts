import type { Cue } from '../kit/Soundtrack'
import {
  BOSS_LINK,
  BOSS_MENU,
  BOSS_POSES,
  BOSS_TAPS,
  DESK_CLICKS,
  END_CARD,
  FINALE,
  INTRO,
  JOINED_LINE,
  LINK_FLIGHT,
  NAME_KEYS,
  NEW_ROW,
  NOTICE,
  PHONE_KEYS,
  STREAK,
  WORKER_TAPS,
} from './timeline'

/** Ekip videosunun efektleri. Harf harf yazılan ad kısık tuş sesiyle gelir; on tuş art arda müziği bastırmasın. */
const tap = (at: number): Cue => ({ at, sound: 'tap', volume: 0.5 })
const key = (at: number): Cue => ({ at, sound: 'key', volume: 0.3 })
const slide = (at: number, up: boolean): Cue => ({ at, sound: up ? 'sheet-up' : 'sheet-down', volume: up ? 0.3 : 0.26 })

const BOSS: Cue[] = [
  { at: INTRO[1].from - 8, sound: 'whoosh', volume: 0.28 },
  { at: BOSS_POSES[0].at + 4, sound: 'whoosh', volume: 0.32 },
  tap(BOSS_TAPS.add),
  slide(BOSS_MENU.open, true),
  tap(BOSS_TAPS.people),
  slide(BOSS_MENU.close, false),
  slide(BOSS_LINK.open, true),
  tap(BOSS_TAPS.copy),
]

const LINK: Cue[] = [
  { at: LINK_FLIGHT.start, sound: 'whoosh', volume: 0.34 },
  slide(BOSS_LINK.close, false),
  { at: NOTICE, sound: 'ding', volume: 0.45 },
]

const WORKER: Cue[] = [
  tap(WORKER_TAPS.notice),
  tap(WORKER_TAPS.name),
  ...NAME_KEYS.map(key),
  tap(WORKER_TAPS.phone),
  ...PHONE_KEYS.map(key),
  tap(WORKER_TAPS.join),
  { at: WORKER_TAPS.join + 4, sound: 'cascade', volume: 0.4 },
  tap(WORKER_TAPS.site),
]

const DESK: Cue[] = [
  { at: STREAK.start, sound: 'zip', volume: 0.42 },
  { at: JOINED_LINE.from + 2, sound: 'ding', volume: 0.38 },
  { at: DESK_CLICKS.roll, sound: 'click', volume: 0.45 },
  { at: NEW_ROW.from, sound: 'cascade', volume: 0.36 },
  { at: FINALE, sound: 'whoosh', volume: 0.3 },
  { at: END_CARD + 12, sound: 'shine', volume: 0.45 },
]

export const CUES: Cue[] = [...BOSS, ...LINK, ...WORKER, ...DESK]
export const MUSIC = { name: 'ekip-muzik', volume: 0.72 }
