const TRY = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
const EXACT = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 })

/** "₺4.990"; kuruşlu tutarda kuruş da yazılır ("₺14.970,50"). Boş tutar (teklifle satılan paket) "—". */
export function formatMoney(amount: number | null | undefined): string {
  if (amount == null) return '—'
  return Number.isInteger(amount) ? TRY.format(amount) : EXACT.format(amount)
}
