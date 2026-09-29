import { computed, reactive, type MaybeRefOrGetter } from 'vue'
import { useGetProductionBoard } from '@/core/api/generated/production/production'
import {
  boardSummary,
  EMPTY_FILTER,
  filterOptions,
  statusCounts,
  visibleItems,
  type BoardFilter,
} from '@/core/production/productionBoard'

/**
 * Şantiyenin İmalat sekmesi: imalatlar, son girişler, özet kartları, durum sayıları ve süzgeç. Veri tek istekte
 * gelir; özet ve süzgeç ekranda hesaplanır. Başka biri girdiyse dakikada bir tazelenir.
 */
export function useProductionBoard(siteId: MaybeRefOrGetter<string>) {
  const board = useGetProductionBoard(siteId, { query: { refetchInterval: 60_000 } })
  const filter = reactive<BoardFilter>({ ...EMPTY_FILTER })
  const items = computed(() => board.data.value?.items ?? [])
  return {
    isLoading: board.isLoading,
    isError: board.isError,
    retry: () => board.refetch(),
    items,
    recentEntries: computed(() => board.data.value?.recentEntries ?? []),
    summary: computed(() => boardSummary(items.value)),
    counts: computed(() => statusCounts(items.value)),
    options: computed(() => filterOptions(items.value)),
    shown: computed(() => visibleItems(items.value, filter)),
    filter,
    clearFilter: () => Object.assign(filter, EMPTY_FILTER),
  }
}
