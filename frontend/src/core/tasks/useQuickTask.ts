import type { MaybeRefOrGetter } from 'vue'
import { dueDateOf, type DueChoice } from '@/core/tasks/dueChoice'
import { useSiteTasks } from '@/core/tasks/useSiteTasks'

/** Sohbetteki görev penceresinin üç cevabı: ne yapılacak, kim yapacak, ne zaman (seçilen gün "Tarih seç"te). */
export interface QuickTask {
  title: string
  assigneeId: string
  due: DueChoice
  date: string | null
}

/**
 * Sohbetin ＋'sındaki "📋 Görev": yalnızca üç soru; öncelik Normal, not yok. Görevler sayfasıyla aynı yoldan açılır
 * (useSiteTasks): sohbete görev kartı düşer, görev listesi tazelenir.
 */
export function useQuickTask(siteId: MaybeRefOrGetter<string>) {
  const { createTask, isSaving } = useSiteTasks(siteId)
  const assign = (task: QuickTask) =>
    createTask({
      title: task.title.trim(),
      note: null,
      assigneeId: task.assigneeId,
      dueDate: dueDateOf(task.due, task.date),
      priority: 'NORMAL',
    })
  return { assign, isSaving }
}
