import type { QueryClient } from '@tanstack/vue-query'
import { getListSiteTasksQueryKey } from '@/core/api/generated/tasks/tasks'
import { refreshPostViews } from '@/core/posts/refreshPostViews'

/** Bütün teslim sorguları bu önekle başlar (üretilen anahtarlar). */
const DELIVERY_QUERY_PREFIX = ['api', 'deliveries']

/**
 * Teslim edilince ya da şef cevap verince onu gösteren her ekran birlikte tazelenir: sohbet (yeni mesaj düştü),
 * şantiye listesi, görev listesi (durum değişti) ve sohbetteki teslim kartları.
 */
export function refreshDeliveries(queryClient: QueryClient, siteId: string) {
  return Promise.all([
    refreshPostViews(queryClient, siteId),
    queryClient.invalidateQueries({ queryKey: getListSiteTasksQueryKey(siteId) }),
    queryClient.invalidateQueries({ queryKey: DELIVERY_QUERY_PREFIX }),
  ])
}
