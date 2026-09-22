import { clockTime, daysAgo } from '@/core/format/dates'
import type { StatusTone } from '@/core/format/statusTone'

/**
 * Sorunun yaşı kartın sol şeridini boyar: bugün nötr, dün amber, 2+ gün kırmızı.
 * Hiçbir şey yapılmazsa liste kendiliğinden kızarır.
 */
export function issueAge(createdAt: string): { tone: StatusTone; label: string } {
  const days = daysAgo(createdAt)
  if (days <= 0) return { tone: 'neutral', label: `Bugün ${clockTime(createdAt)}` }
  if (days === 1) return { tone: 'warning', label: 'Dünden beri' }
  return { tone: 'danger', label: `${days} gündür bekliyor` }
}
