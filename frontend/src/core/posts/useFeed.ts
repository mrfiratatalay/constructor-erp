import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { listPosts } from '@/core/api/generated/posts/posts'
import type { PostPage } from '@/core/api/generated/model'
import { groupByDay } from '@/core/posts/groupByDay'

/** Tüm akış sorgularının ortak öneki: gönderi gidince hepsi birden yenilenir. */
export const FEED_QUERY_PREFIX = '/api/posts'

const PAGE_SIZE = 20

/** İşlenen video/ses varsa sık, yoksa dakikada bir yenilenir: patron ekranı açık bıraksa da güncel kalır. */
function refreshInterval(pages: PostPage[] | undefined): number {
  const processing = pages?.some((page) => page.items.some((post) => post.media.some((m) => m.status === 'PROCESSING')))
  return processing ? 4_000 : 60_000
}

/** siteId boşsa kişinin görebildiği bütün şantiyeler. Aşağı kaydırdıkça daha eskiler gelir. */
export function useFeed(siteId: MaybeRefOrGetter<string | undefined>) {
  const query = useInfiniteQuery({
    queryKey: computed(() => [FEED_QUERY_PREFIX, { siteId: toValue(siteId) }]),
    queryFn: ({ pageParam, signal }) =>
      listPosts({ siteId: toValue(siteId), cursor: pageParam ?? undefined, limit: PAGE_SIZE }, undefined, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor ?? null,
    refetchInterval: (current) => refreshInterval(current.state.data?.pages),
  })

  return {
    days: computed(() => groupByDay(query.data.value?.pages.flatMap((page) => page.items) ?? [])),
    isLoading: query.isPending,
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: () => query.fetchNextPage(),
    refresh: () => query.refetch(),
  }
}
