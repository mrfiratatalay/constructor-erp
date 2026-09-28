import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import {
  useCreateTask,
  useDeleteTask,
  useListSiteTasks,
  useUpdateTask,
} from '@/core/api/generated/tasks/tasks'
import type { TaskView, TaskViewPriority, TaskViewStatus } from '@/core/api/generated/model'
import { refreshTaskViews } from '@/core/tasks/deliveryQueries'
import { doneTasks, openTasks } from '@/core/tasks/taskOrder'

/** Görev formunun alanları; açarken ve düzenlerken aynıdır. dueDate "YYYY-MM-DD". */
export interface TaskForm {
  title: string
  note: string | null
  assigneeId: string | null
  dueDate: string | null
  priority: TaskViewPriority
}

export function formOf(task: TaskView): TaskForm {
  const { title, note = null, assignee, dueDate = null, priority } = task
  return { title, note, assigneeId: assignee?.id ?? null, dueDate, priority }
}

/**
 * Bir şantiyenin görevleri ve bütün işleri; kabuklar yalnızca görüntüler. Her değişiklikten sonra liste, sohbetteki
 * görev kartları ve sohbet tazelenir: görev açılınca sohbete kartı düşer (Görevler sayfasından da ＋'dan da).
 */
export function useSiteTasks(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const refresh = () => refreshTaskViews(queryClient, toValue(siteId))
  const list = useListSiteTasks(siteId)
  const create = useCreateTask({ mutation: { onSuccess: refresh } })
  const update = useUpdateTask({ mutation: { onSuccess: refresh } })
  const remove = useDeleteTask({ mutation: { onSuccess: refresh } })

  /** postId: görevin fotoğrafı ya da notu olan akış gönderisi (gönderiden görev açılınca). */
  const createTask = (form: TaskForm, postId: string | null = null) =>
    create.mutateAsync({ siteId: toValue(siteId), data: { ...form, postId } })
  const saveTask = (task: TaskView, form: TaskForm) =>
    update.mutateAsync({ taskId: task.id, data: { ...form, status: task.status } })
  const moveTask = (task: TaskView, status: TaskViewStatus) =>
    update.mutateAsync({ taskId: task.id, data: { ...formOf(task), status } })
  const deleteTask = (task: TaskView) => remove.mutateAsync({ taskId: task.id })

  return {
    open: computed(() => openTasks(list.data.value ?? [])),
    done: computed(() => doneTasks(list.data.value ?? [])),
    isLoading: list.isPending,
    isSaving: computed(() => create.isPending.value || update.isPending.value),
    createTask,
    saveTask,
    moveTask,
    deleteTask,
  }
}
