import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { useCheckInToRollCall, useGetRollCall } from '@/core/api/generated/roll-calls/roll-calls'
import { useCurrentUser } from '@/core/auth/currentUser'
import { rollCallCard } from '@/core/rollcall/rollCallCard'
import { refreshRollCalls } from '@/core/rollcall/rollCallQueries'

/**
 * Sohbetteki yoklama kartı: kart kendi durumunu sorar (kaç kişi katıldı, ben katıldım mı) ve "Yoklamaya Katıl".
 * Katılınca kart, patronun ekranı ve takvim birlikte tazelenir.
 */
export function useRollCallCard(post: MaybeRefOrGetter<PostView>) {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()
  const postId = computed(() => toValue(post).id)
  const { data: view } = useGetRollCall(postId)
  const checkIn = useCheckInToRollCall({ mutation: { onSuccess: () => refreshRollCalls(queryClient) } })
  const card = computed(() => {
    const current = toValue(post)
    return rollCallCard(current.rollCallDay ?? '', view.value, user.value?.role === 'OWNER', current.site.name)
  })
  return {
    card,
    join: () => checkIn.mutateAsync({ postId: postId.value }),
    isJoining: checkIn.isPending,
  }
}
