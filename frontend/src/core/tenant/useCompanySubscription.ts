import { computed } from 'vue'
import { useGetCompanySubscription } from '@/core/api/generated/account/account'
import { stateOf, usageLabel, usageLevel, usagePercent } from '@/core/billing/billingLabels'

/** Bir sınırın satırı. limited: paket sınır koyuyor mu; sınırsızda çubuk çizilmez (5 / sınırsız'ın doluluğu olmaz). */
function usageRow(label: string, used: number, limit: number | null | undefined) {
  const percent = usagePercent(used, limit)
  return { label, text: usageLabel(used, limit), percent, limited: limit != null, level: usageLevel(percent) }
}

/**
 * Patronun abonelik özeti: paket, dönem, kullanım (kişi, şantiye / paket sınırı), paketteki modüller, geçmiş dönemler
 * ve ödemeler. Salt okunur: POS yok, uzatma ve ödeme Constructor ERP ekibinin işidir.
 */
export function useCompanySubscription() {
  const { data, isPending } = useGetCompanySubscription()
  const usage = computed(() => {
    const value = data.value
    if (!value) return []
    return [
      usageRow('Kişi', value.activeUsers, value.maxUsers),
      usageRow('Aktif şantiye', value.activeSites, value.maxSites),
    ]
  })
  return { subscription: data, isPending, usage, state: computed(() => stateOf(data.value?.state)) }
}
