import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useListPinnedPosts } from '@/core/api/generated/posts/posts'

/** Akışın üstündeki sabit mesaj şeridi (WhatsApp gibi): en son sabitlenen önde, en fazla üç. */
export function usePinnedPosts(siteId: MaybeRefOrGetter<string>) {
  const query = useListPinnedPosts(computed(() => ({ siteId: toValue(siteId) })), {
    query: { refetchInterval: 60_000 },
  })
  return { pinned: computed(() => query.data.value ?? []) }
}
