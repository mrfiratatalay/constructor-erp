import { mix, progress, smooth } from './motion'

/** Bir dokunuş ya da tıklama: hangi karede, uygulamanın neresine. press: false yalnızca gidilen bir duraktır. */
export type Tap = { at: number; x: number; y: number; press?: boolean }

export type PointerState = { x: number; y: number; opacity: number; press: number; visible: boolean }

/** Parmağın ve imlecin ortak yolu. travel: bir noktadan ötekine gidiş süresi; linger: iki dokunuş arası bu kadar
 * yakınsa gösterge ekranda kalıp yürür, uzaksa kaybolup bir sonrakinden önce yeniden belirir. */
export type PathTiming = { lead: number; trail: number; travel: number; linger: number; arc: number }

const HIDDEN: PointerState = { x: 0, y: 0, opacity: 0, press: 0, visible: false }

export function pointerAt(frame: number, taps: Tap[], timing: PathTiming): PointerState {
  const nextIndex = taps.findIndex((tap) => tap.at >= frame)
  const previous = nextIndex === -1 ? taps[taps.length - 1] : taps[nextIndex - 1]
  const next = nextIndex === -1 ? undefined : taps[nextIndex]
  const press = pressAt(frame, taps)
  if (previous && next && next.at - previous.at <= timing.linger) {
    return { ...travel(frame, previous, next, timing), opacity: 1, press, visible: true }
  }
  if (next && frame >= next.at - timing.lead) {
    const appear = progress(frame, next.at - timing.lead, next.at - 2)
    const from = { x: next.x + timing.arc, y: next.y + timing.arc * 0.7 }
    return { x: mix(from.x, next.x, appear), y: mix(from.y, next.y, appear), opacity: Math.min(1, appear * 2), press, visible: true }
  }
  if (previous && frame <= previous.at + timing.trail) {
    const fade = progress(frame, previous.at + timing.trail - 8, previous.at + timing.trail)
    return { x: previous.x, y: previous.y, opacity: 1 - fade, press, visible: true }
  }
  return HIDDEN
}

/** İki nokta arası kavisli yol: el düz çizgide gitmez. */
function travel(frame: number, from: Tap, to: Tap, timing: PathTiming) {
  const start = Math.max(from.at + 3, to.at - timing.travel)
  const amount = progress(frame, start, to.at - 1, smooth)
  const bend = Math.sin(amount * Math.PI) * timing.arc * 0.35
  return { x: mix(from.x, to.x, amount) + bend, y: mix(from.y, to.y, amount) - bend }
}

/** Basış: dokunuş karesinde en derin, üç kare içinde bırakılır. */
function pressAt(frame: number, taps: Tap[]): number {
  const nearest = Math.min(...taps.filter((tap) => tap.press !== false).map((tap) => Math.abs(frame - tap.at)))
  return Math.max(0, 1 - nearest / 3)
}

/** Dokunuştan sonra yayılan dalga: 0'dan 1'e, dokunuş yoksa null. */
export function rippleAt(frame: number, taps: Tap[], length = 14) {
  const tap = taps.find((candidate) => candidate.press !== false && frame >= candidate.at && frame < candidate.at + length)
  return tap ? { x: tap.x, y: tap.y, amount: (frame - tap.at) / length } : null
}
