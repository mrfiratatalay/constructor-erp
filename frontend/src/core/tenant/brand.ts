/**
 * Firmanın baş harfleri (logo yoksa rozet): "Kızılkan İnşaat" → "Kİ". Türkçe büyük harf kuralıyla (i → İ); en fazla
 * iki kelimenin ilk harfi. Kısaltmalar ve noktalama atlanır.
 */
export function initialsOf(name: string | undefined | null): string {
  const words = (name ?? '')
    .split(/[\s.,&/-]+/)
    .filter((word) => /\p{L}/u.test(word))
    .slice(0, 2)
  return words.map((word) => word[0]!.toLocaleUpperCase('tr')).join('') || '·'
}
