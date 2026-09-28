import { computed, reactive, type MaybeRefOrGetter } from 'vue'
import {
  EMPTY_QUICK_TASK,
  isQuickTaskReady,
  quickTaskForm,
  type QuickTask,
} from '@/core/tasks/quickTask'
import { useSiteTasks } from '@/core/tasks/useSiteTasks'

/**
 * Sohbetin ＋'sındaki "📋 Görev": yalnızca üç soru; öncelik Normal, not yok. Görevler sayfasıyla aynı yoldan açılır
 * (useSiteTasks): sohbete görev kartı düşer, görev listesi tazelenir. Pencere her açılışta boş gelir (reset).
 */
export function useQuickTask(siteId: MaybeRefOrGetter<string>) {
  const { createTask, isSaving } = useSiteTasks(siteId)
  const form = reactive<QuickTask>({ ...EMPTY_QUICK_TASK })
  return {
    form,
    ready: computed(() => isQuickTaskReady(form)),
    reset: () => Object.assign(form, EMPTY_QUICK_TASK),
    assign: () => createTask(quickTaskForm(form)),
    isSaving,
  }
}
