import type { MemberView } from '@/core/api/generated/model'
import { timeAgo } from '@/core/format/dates'
import type { StatusTone } from '@/core/format/statusTone'

export interface MemberStatus {
  tone: StatusTone
  label: string
}

/** Patronun ekip listesinde bir bakışta görmesi gereken: kişi uygulamaya girdi mi? */
export function memberStatus(member: MemberView): MemberStatus {
  if (!member.active) return { tone: 'neutral', label: 'Pasif' }
  if (!member.lastSeenAt) return { tone: 'warning', label: 'Bekliyor' }
  return { tone: 'success', label: 'Aktif' }
}

/**
 * Etiket yalnızca durumu taşır; ayrıntı yanındaki soluk yazıda durur. Cümle uzunluğundaki
 * bir etiket hem listeyi dağıtıyor hem de "bir bakışta" okunmasını engelliyordu.
 */
export function lastSeenText(member: MemberView): string {
  if (!member.active) return 'Erişimi kapalı'
  if (!member.lastSeenAt) return 'Giriş linkini henüz açmadı'
  return `Son görülme ${timeAgo(member.lastSeenAt)}`
}
