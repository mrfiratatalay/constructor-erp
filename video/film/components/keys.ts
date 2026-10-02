// Anahtar karelerden değer: [saniye, değer] çiftleri arasında yumuşak (inOut) geçiş. Kamera ve klip zamanı kullanır.
import { Easing, interpolate } from 'remotion'

export type Key = [number, number]
const smooth = Easing.bezier(0.45, 0, 0.2, 1)

export function valueAt(keys: Key[], t: number, eased = true): number {
  if (t <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i]
    const [t0, v0] = keys[i - 1]
    if (t <= t1) return interpolate(t, [t0, t1], [v0, v1], { easing: eased ? smooth : undefined })
  }
  return keys[keys.length - 1][1]
}
