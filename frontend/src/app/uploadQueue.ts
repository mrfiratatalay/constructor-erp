import type { QueryClient } from '@tanstack/vue-query'
import type { Pinia } from 'pinia'
import type { SessionContextView } from '@/core/api/generated/model'
import { sessionContextQuery } from '@/core/auth/sessionContext'
import { FEED_QUERY_PREFIX } from '@/core/posts/useFeed'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

const RETRY_EVERY_MS = 30_000

/**
 * Kuyruğu uygulama açılınca başlatır: telefonda bekleyen gönderiler geri yüklenir ve gönderilir.
 * İnternet gelince hemen, yoksa yarım dakikada bir tekrar denenir. Kuyruk oturumun sahibini oturum bağlamından
 * izler: giriş, çıkış ya da başka bir hesaba geçiş olunca yalnızca o kişinin gönderileri görünür ve gider.
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
  const owner = () => queryClient.getQueryData<SessionContextView>(sessionContextQuery.queryKey)?.user.id ?? null
  queryClient.getQueryCache().subscribe(() => void queue.setOwner(owner()))
  window.addEventListener('online', () => void queue.flush())
  setInterval(() => queue.pending.length > 0 && void queue.flush(), RETRY_EVERY_MS)
  void queue.restore()
}
