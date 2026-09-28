import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import {
  useApproveDelivery,
  useGetDelivery,
  useReturnDelivery,
} from '@/core/api/generated/deliveries/deliveries'
import type { PostView, ReturnDeliveryRequest } from '@/core/api/generated/model'
import { deliveryCard, markedPhoto } from '@/core/tasks/deliveryCard'
import { refreshDeliveries } from '@/core/tasks/deliveryQueries'

/**
 * Sohbetteki iş teslimi kartı: teslim mesajı ve şefin cevabı aynı teslimi okur (aynı önbellek). Şef buradan
 * onaylar ya da eksik der; cevap sohbete düşer, kart, görev listesi ve sohbet birlikte tazelenir.
 */
export function useDeliveryCard(post: MaybeRefOrGetter<PostView>) {
  const queryClient = useQueryClient()
  const deliveryId = computed(() => toValue(post).deliveryId ?? '')
  const { data: view } = useGetDelivery(deliveryId)
  const refresh = () => refreshDeliveries(queryClient, toValue(post).site.id)
  const approval = useApproveDelivery({ mutation: { onSuccess: refresh } })
  const sendBack = useReturnDelivery({ mutation: { onSuccess: refresh } })

  return {
    view,
    card: computed(() => (view.value ? deliveryCard(view.value, toValue(post).id) : null)),
    marked: computed(() => (view.value ? markedPhoto(view.value) : null)),
    approve: () => approval.mutateAsync({ deliveryId: deliveryId.value }),
    returnWith: (request: ReturnDeliveryRequest) =>
      sendBack.mutateAsync({ deliveryId: deliveryId.value, data: request }),
    isReviewing: computed(() => approval.isPending.value || sendBack.isPending.value),
  }
}
