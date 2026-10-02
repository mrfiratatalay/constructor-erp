/**
 * Belirlenimci rastgelelik: aynı tohum her render'da aynı sayıyı verir. Toz, kart dağılımı ve titreşim böylece her
 * çekimde birebir aynıdır (spesifikasyon: "her take aynı veriyle yeniden üretilebilir").
 */
export const hash = (seed: number): number => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

export const between = (seed: number, min: number, max: number): number => min + hash(seed) * (max - min)

/** Yumuşak gürültü: el titremesi, toz salınımı gibi doğal küçük hareketler için. */
export const smoothNoise = (seed: number, t: number): number => {
  const whole = Math.floor(t)
  const fraction = t - whole
  const blend = fraction * fraction * (3 - 2 * fraction)
  return hash(seed + whole) * (1 - blend) + hash(seed + whole + 1) * blend - 0.5
}
