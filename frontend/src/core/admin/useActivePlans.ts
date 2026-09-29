import { computed } from 'vue'
import { useListPlans } from '@/core/api/generated/platform/platform'

/** Satıştaki paketler (arşivlenenler yeni dönemde seçilmez; o paketteki firmaların dönemi sürer). */
export function useActivePlans() {
  const { data } = useListPlans()
  return computed(() => (data.value ?? []).filter((plan) => plan.status === 'ACTIVE'))
}
