import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { listFieldUpdates } from '@/core/api/generated/posts/posts'
import { fieldDays } from '@/core/field/fieldDays'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'
import { FEED_QUERY_PREFIX, feedRefreshInterval } from '@/core/posts/useFeed'

const PAGE_SIZE = 30

/**
 * Saha sekmesinin akışı: şantiyenin saha güncellemeleri, günlere ayrılmış, en yenisi üstte. Aşağı kaydırdıkça
 * önceki günler gelir. Bu telefondan henüz gitmemiş güncellemeler (🕓) en üstte durur.
 *
 * Sorgu anahtarı sohbet akışıyla aynı önekle başlar: gönderi gidince, düzeltilince ya da silinince ikisi
 * birlikte yenilenir (aynı gönderi iki sekmede de görünür).
 */
export function useFieldUpdates(siteId: MaybeRefOrGetter<string>) {
  const query = useInfiniteQuery({
    queryKey: computed(() => [FEED_QUERY_PREFIX, { siteId: toValue(siteId), fieldUpdates: true }]),
    queryFn: ({ pageParam, signal }) =>
      listFieldUpdates({ siteId: toValue(siteId), cursor: pageParam ?? undefined, limit: PAGE_SIZE }, undefined, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor ?? null,
    refetchInterval: (current) => feedRefreshInterval(current.state.data?.pages),
  })
  const queue = useUploadQueue()

  const entries = computed(() => query.data.value?.pages.flatMap((page) => page.items) ?? [])
  const pending = computed(() =>
    queue.items
      .filter((item) => item.post.siteId === toValue(siteId) && item.post.fieldUpdate && item.state !== 'failed')
      .map((item) => item.post)
      .reverse(),
  )

  const days = computed(() => fieldDays(entries.value, pending.value, query.hasNextPage.value))

  return {
    days,
    isEmpty: computed(() => !days.value.length),
    isLoading: query.isPending,
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: () => query.fetchNextPage(),
  }
}
