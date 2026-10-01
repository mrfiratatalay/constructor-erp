import { computed } from 'vue'
import { useListPublicPlans } from '@/core/api/generated/public/public'
import type { PlanFeatureView, PublicPlanView } from '@/core/api/generated/model'
import { formatMoney } from '@/core/format/money'

/** Fiyatı olmayan paket teklifle satılır. */
export const priceOf = (plan: PublicPlanView) => (plan.monthlyPrice == null ? 'Teklif alın' : formatMoney(plan.monthlyPrice, plan.currency))

export const limitsOf = (plan: PublicPlanView) =>
  `${plan.maxUsers == null ? 'Sınırsız kişi' : `${plan.maxUsers} kişiye kadar`} · ${plan.maxSites == null ? 'sınırsız şantiye' : `${plan.maxSites} aktif şantiye`}`

export const includes = (plan: PublicPlanView, key: string) =>
  plan.features.some((feature) => feature.key === key && feature.included)

/**
 * Sitede görünen paketler (sıralı) ve karşılaştırma tablosunun satırları. Modül listesi sunucudan gelir: yeni modül
 * eklendiğinde fiyat sayfası kendiliğinden güncellenir.
 */
export function usePublicPlans() {
  const query = useListPublicPlans({ query: { staleTime: 5 * 60_000 } })
  const plans = computed(() => query.data.value ?? [])
  const features = computed<PlanFeatureView[]>(() => plans.value[0]?.features ?? [])
  return { plans, features, isLoading: query.isPending, isError: query.isError, refetch: query.refetch }
}
