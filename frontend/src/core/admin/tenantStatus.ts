import type { TenantRow } from '@/core/api/generated/model'
import { COMPANY_STATUSES, stateOf, type Tone } from '@/core/billing/billingLabels'

/**
 * Firmanın tek etiketle bugünkü hâli: askıda/arşivde ise firma durumu, değilse abonelik durumu ("Aktif", "Süresi
 * doldu"…). Listede ve ayrıntıda aynı etiket.
 */
export function tenantBadge(row: Pick<TenantRow, 'status' | 'subscriptionState'>): { label: string; tone: Tone } {
  if (row.status !== 'ACTIVE') return COMPANY_STATUSES[row.status] ?? { label: row.status, tone: 'info' }
  return stateOf(row.subscriptionState)
}

/** Kalan günün rengi: 3 gün ve altı kırmızı, 14 gün ve altı sarı, geçmişse kırmızı. */
export function daysLeftTone(daysLeft: number | null | undefined): Tone {
  if (daysLeft == null) return 'info'
  if (daysLeft <= 3) return 'danger'
  return daysLeft <= 14 ? 'warning' : 'success'
}
