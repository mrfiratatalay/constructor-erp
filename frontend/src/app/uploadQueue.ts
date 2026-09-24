import type { QueryClient } from '@tanstack/vue-query'
import type { Pinia } from 'pinia'
import { FEED_QUERY_PREFIX } from '@/core/posts/useFeed'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

const RETRY_EVERY_MS = 30_000

/**
 * Kuyruğu uygulama açılınca başlatır: telefonda bekleyen gönderiler geri yüklenir ve gönderilir.
 * İnternet gelince hemen, yoksa yarım dakikada bir tekrar denenir.
 */
export function installUploadQueue(pinia: Pinia, queryClient: QueryClient) {
  const queue = useUploadQueue(pinia)
  // Giden mesaj hem akışta hem listenin önizlemesinde ("Sen: …") görünür.
  queue.onSent(() =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [FEED_QUERY_PREFIX] }),
      queryClient.invalidateQueries({ queryKey: TODAY_QUERY_KEY }),
    ]),
  )
  window.addEventListener('online', () => void queue.flush())
  setInterval(() => queue.pending.length > 0 && void queue.flush(), RETRY_EVERY_MS)
  void queue.restore()
}
