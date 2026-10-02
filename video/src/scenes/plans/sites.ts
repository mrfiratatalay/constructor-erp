import type { FrameCue } from '../../ui/FrameTrack'
import { REST, type Shot } from '../../ui/Stage'
import type { UiPlan } from '../../ui/UiScene'
import type { Leg } from '../../ui/cursorPath'
import { desktopArea, middle, onDesktop } from '../../ui/coords'

/**
 * Part 3 (37,5 – 50,6 sn): "Artık her şantiye kendi çalışma alanında. Fotoğraflar, videolar, sesli notlar ve
 * günlük saha gelişmeleri ait olduğu yerde kalır." Şef Ayşe'nin ekranı: liste → sohbet → not → fotoğraf → ses → Saha.
 */
const typing: FrameCue[] = Array.from({ length: 11 }, (_, index) => ({
  at: 40.75 + index * 0.1, src: `sites/type-${String((index + 1) * 3).padStart(2, '0')}`, fade: 0,
}))

const FRAMES: FrameCue[] = [
  { at: 37.5, src: 'sites/list' },
  { at: 38.95, src: 'sites/chat', fade: 0.25 },
  ...typing,
  { at: 41.9, src: 'sites/typed', fade: 0 },
  { at: 42.1, src: 'sites/sent', fade: 0.25 },
  { at: 42.95, src: 'sites/voice', fade: 0.3 },
  { at: 44.05, src: 'sites/field', fade: 0.3 },
]

const shot = (x: number, y: number, zoom: number): Shot => ({ x, y, zoom })
const CAMERA: Array<[number, Shot]> = [
  [38.9, REST], [39.45, shot(1165, 520, 1.12)], [40.45, shot(1165, 560, 1.12)], [40.75, shot(1220, 840, 1.38)],
  [41.95, shot(1240, 840, 1.38)], [42.4, shot(1440, 600, 1.25)], [42.9, shot(1440, 620, 1.25)],
  [43.15, shot(1480, 720, 1.42)], [43.85, shot(1480, 720, 1.42)], [44.35, shot(1150, 470, 1.18)],
  [46.3, shot(1150, 600, 1.22)], [49.2, shot(1060, 540, 1.04)],
]

const yomraRow = desktopArea({ x: 171, y: 95, width: 239, height: 50 })
const sendButton = desktopArea({ x: 1360, y: 850, width: 34, height: 34 })
const point = (capture: string, name: string) => middle(onDesktop(capture, name))
const LEGS: Leg[] = [
  { from: { x: 900, y: 900 }, to: middle(yomraRow), start: 38.15, end: 38.75 },
  { from: middle(yomraRow), to: point('sites/chat', 'composer'), start: 39.9, end: 40.5 },
  { from: point('sites/chat', 'composer'), to: middle(sendButton), start: 41.55, end: 41.95 },
  { from: middle(sendButton), to: point('sites/chat', 'fieldTab'), start: 43.3, end: 43.85 },
]

export const SITES: UiPlan = {
  from: 37.5,
  to: 51.2,
  enter: 0.5,
  frames: FRAMES,
  camera: CAMERA,
  cursor: { legs: LEGS, clicks: [38.85, 40.6, 42.05, 43.95], visible: [[37.9, 44.6]] },
  highlights: [
    { box: yomraRow, from: 38.3, to: 39.2 },
    { box: desktopArea({ x: 1062, y: 168, width: 326, height: 640 }), from: 42.35, to: 42.95 },
    { box: onDesktop('sites/voice', 'voice'), from: 43.05, to: 43.95 },
    { box: desktopArea({ x: 768, y: 378, width: 400, height: 200 }), from: 44.6, to: 45.6 },
    { box: onDesktop('sites/field', 'demir'), from: 45.4, to: 46.4 },
  ],
}

