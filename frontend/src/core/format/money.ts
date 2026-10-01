const TRY = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
const EXACT = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 })

/** "₺4.990"; kuruşlu tutarda kuruş da yazılır ("₺14.970,50"). Boş tutar (teklifle satılan paket) "—". */
export function formatMoney(amount: number | null | undefined, currency = 'TRY'): string {
  if (amount == null) return '—'
  if (currency === 'TRY') return Number.isInteger(amount) ? TRY.format(amount) : EXACT.format(amount)
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency', currency,
    minimumFractionDigits: 0,
    ...(Number.isInteger(amount) ? { maximumFractionDigits: 0 } : {}),
  }).format(amount)
}
