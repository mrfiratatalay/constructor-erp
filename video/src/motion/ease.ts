/** Hareketin dili: yumuşak başlayıp yumuşak biten, kontrollü eğriler. Sıçrama ve dönme yok. */

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

export const easeInOutCubic = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)

export const easeOutCubic = (x: number): number => 1 - (1 - x) ** 3

export const easeInCubic = (x: number): number => x * x * x

export const easeOutExpo = (x: number): number => (x >= 1 ? 1 : 1 - 2 ** (-10 * x))

export const easeInOutSine = (x: number): number => -(Math.cos(Math.PI * x) - 1) / 2

/** Hafif aşma ile oturma: kartların yerine "tık" diye yerleşmesi (ölçülü, 1.2 katsayı). */
export const easeOutBack = (x: number): number => {
  const c1 = 1.2
  const c3 = c1 + 1
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
}

/** t anında [start, start+duration] aralığındaki ilerleme, 0..1, eğriyle. */
export const progress = (t: number, start: number, duration: number, ease = easeInOutCubic): number =>
  ease(clamp01((t - start) / duration))

export const mix = (from: number, to: number, amount: number): number => from + (to - from) * amount

/** Bir değerin zaman içindeki duraklarını yumuşak geçişlerle izler: [[zaman, değer], ...]. */
export const keyframes = (t: number, stops: Array<[number, number]>, ease = easeInOutCubic): number => {
  if (t <= stops[0][0]) return stops[0][1]
  for (let index = 1; index < stops.length; index++) {
    const [endTime, endValue] = stops[index]
    const [startTime, startValue] = stops[index - 1]
    if (t <= endTime) return mix(startValue, endValue, ease((t - startTime) / (endTime - startTime)))
  }
  return stops[stops.length - 1][1]
}
