import { Easing, interpolate } from 'remotion'

/** Yavaş başlar, yavaş biter: kamera ve cihaz yolculukları. */
export const smooth = Easing.bezier(0.45, 0, 0.2, 1)
/** Hızlı çıkar, yumuşak oturur: açılan pencereler, beliren yazılar. */
export const settle = Easing.bezier(0.16, 1, 0.3, 1)

/** from ile to arasında 0'dan 1'e; öncesinde 0, sonrasında 1. */
export function progress(frame: number, from: number, to: number, easing = smooth): number {
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  })
}

export const mix = (from: number, to: number, amount: number) => from + (to - from) * amount

/** Dünyada bir yer: merkez ve ölçek. Kamera da cihazlar da bununla yürür. */
export type Place = { x: number; y: number; scale: number }
export type Pose = Place & { at: number }

/**
 * Anahtar kareler arasında yumuşak geçiş. Aynı yerde beklemek için iki ardışık kareye aynı değer yazılır:
 * [{ at: 0, ...A }, { at: 60, ...A }, { at: 80, ...B }] 60. kareye kadar A'da durur, 80'de B'ye varır.
 */
export function placeAt(frame: number, poses: Pose[]): Place {
  const next = poses.findIndex((pose) => pose.at > frame)
  if (next === 0) return poses[0]
  if (next === -1) return poses[poses.length - 1]
  const [from, to] = [poses[next - 1], poses[next]]
  const amount = progress(frame, from.at, to.at)
  return { x: mix(from.x, to.x, amount), y: mix(from.y, to.y, amount), scale: mix(from.scale, to.scale, amount) }
}

/** Bir kutunun ortası. */
export const centerOf = (box: { x: number; y: number; width: number; height: number }) => ({
  x: box.x + box.width / 2,
  y: box.y + box.height / 2,
})
