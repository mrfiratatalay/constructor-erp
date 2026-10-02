import { toVideo } from '../../ui/AppWindow'
import type { FrameCue } from '../../ui/FrameTrack'
import { REST, type Shot } from '../../ui/Stage'
import type { Tap } from '../../ui/Taps'
import type { Leg } from '../../ui/cursorPath'
import { box, middle, onDesktop, onPhone, type PhonePlacement } from '../../ui/coords'

export const PHONE: PhonePlacement = { x: 960, y: 540, scale: 1 }
const SIDE: PhonePlacement = { x: 520, y: 540, scale: 0.82 }
const SIDE_DESK = { x: 860, y: 300, scale: 0.66 }

export const PHONE_FRAMES: FrameCue[] = [
  { at: 50.6, src: 'attendance/phone-0' },
  { at: 51.7, src: 'attendance/phone-sheet', fade: 0.22 },
  { at: 52.35, src: 'attendance/phone-1', fade: 0.2 },
  { at: 53.0, src: 'attendance/phone-2', fade: 0.2 },
  { at: 53.6, src: 'attendance/phone-3', fade: 0.15 },
  { at: 54.2, src: 'attendance/phone-4', fade: 0.15 },
  // Yan yana anında şef listenin başına döner: Ali iki ekranda da "Geldi".
  { at: 55.2, src: 'attendance/phone-1', fade: 0.3 },
]

export const DESK_FRAMES: FrameCue[] = [
  { at: 54.9, src: 'attendance/office-today' },
  { at: 56.05, src: 'attendance/office-month', fade: 0.3 },
  { at: 58.6, src: 'attendance/office-person', fade: 0.25 },
  { at: 59.45, src: 'attendance/office-month', fade: 0.25 },
]

const tap = (at: number, capture: string, name: string): Tap => {
  const point = middle(onPhone(capture, name, PHONE))
  return [at, point.x, point.y]
}

export const TAPS: Tap[] = [
  tap(51.6, 'attendance/phone-0', 'row0'),
  tap(52.25, 'attendance/phone-sheet', 'choice'),
  tap(52.95, 'attendance/phone-2', 'row'),
  tap(53.55, 'attendance/phone-3', 'row'),
  tap(54.15, 'attendance/phone-4', 'row'),
]

const excelText = onDesktop('attendance/office-month', 'excel')
/** Yazının kutusu butonun tamamına (ikon ve kenar boşluğu) genişletilir. */
const excelButton = { x: excelText.x - 36, y: excelText.y - 9, width: excelText.width + 50, height: excelText.height + 18 }

/** Aynı kayıt iki ekranda: telefonda Ali'nin satırı; ofiste önce "Bugün"de, sonra aylık tabloda Ali'nin satırı. */
const deskRow = (capture: string, from: number, to: number) => {
  const row = toVideo({ ...box(capture, 'ali'), x: 140, width: 1150, height: 44 }, SIDE_DESK)
  return { box: { ...row, y: row.y - 10 }, from, to }
}
export const ROWS = [
  { box: onPhone('attendance/phone-1', 'row', SIDE), from: 55.6, to: 57.35 },
  deskRow('attendance/office-today', 55.7, 56.15),
  deskRow('attendance/office-month', 56.3, 57.35),
  { box: excelButton, from: 59.95, to: 61.3 },
]

const shot = (x: number, y: number, zoom: number): Shot => ({ x, y, zoom })
const drawer = middle(onDesktop('attendance/office-person', 'drawer'))
const excel = middle(onDesktop('attendance/office-month', 'excel'))
export const CAMERA: Array<[number, Shot]> = [
  [58.2, REST], [58.9, shot(drawer.x - 120, 540, 1.12)], [59.4, shot(drawer.x - 120, 540, 1.12)],
  [60.0, shot(excel.x - 200, excel.y + 120, 1.45)], [61.3, shot(excel.x - 200, excel.y + 120, 1.45)], [62.2, REST],
]

const ali = middle(onDesktop('attendance/office-month', 'ali'))
const LEGS: Leg[] = [
  { from: { x: 1180, y: 860 }, to: ali, start: 58.2, end: 58.45 },
  { from: ali, to: excel, start: 59.45, end: 60.05 },
]
export const CURSOR = { legs: LEGS, clicks: [58.52, 60.25] }
