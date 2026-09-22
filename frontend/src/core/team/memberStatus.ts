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
  if (!member.lastSeenAt) return { tone: 'warning', label: 'Linki açmadı' }
  return { tone: 'success', label: 'Aktif' }
}

/**
 * Listede yalnızca patronun bir şey yapması gereken durum etiketlenir (linki açmadı, pasif).
 * Uygulamayı kullanan kişi etiketsizdir: iyi haber sessizdir (TASARIM.md İlke 1).
 */
export function memberFlag(member: MemberView): MemberStatus | null {
  return member.active && member.lastSeenAt ? null : memberStatus(member)
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
