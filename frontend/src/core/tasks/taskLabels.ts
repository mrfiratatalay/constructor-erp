import type { TaskViewPriority, TaskViewStatus } from '@/core/api/generated/model'
import type { StatusTone } from '@/core/format/statusTone'

export const TASK_STATUS: Record<TaskViewStatus, { label: string; tone: StatusTone }> = {
  TODO: { label: 'Yapılacak', tone: 'neutral' },
  IN_PROGRESS: { label: 'Devam ediyor', tone: 'warning' },
  DONE: { label: 'Tamamlandı', tone: 'success' },
}

export const TASK_PRIORITY: Record<TaskViewPriority, string> = {
  LOW: 'Düşük',
  NORMAL: 'Normal',
  HIGH: 'Yüksek',
}

export const TASK_STATUS_OPTIONS = (Object.keys(TASK_STATUS) as TaskViewStatus[]).map((status) => ({
  value: status,
  label: TASK_STATUS[status].label,
}))

export const TASK_PRIORITY_OPTIONS = (Object.keys(TASK_PRIORITY) as TaskViewPriority[]).map((priority) => ({
  value: priority,
  label: TASK_PRIORITY[priority],
}))

/** Normal öncelik bilgi taşımaz, yazılmaz (TASARIM.md İlke 3); yalnızca sıradan sapan öncelik görünür. */
export function priorityTag(priority: TaskViewPriority): { label: string; tone: StatusTone } | null {
  if (priority === 'HIGH') return { label: 'Yüksek öncelik', tone: 'warning' }
  if (priority === 'LOW') return { label: 'Düşük öncelik', tone: 'neutral' }
  return null
}
