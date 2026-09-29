import { computed } from 'vue'
import { useGetPlatformDashboard } from '@/core/api/generated/platform/platform'
import type { Tone } from '@/core/billing/billingLabels'
import { formatMoney } from '@/core/format/money'

export interface StatCard {
  key: string
  label: string
  value: string
  hint: string
  tone: Tone
}

/** Platformun özet ekranı: firma sayıları, gelir, yakında bitecek abonelikler, tahsilat grafiği, son işlemler. */
export function useAdminDashboard() {
  const { data, isPending } = useGetPlatformDashboard()
  const stats = computed<StatCard[]>(() => {
    const d = data.value
    if (!d) return []
    return [
      { key: 'open', label: 'Aktif firma', value: String(d.openTenants), hint: `${d.totalUsers} kullanıcı`, tone: 'success' },
      { key: 'locked', label: 'Süresi dolmuş', value: String(d.lockedTenants), hint: 'aboneliği geçersiz', tone: 'danger' },
      { key: 'suspended', label: 'Askıda / arşivde', value: String(d.suspendedTenants), hint: 'erişim kapalı', tone: 'warning' },
      { key: 'new', label: 'Bu ay açılan', value: String(d.newTenantsThisMonth), hint: `${d.pendingSetup} kurulum bekliyor`, tone: 'primary' },
      { key: 'mrr', label: 'Aylık tekrarlayan gelir', value: formatMoney(d.monthlyRecurring), hint: 'açık dönemler', tone: 'primary' },
      { key: 'collected', label: 'Bu ay tahsilat', value: formatMoney(d.collectedThisMonth), hint: 'kaydedilen ödemeler', tone: 'success' },
    ]
  })
  return { dashboard: data, isPending, stats }
}
