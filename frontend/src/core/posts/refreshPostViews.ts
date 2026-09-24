import type { QueryClient } from '@tanstack/vue-query'
import { getListSiteLibraryQueryKey } from '@/core/api/generated/library/library'
import { getListPinnedPostsQueryKey, getSearchPostsQueryKey } from '@/core/api/generated/posts/posts'
import { FEED_QUERY_PREFIX } from '@/core/posts/useFeed'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

/**
 * Bir mesaj değişince (düzeltildi, silindi, sabitlendi, iletildi) onu gösteren her ekran birlikte yenilenir:
 * akış, ana ekran, sabit mesaj şeridi, arama sonuçları ve şantiyenin galerisi.
 */
export function refreshPostViews(queryClient: QueryClient, siteId: string) {
  const keys = [
    [FEED_QUERY_PREFIX],
    TODAY_QUERY_KEY,
    getListPinnedPostsQueryKey(),
    getSearchPostsQueryKey(),
    getListSiteLibraryQueryKey(siteId),
  ]
  return Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey: [...queryKey] })))
}
