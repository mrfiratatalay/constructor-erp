import dayjs from 'dayjs'

/** Eksenin üst sınırı temiz bir sayı olur (1, 2, 5 × 10ⁿ): 18.300 → 20.000. Veri yoksa 1. */
export function niceCeiling(max: number): number {
  if (max <= 0) return 1
  const power = 10 ** Math.floor(Math.log10(max))
  const step = [1, 2, 5, 10].find((factor) => factor * power >= max) ?? 10
  return step * power
}

/** Üç yatay çizgi: 0, yarısı, tepe. Değerleri okunmayan sütunları eksen taşır. */
export function ticksOf(ceiling: number): number[] {
  return [0, ceiling / 2, ceiling]
}

/** "2026-09" → "Eyl". */
export function shortMonth(month: string): string {
  return dayjs(`${month}-01`).format('MMM')
}
