/** "Ahmet Yılmaz" → "Ahmet": listelerde ve önizlemede kısa ad yeter. */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

const HARMONY: Record<string, string> = { a: 'ı', ı: 'ı', e: 'i', i: 'i', o: 'u', u: 'u', ö: 'ü', ü: 'ü' }

/**
 * Belirtme hâli eki, büyük ünlü uyumuyla: "Musa" → "Musa'yı", "Ahmet Yılmaz" → "Ahmet Yılmaz'ı",
 * "Ali" → "Ali'yi". Sistem satırında gerekir: "Patron, Musa'yı ekledi".
 */
export function accusative(name: string): string {
  const lower = name.trim().toLocaleLowerCase('tr-TR')
  const vowels = [...lower].filter((letter) => letter in HARMONY)
  const suffix = HARMONY[vowels.at(-1) ?? 'e']
  const endsWithVowel = lower.slice(-1) in HARMONY
  return `${name.trim()}'${endsWithVowel ? 'y' : ''}${suffix}`
}
