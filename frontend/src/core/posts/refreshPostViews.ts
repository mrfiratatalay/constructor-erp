import type { QueryClient } from '@tanstack/vue-query'
import { getListSitePhotosQueryKey } from '@/core/api/generated/photos/photos'
import { FEED_QUERY_PREFIX } from '@/core/posts/useFeed'
import { TODAY_QUERY_PREFIX } from '@/core/today/useToday'

export const ISSUES_QUERY_PREFIX = '/api/issues'

/**
 * Bir gönderi değişince (çözüldü, düzeltildi, silindi) onu gösteren her ekran birlikte yenilenir:
 * akış, ana ekran ve şantiyenin fotoğrafları.
 */
export function refreshPostViews(queryClient: QueryClient, siteId: string) {
  const prefixes = [FEED_QUERY_PREFIX, ISSUES_QUERY_PREFIX, TODAY_QUERY_PREFIX]
  return Promise.all([
    ...prefixes.map((prefix) => queryClient.invalidateQueries({ queryKey: [prefix] })),
    queryClient.invalidateQueries({ queryKey: getListSitePhotosQueryKey(siteId) }),
  ])
}
