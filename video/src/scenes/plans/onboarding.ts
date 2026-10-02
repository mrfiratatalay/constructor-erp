import type { FrameCue } from '../../ui/FrameTrack'
import { REST, type Shot } from '../../ui/Stage'
import type { UiPlan } from '../../ui/UiScene'
import type { Leg } from '../../ui/cursorPath'
import { middle, onDesktop } from '../../ui/coords'

/**
 * Part 2 (23 – 37,5 sn): "Firmanızı anlatın, paketinizi seçin. Başvurunuz onaylandığında size özel kurulum
 * bağlantısıyla firma bilgilerinizi, patron hesabınızı ve ilk şantiyenizi birkaç adımda oluşturun."
 * Ziyaretçi → platform yönetimi ("onaylandığında") → bağlantı ("bağlantısıyla") → sihirbaz (her adım kendi
 * kelimesinde) → çalışma alanı ("oluşturun").
 */
const typing: FrameCue[] = Array.from({ length: 11 }, (_, index) => ({
  at: 25.86 + index * 0.065, src: `onboarding/apply-type-${String(index + 1).padStart(2, '0')}`, fade: 0,
}))
const filling: FrameCue[] = [1, 2, 3, 4].map((step) => ({ at: 26.5 + step * 0.14, src: `onboarding/apply-fill-${step}`, fade: 0.04 }))

const FRAMES: FrameCue[] = [
  { at: 22, src: 'landing/hero' },
  { at: 23.95, src: 'onboarding/pricing', fade: 0.3 },
  { at: 25.35, src: 'onboarding/apply-empty', fade: 0.25 },
  { at: 25.8, src: 'onboarding/apply-type-00', fade: 0 },
  ...typing,
  ...filling,
  { at: 27.18, src: 'onboarding/apply-filled', fade: 0.05 },
  { at: 27.58, src: 'onboarding/apply-sent', fade: 0.25 },
  { at: 28.05, src: 'onboarding/leads', fade: 0 },
  { at: 28.65, src: 'onboarding/convert', fade: 0.2 },
  { at: 29.15, src: 'onboarding/convert-payment', fade: 0.2 },
  { at: 29.72, src: 'onboarding/link', fade: 0.2 },
  { at: 30.35, src: 'onboarding/setup-company', fade: 0 },
  { at: 30.95, src: 'onboarding/setup-company-filled', fade: 0.25 },
  { at: 31.75, src: 'onboarding/setup-owner', fade: 0.25 },
  { at: 32.95, src: 'onboarding/setup-site', fade: 0.25 },
  { at: 33.95, src: 'onboarding/setup-summary', fade: 0.25 },
  { at: 34.95, src: 'onboarding/setup-done', fade: 0.35 },
]

const shot = (x: number, y: number, zoom: number): Shot => ({ x, y, zoom })
const professional = middle(onDesktop('onboarding/pricing', 'professional'))
const CAMERA: Array<[number, Shot]> = [
  [24.3, REST], [24.95, shot(professional.x, 700, 1.18)], [25.3, shot(professional.x, 700, 1.18)],
  [25.45, shot(1271, 640, 1.3)], [27.5, shot(1271, 640, 1.32)], [27.95, shot(1271, 600, 1.15)],
  [28.04, shot(1271, 600, 1.15)], [28.05, shot(1000, 400, 1.25)], [28.6, shot(1050, 380, 1.3)],
  [28.8, shot(960, 470, 1.12)], [29.35, shot(960, 760, 1.25)], [29.95, shot(960, 396, 1.45)],
  [30.25, shot(936, 419, 2.6)], [30.34, shot(936, 419, 2.6)], [30.35, shot(1277, 540, 1.35)],
  [30.9, shot(1277, 556, 1.2)], [34.9, shot(1277, 556, 1.22)], [35.8, REST],
]

const click = (capture: string, name: string) => middle(onDesktop(capture, name))
const LEGS: Leg[] = [
  { from: { x: 1860, y: 1130 }, to: click('landing/hero', 'pricing'), bend: { x: 1480, y: 420 }, start: 22.55, end: 23.75 },
  { from: click('landing/hero', 'pricing'), to: click('onboarding/pricing', 'choose'), bend: { x: 1250, y: 520 }, start: 24.4, end: 25.1 },
  { from: click('onboarding/pricing', 'choose'), to: click('onboarding/apply-type-00', 'company'), start: 25.35, end: 25.72 },
  { from: click('onboarding/apply-type-00', 'company'), to: click('onboarding/apply-filled', 'submit'), start: 27.0, end: 27.42 },
  { from: { x: 1500, y: 760 }, to: click('onboarding/leads', 'convert'), start: 28.05, end: 28.45 },
  { from: click('onboarding/leads', 'convert'), to: click('onboarding/convert-payment', 'submit'), start: 28.8, end: 29.5 },
  { from: { x: 1300, y: 760 }, to: click('onboarding/setup-company', 'next'), start: 31.1, end: 31.55 },
  { from: click('onboarding/setup-company', 'next'), to: click('onboarding/setup-owner', 'next'), start: 32.5, end: 32.75 },
  { from: click('onboarding/setup-owner', 'next'), to: click('onboarding/setup-site', 'next'), start: 33.5, end: 33.8 },
  { from: click('onboarding/setup-site', 'next'), to: click('onboarding/setup-summary', 'finish'), start: 34.5, end: 34.75 },
]

/** Brand sahnesindeki imleç girişi de bu yolu izler: part'lar arasında imleç kopmaz. */
export const ONBOARDING_LEGS = LEGS

export const ONBOARDING: UiPlan = {
  from: 23.0,
  to: 38.0,
  frames: FRAMES,
  camera: CAMERA,
  cursor: {
    legs: LEGS,
    clicks: [23.85, 25.22, 25.8, 27.5, 28.55, 29.62, 31.65, 32.85, 33.88, 34.85],
    visible: [[22.5, 29.72], [30.6, 35.2]],
  },
  highlights: [
    { box: onDesktop('onboarding/pricing', 'professional'), from: 24.55, to: 25.3 },
    { box: onDesktop('onboarding/leads', 'row'), from: 28.12, to: 28.62 },
    { box: onDesktop('onboarding/convert-payment', 'payment'), from: 29.22, to: 29.7 },
    { box: onDesktop('onboarding/link', 'link'), from: 29.85, to: 30.3 },
  ],
}
