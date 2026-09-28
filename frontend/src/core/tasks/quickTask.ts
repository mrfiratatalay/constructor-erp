import dayjs from 'dayjs'
import { dueDateOf, type DueChoice } from '@/core/tasks/dueChoice'
import type { TaskForm } from '@/core/tasks/useSiteTasks'

/**
 * Sohbetteki görev penceresinin üç cevabı: ne yapılacak, kim yapacak, ne zaman ("Tarih seç"te seçilen gün).
 * Kişi seçilmemişken undefined: Element Plus'ın seçim kutusu seçilmemişi böyle bekler.
 */
export interface QuickTask {
  title: string
  assigneeId: string | undefined
  due: DueChoice
  date: string | null
}

export const EMPTY_QUICK_TASK: QuickTask = {
  title: '',
  assigneeId: undefined,
  due: 'today',
  date: null,
}

/** Üç soru da cevaplanınca görev verilir; "Tarih seç"te gün de seçilmiş olmalı. */
export function isQuickTaskReady(task: QuickTask): boolean {
  return !!task.title.trim() && !!task.assigneeId && (task.due !== 'date' || !!task.date)
}

/** Görevler sayfasının formuna çevrilir: öncelik Normal, not yok. */
export function quickTaskForm(task: QuickTask, today = dayjs()): TaskForm {
  return {
    title: task.title.trim(),
    note: null,
    assigneeId: task.assigneeId ?? null,
    dueDate: dueDateOf(task.due, task.date, today),
    priority: 'NORMAL',
  }
}
