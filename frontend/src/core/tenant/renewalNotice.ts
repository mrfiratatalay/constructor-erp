import type { WorkspaceAccessView, WorkspaceViewRole } from '@/core/api/generated/model'
import { fullDate } from '@/core/format/dates'

/** Bitişe bu kadar gün kala patron uyarılır: ödemeyi ayarlamaya zamanı kalsın. */
export const RENEWAL_WARNING_DAYS = 7

/**
 * Patronun abonelik uyarısı ("Aboneliğinizin bitmesine 3 gün kaldı"). Yalnızca patron görür: yenilemek onun işidir,
 * sahadaki ekibi gereksiz yere tedirgin etmeyiz.
 */
export function renewalNotice(access: WorkspaceAccessView | undefined, role: WorkspaceViewRole | undefined) {
  if (!access?.open || role !== 'OWNER' || access.daysLeft == null || !access.endsOn) return null
  if (access.daysLeft > RENEWAL_WARNING_DAYS) return null
  const when = access.daysLeft === 0 ? 'bugün' : `${access.daysLeft} gün sonra (${fullDate(access.endsOn)})`
  return `${access.planName ?? 'Abonelik'} aboneliğiniz ${when} bitiyor. Yenilemek için Constructor ERP ile görüşün.`
}
