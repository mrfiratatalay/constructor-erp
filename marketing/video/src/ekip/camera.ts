import { focusLaptop, followPhone } from '../kit/follow'
import { centerOf, placeAt, type Pose } from '../kit/motion'
import { phonePoint } from '../kit/Phone'
import { shots } from './shots'
import {
  BOSS_POSES,
  BOSS_TAPS,
  END_CARD,
  FINALE,
  JOINED_LINE,
  LAPTOP_ON,
  LINK_FLIGHT,
  NEW_ROW,
  PHONE_ON,
  STREAK,
  WORKER_POSES,
  WORKER_TAPS,
} from './timeline'

/**
 * Kameranın yolu: patronun telefonunda menüye ve bağlantıya, uçuşta geniş, ustanın telefonunda forma ve akışa,
 * laptopta "katıldı" satırına ve yoklamadaki yeni satıra; sonunda üç cihaz birlikte.
 */
const WIDE = { x: 960, y: 540, scale: 1 }
const phone = (appY: number, scale = 1.45) => followPhone(PHONE_ON, appY, scale)

/** Bağlantı patronun penceresindeki adresten çıkar, ustanın bildirimine iner. */
export const LINK_FROM = phonePoint(placeAt(LINK_FLIGHT.start, BOSS_POSES), centerOf(shots.box('boss-link-url')))
export const LINK_TO = phonePoint(placeAt(LINK_FLIGHT.end, WORKER_POSES), { x: 196, y: 290 })

const line = centerOf(shots.box('desk-joined-line'))
const row = centerOf(shots.box('desk-new-row'))
/** Satır akışın en dibindedir; biraz sağda tutulur ki soldaki alt yazı üstüne binmesin, yazısı da okunsun. */
const joined = focusLaptop(LAPTOP_ON, { x: line.x - 120, y: line.y }, 2.4)
const roster = focusLaptop(LAPTOP_ON, row, 1.5)

export const CAMERA: Pose[] = [
  { at: 0, ...WIDE },
  { at: BOSS_TAPS.add - 17, ...WIDE },
  { at: BOSS_TAPS.add + 5, ...phone(600) },
  { at: BOSS_TAPS.people - 5, ...phone(600) },
  { at: BOSS_TAPS.people + 11, ...phone(580) },
  { at: BOSS_TAPS.copy + 1, ...phone(580) },
  { at: LINK_FLIGHT.start + 4, ...WIDE },
  { at: WORKER_TAPS.notice - 10, ...WIDE },
  { at: WORKER_TAPS.notice + 4, ...phone(260) },
  { at: WORKER_TAPS.join - 7, ...phone(260) },
  { at: WORKER_TAPS.join + 7, ...phone(380, 1.3) },
  { at: WORKER_TAPS.site - 2, ...phone(380, 1.3) },
  { at: WORKER_TAPS.site + 10, ...phone(560, 1.3) },
  { at: STREAK.start - 16, ...phone(560, 1.3) },
  { at: STREAK.start - 8, ...WIDE },
  { at: STREAK.end + 14, ...WIDE },
  { at: JOINED_LINE.from + 26, ...joined },
  { at: JOINED_LINE.to + 10, ...joined },
  { at: NEW_ROW.from + 6, ...roster },
  { at: FINALE - 8, ...roster },
  { at: FINALE + 30, ...WIDE },
  { at: END_CARD, ...WIDE },
]
