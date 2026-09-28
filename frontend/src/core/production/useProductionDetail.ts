import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { ProductionEntryView } from '@/core/api/generated/model'
import {
  useDeleteProductionEntry,
  useGetProductionItem,
} from '@/core/api/generated/production/production'
import { historyDays } from '@/core/production/entryHistory'
import { refreshProduction } from '@/core/production/productionAccess'

/**
 * Bir imalatın detayı ve geçmişi; imalat seçilince okunur. Şef yanlış girişi siler: hesaptan düşer, Saha'ya
 * yansıtıldıysa oradan da çekilir.
 */
export function useProductionDetail(
  siteId: MaybeRefOrGetter<string>,
  itemId: MaybeRefOrGetter<string | null>,
) {
  const queryClient = useQueryClient()
  const detail = useGetProductionItem(() => toValue(itemId) ?? '', {
    query: { enabled: computed(() => !!toValue(itemId)) },
  })
  const remove = useDeleteProductionEntry({
    mutation: { onSuccess: () => refreshProduction(queryClient, toValue(siteId), true) },
  })
  return {
    item: computed(() => detail.data.value?.item),
    days: computed(() => historyDays(detail.data.value?.entries ?? [])),
    isLoading: detail.isLoading,
    deleteEntry: (entry: ProductionEntryView) => remove.mutateAsync({ entryId: entry.id }),
    isDeleting: remove.isPending,
  }
}
