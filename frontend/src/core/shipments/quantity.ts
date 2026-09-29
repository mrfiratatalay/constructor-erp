/** Miktarın Türkçe yazımı: binlik nokta, ondalık virgül, gereksiz sıfır yok ("1.850", "2,4"). */
export function formatQuantity(quantity: number): string {
  return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 3 }).format(quantity)
}

export function withUnit(quantity: number, unit: string): string {
  return `${formatQuantity(quantity)} ${unit}`
}

/** Sevkiyat numarası okunur ve değişmez: "SV-000123". */
export function shipmentNumber(number: number): string {
  return `SV-${String(number).padStart(6, '0')}`
}
