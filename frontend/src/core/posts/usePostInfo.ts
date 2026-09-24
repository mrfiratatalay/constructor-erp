import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useListPostReceipts } from '@/core/api/generated/posts/posts'

/**
 * Mesaj bilgisi (WhatsApp'ta "Bilgi"): kim gördü, ne zaman; kim henüz görmedi. Pencere açıkken sorulur,
 * postId boşsa sorgu çalışmaz.
 */
export function usePostInfo(postId: MaybeRefOrGetter<string | null>) {
  const query = useListPostReceipts(computed(() => toValue(postId) ?? ''), {
    query: { enabled: computed(() => !!toValue(postId)) },
  })
  const receipts = computed(() => query.data.value ?? [])
  return {
    seen: computed(() => receipts.value.filter((receipt) => receipt.seenAt)),
    notSeen: computed(() => receipts.value.filter((receipt) => !receipt.seenAt)),
    isLoading: query.isFetching,
  }
}
