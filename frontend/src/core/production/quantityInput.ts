/**
 * Sahada yazılan miktar Türkçe yazılır: "3,5" (virgül ondalık), "12.000" (nokta binlik), "12.000,5". Telefonun Türkçe
 * sayı klavyesinde ondalık tuşu virgüldür; "3.5" yazan da anlaşılır. Sayı kutusu (type=number) virgülü kabul etmediği
 * için alanlar yazıdır, sayıya burada çevrilir. Anlaşılmayan ya da eksi yazı undefined döner.
 */
export function parseQuantity(text: string): number | undefined {
  const value = text.replace(/\s/g, '')
  if (!value) return undefined
  const normalized = value.includes(',')
    ? value.replace(/\./g, '').replace(',', '.')
    : /^\d{1,3}(\.\d{3})+$/.test(value)
      ? value.replace(/\./g, '')
      : value
  return /^\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : undefined
}

/** Kutuda yazan miktar geçersizse nedeni: boşsa "yaz", anlaşılmıyorsa "sayı olarak yaz". */
export function quantityProblem(text: string, empty: string): string | null {
  if (!text.trim()) return empty
  return parseQuantity(text) === undefined ? 'Miktarı sayı olarak yaz: 3,5 ya da 12.000' : null
}
