import type { FrameCue } from '../../ui/FrameTrack'
import { REST, type Shot } from '../../ui/Stage'
import type { UiPlan } from '../../ui/UiScene'
import type { Leg } from '../../ui/cursorPath'
import { desktopArea, middle, onDesktop } from '../../ui/coords'

const shot = (x: number, y: number, zoom: number): Shot => ({ x, y, zoom })
const point = (capture: string, name: string) => middle(onDesktop(capture, name))

/**
 * Part 6a (76,3 – 88 sn): "İmalatta yapılan işi, kalan işi ve ilerlemeyi görün. Taşeronların durumunu tahminle
 * değil, kayıtla takip edin." Kamera kelimelerle birlikte kartın ilgili yerine gider; kayıttan sonra çubuk uzar.
 */
const card = middle(onDesktop('production/board', 'card'))
export const PRODUCTION: UiPlan = {
  from: 76.3,
  to: 88.0,
  enter: 0.5,
  frames: [
    { at: 76.3, src: 'production/board' },
    { at: 80.65, src: 'production/entry', fade: 0.25 },
    { at: 81.6, src: 'production/entry-filled', fade: 0.25 },
    { at: 82.7, src: 'production/board', fade: 0.25 },
    // Çubuğun uzaması: aynı kaydırmadaki önce/sonra kareleri arasında yavaş geçiş (çekilen gerçek değerler).
    { at: 83.05, src: 'production/board-after-clean', fade: 0.7 },
  ] satisfies FrameCue[],
  camera: [
    [76.4, shot(card.x, 560, 1.1)], [77.45, shot(card.x - 170, 600, 1.45)], [78.35, shot(card.x - 120, 650, 1.45)],
    [79.15, shot(card.x + 180, 610, 1.4)], [79.9, shot(card.x, 590, 1.2)], [80.7, shot(1400, 560, 1.18)],
    [82.6, shot(1400, 560, 1.18)], [82.9, shot(card.x, card.y, 1.5)], [83.75, shot(card.x - 140, card.y - 30, 1.55)],
    [85.7, shot(card.x - 60, card.y, 1.45)], [86.6, shot(1160, 540, 1.1)],
  ],
  cursor: {
    legs: [
      { from: { x: 1200, y: 860 }, to: point('production/board', 'update'), start: 80.0, end: 80.45 },
      { from: point('production/board', 'update'), to: point('production/entry-filled', 'save'), start: 82.0, end: 82.5 },
    ] satisfies Leg[],
    clicks: [80.55, 82.6],
    visible: [[79.9, 83.0]],
  },
  highlights: [{ box: onDesktop('production/board-after-clean', 'card'), from: 83.4, to: 85.6 }],
}

/** Part 6b (87,4 – 96 sn): "Görevi oluşturun. Sorumlusunu ve teslim tarihini belirleyin. İşin ne durumda olduğunu
 * tek bakışta görün." */
const dialog = middle(onDesktop('tasks/form', 'dialog'))
const drawer = middle(onDesktop('tasks/drawer', 'drawer'))
const row = onDesktop('tasks/list-after', 'row')
export const TASKS: UiPlan = {
  from: 87.4,
  to: 96.2,
  enter: 0.45,
  frames: [
    { at: 87.4, src: 'tasks/list' },
    { at: 88.3, src: 'tasks/form', fade: 0.2 },
    { at: 89.2, src: 'tasks/form-filled', fade: 0.3 },
    { at: 92.45, src: 'tasks/list-after', fade: 0.25 },
    { at: 93.25, src: 'tasks/drawer', fade: 0.25 },
    { at: 94.15, src: 'tasks/done', fade: 0.15 },
  ] satisfies FrameCue[],
  camera: [
    [87.5, REST], [88.4, shot(dialog.x, dialog.y - 10, 1.4)], [92.2, shot(dialog.x, dialog.y + 10, 1.42)],
    [92.6, shot(1100, 420, 1.3)], [93.35, shot(drawer.x - 120, 400, 1.32)], [95.4, shot(drawer.x - 120, 420, 1.34)],
  ],
  cursor: {
    legs: [
      { from: { x: 1300, y: 600 }, to: point('tasks/list', 'add'), start: 87.6, end: 88.1 },
      { from: point('tasks/list', 'add'), to: point('tasks/form-filled', 'create'), start: 91.8, end: 92.25 },
      { from: point('tasks/form-filled', 'create'), to: middle(row), start: 92.65, end: 93.05 },
      { from: middle(row), to: point('tasks/drawer', 'done'), start: 93.55, end: 93.95 },
    ] satisfies Leg[],
    clicks: [88.2, 92.35, 93.15, 94.05],
    visible: [[87.55, 95.0]],
  },
  highlights: [
    { box: desktopArea({ x: 470, y: 283, width: 246, height: 72 }), from: 90.0, to: 90.95 },
    { box: desktopArea({ x: 722, y: 283, width: 232, height: 72 }), from: 90.85, to: 91.95 },
    { box: { ...row, x: row.x - 10, y: row.y - 10, width: row.width + 20, height: row.height + 20 }, from: 92.55, to: 93.2 },
    { box: onDesktop('tasks/done', 'done'), from: 94.2, to: 95.4 },
  ],
}
