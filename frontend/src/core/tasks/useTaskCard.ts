import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { useGetTask } from '@/core/api/generated/tasks/tasks'
import { useCurrentUser } from '@/core/auth/currentUser'
import { taskCard } from '@/core/tasks/taskCard'

/**
 * Sohbetteki görev kartı görevini okur ve kendini tazeler (15 sn, sohbetin akışı gibi): başka telefondan teslim
 * edilen ya da onaylanan işin durumu kartta değişir. Kendi yaptığın değişiklikte kart hemen tazelenir
 * (refreshTaskViews, refreshDeliveries).
 */
export function useTaskCard(post: MaybeRefOrGetter<PostView>) {
  const { data: user } = useCurrentUser()
  const taskId = computed(() => toValue(post).taskId ?? '')
  const { data: task } = useGetTask(taskId, { query: { refetchInterval: 15_000 } })
  return {
    task,
    card: computed(() => (task.value ? taskCard(task.value, user.value?.id) : null)),
  }
}
