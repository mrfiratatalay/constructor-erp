import type { QueryClient } from '@tanstack/vue-query'
import { getListSiteTasksQueryKey } from '@/core/api/generated/tasks/tasks'
import { refreshPostViews } from '@/core/posts/refreshPostViews'

/** Üretilen anahtarların önekleri: tek görev (sohbetteki görev kartı) ve teslimler (teslim kartı). */
const TASK_QUERY_PREFIX = ['api', 'tasks']
const DELIVERY_QUERY_PREFIX = ['api', 'deliveries']

/**
 * Görev açılınca, değişince ya da silinince onu gösteren her ekran birlikte tazelenir: görev listesi, sohbetteki
 * görev kartları ve sohbet (görev açılınca karta dair mesaj düşer). Görevler sayfası da ＋ menüsü de bunu kullanır.
 */
export function refreshTaskViews(queryClient: QueryClient, siteId: string) {
  return Promise.all([
    refreshPostViews(queryClient, siteId),
    queryClient.invalidateQueries({ queryKey: getListSiteTasksQueryKey(siteId) }),
    queryClient.invalidateQueries({ queryKey: TASK_QUERY_PREFIX }),
  ])
}

/**
 * Teslim edilince ya da şef cevap verince görevi gösteren her ekranla birlikte sohbetteki teslim kartları da
 * tazelenir: görevin durumu değişti, sohbete yeni mesaj düştü.
 */
export function refreshDeliveries(queryClient: QueryClient, siteId: string) {
  return Promise.all([
    refreshTaskViews(queryClient, siteId),
    queryClient.invalidateQueries({ queryKey: DELIVERY_QUERY_PREFIX }),
  ])
}
