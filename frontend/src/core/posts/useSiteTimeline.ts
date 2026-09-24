import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useListSiteEvents } from '@/core/api/generated/sites/sites'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'
import { buildTimeline } from '@/core/posts/timeline'
import { useFeed } from '@/core/posts/useFeed'

/**
 * Şantiye sayfasının akışı: mesajlar, sistem satırları ve bu telefondan henüz gitmemiş mesajlar (🕓).
 * Gitmeyen mesaj WhatsApp'taki gibi akışın dibinde, gönderilmiş gibi durur; gidince yerini asıl mesaj alır.
 */
export function useSiteTimeline(siteId: MaybeRefOrGetter<string>) {
  const feed = useFeed(siteId)
  const events = useListSiteEvents(siteId, { query: { refetchInterval: 60_000 } })
  const queue = useUploadQueue()

  const days = computed(() => buildTimeline(feed.posts.value, events.data.value ?? [], !feed.hasMore.value))
  const pending = computed(() =>
    queue.items.filter((item) => item.post.siteId === toValue(siteId) && item.state !== 'failed').map((item) => item.post),
  )
  /** Eskiden yeniye mesajlar: "buradan aşağısı yeni" çizgisi ve dibe inme bunlarla hesaplanır. */
  const posts = computed(() => [...feed.posts.value].reverse())

  return { ...feed, days, pending, posts }
}
