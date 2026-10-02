import type { FrameCue } from '../../ui/FrameTrack'
import { REST, type Shot } from '../../ui/Stage'
import type { UiPlan } from '../../ui/UiScene'
import type { Leg } from '../../ui/cursorPath'
import { middle, onDesktop } from '../../ui/coords'

/**
 * Part 5 (62,5 – 76,5 sn): "Depodan ne çıktı, hangi şantiyeye gitti, ne iade edildi, ne geri bekleniyor…
 * Malzeme hareketleri tek kayıtta." Depo sorumlusu Mehmet: yeni sevkiyat (Ana Depo → Yomra Park, 24 kalıp paneli),
 * iade satırı, başka firmalara verilip geri beklenenler, sonra bütün hareketler tek listede.
 */
const FRAMES: FrameCue[] = [
  { at: 62.5, src: 'materials/overview' },
  { at: 63.55, src: 'materials/chooser', fade: 0.15 },
  { at: 64.15, src: 'materials/dialog', fade: 0.25 },
  { at: 65.0, src: 'materials/dialog-filled', fade: 0.3 },
  { at: 65.95, src: 'materials/saved', fade: 0.25 },
  { at: 66.55, src: 'materials/all-after', fade: 0.3 },
  { at: 67.05, src: 'materials/waiting', fade: 0.3 },
  { at: 69.8, src: 'materials/all-after', fade: 0.35 },
]

const shot = (x: number, y: number, zoom: number): Shot => ({ x, y, zoom })
const point = (capture: string, name: string) => middle(onDesktop(capture, name))
const CAMERA: Array<[number, Shot]> = [
  [62.6, REST], [63.2, shot(960, 470, 1.1)], [63.5, shot(1400, 330, 1.3)], [64.0, shot(1400, 330, 1.3)],
  [64.35, shot(1430, 470, 1.2)], [65.8, shot(1430, 520, 1.22)], [66.3, shot(1430, 420, 1.22)],
  [66.6, shot(1000, 760, 1.3)], [67.1, shot(1000, 650, 1.32)], [68.6, shot(1000, 680, 1.32)],
  [70.0, shot(1000, 640, 1.25)], [72.4, shot(1000, 830, 1.25)], [73.6, REST],
]

const LEGS: Leg[] = [
  { from: { x: 1100, y: 820 }, to: point('materials/overview', 'create'), start: 62.85, end: 63.35 },
  { from: point('materials/overview', 'create'), to: point('materials/chooser', 'site'), start: 63.6, end: 63.95 },
  { from: point('materials/chooser', 'site'), to: point('materials/dialog-filled', 'submit'), start: 65.25, end: 65.75 },
  { from: point('materials/dialog-filled', 'submit'), to: point('materials/overview', 'waiting'), start: 66.4, end: 66.85 },
]

export const MATERIALS: UiPlan = {
  from: 62.0,
  to: 76.9,
  enter: 0.5,
  frames: FRAMES,
  camera: CAMERA,
  cursor: { legs: LEGS, clicks: [63.45, 64.05, 65.85, 66.95], visible: [[62.7, 67.6]] },
  highlights: [
    { box: onDesktop('materials/dialog-filled', 'site'), from: 65.05, to: 65.8 },
    { box: onDesktop('materials/all-after', 'returned'), from: 66.6, to: 67.1 },
    { box: onDesktop('materials/waiting', 'table'), from: 67.25, to: 68.6 },
    { box: onDesktop('materials/all-after', 'newest'), from: 70.1, to: 71.3 },
    { box: onDesktop('materials/all-after', 'cement'), from: 71.4, to: 72.4 },
    { box: onDesktop('materials/all-after', 'returned'), from: 72.4, to: 73.3 },
  ],
}
