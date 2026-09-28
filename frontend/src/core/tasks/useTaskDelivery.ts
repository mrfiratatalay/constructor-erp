import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useDeliverTask } from '@/core/api/generated/deliveries/deliveries'
import { useListSiteTasks } from '@/core/api/generated/tasks/tasks'
import { useCurrentUser } from '@/core/auth/currentUser'
import { deliverableTasks } from '@/core/tasks/deliverableTasks'
import { refreshDeliveries } from '@/core/tasks/deliveryQueries'

/**
 * "İş Teslim Et": bu şantiyede kişiye verilmiş açık işler ve teslimin kendisi. Fotoğraflar seçilirken küçültülür
 * (useDeliveryPhotos). Teslim edilince sohbet, görev listesi ve kartlar tazelenir.
 */
export function useTaskDelivery(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()
  const { data: tasks, isPending } = useListSiteTasks(siteId)
  const mutation = useDeliverTask({
    mutation: { onSuccess: () => refreshDeliveries(queryClient, toValue(siteId)) },
  })

  const deliver = (taskId: string, photos: File[]) =>
    mutation.mutateAsync({ taskId, data: { photos } })

  return {
    tasks: computed(() => deliverableTasks(tasks.value ?? [], user.value?.id)),
    isLoading: isPending,
    deliver,
    isDelivering: mutation.isPending,
  }
}
