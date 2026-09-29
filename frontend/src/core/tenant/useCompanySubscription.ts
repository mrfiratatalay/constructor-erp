import { computed } from 'vue'
import { useGetCompanySubscription } from '@/core/api/generated/account/account'
import { stateOf, usageLabel, usagePercent } from '@/core/billing/billingLabels'

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
      { label: 'Kişi', text: usageLabel(value.activeUsers, value.maxUsers), percent: usagePercent(value.activeUsers, value.maxUsers) },
      { label: 'Aktif şantiye', text: usageLabel(value.activeSites, value.maxSites), percent: usagePercent(value.activeSites, value.maxSites) },
    ]
  })
  return { subscription: data, isPending, usage, state: computed(() => stateOf(data.value?.state)) }
}
