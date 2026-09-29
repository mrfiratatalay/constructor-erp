import { keepPreviousData, useInfiniteQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import {
  getListMaterialMovementsQueryKey,
  listMaterialMovements,
} from '@/core/api/generated/materials/materials'
import type { ListMaterialMovementsParams } from '@/core/api/generated/model'

/**
 * Telefondaki hareket listesi: aynı süzgeçli, sayfalı uç; aşağı kaydırdıkça sonraki sayfa eklenir (sayfa
 * numarası yerine sonsuz liste). Anahtar masaüstü tablosununkinden ayrıdır ("feed"), önek aynıdır: bir hareket
 * kaydedilince ikisi de tazelenir.
 */
export function useMovementFeed(params: MaybeRefOrGetter<ListMaterialMovementsParams>) {
  const query = useInfiniteQuery({
    queryKey: computed(() => [...getListMaterialMovementsQueryKey(toValue(params)), 'feed']),
    queryFn: ({ pageParam, signal }) =>
      listMaterialMovements({ ...toValue(params), page: pageParam }, undefined, signal),
    initialPageParam: 0,
    getNextPageParam: (last) => ((last.page + 1) * last.size < last.total ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
  })
  const first = computed(() => query.data.value?.pages[0])
  return {
    rows: computed(() => query.data.value?.pages.flatMap((page) => page.items) ?? []),
    total: computed(() => first.value?.total ?? 0),
    counts: computed(() => first.value?.counts),
    hasMore: query.hasNextPage,
    loadMore: () => query.fetchNextPage(),
    isLoadingMore: query.isFetchingNextPage,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}
