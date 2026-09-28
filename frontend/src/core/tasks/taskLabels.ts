import type { TaskViewPriority, TaskViewStatus } from '@/core/api/generated/model'
import type { StatusTone } from '@/core/format/statusTone'

/**
 * Kontrolde: çalışan fotoğrafla teslim etti, şef bakacak. Eksik var: şef geri gönderdi, çalışan tamamlayıp yeniden
 * teslim eder. İkisi elle seçilmez: teslimle ve şefin cevabıyla olur (bkz. TASARIM.md "İş teslimi").
 */
export const TASK_STATUS: Record<TaskViewStatus, { label: string; tone: StatusTone }> = {
  TODO: { label: 'Yapılacak', tone: 'neutral' },
  IN_PROGRESS: { label: 'Devam ediyor', tone: 'warning' },
  SUBMITTED: { label: 'Kontrolde', tone: 'warning' },
  RETURNED: { label: 'Eksik var', tone: 'danger' },
  DONE: { label: 'Tamamlandı', tone: 'success' },
}

/** Görev penceresinde elle seçilen durumlar. */
const MANUAL_STATUSES: TaskViewStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export const TASK_PRIORITY: Record<TaskViewPriority, string> = {
  LOW: 'Düşük',
  NORMAL: 'Normal',
  HIGH: 'Yüksek',
}

export const TASK_STATUS_OPTIONS = MANUAL_STATUSES.map((status) => ({
  value: status,
  label: TASK_STATUS[status].label,
}))

/**
 * Satırda etiket olan durumlar: yapılıyor, kontrolde, eksik var. "Yapılacak" her açık görevin varsayılanıdır,
 * tamamlanan ayrı bölümde durur; ikisi yazılmaz (TASARIM.md İlke 3).
 */
export function statusTag(status: TaskViewStatus): { label: string; tone: StatusTone } | null {
  return status === 'TODO' || status === 'DONE' ? null : TASK_STATUS[status]
}

export const TASK_PRIORITY_OPTIONS = (Object.keys(TASK_PRIORITY) as TaskViewPriority[]).map(
  (priority) => ({
    value: priority,
    label: TASK_PRIORITY[priority],
  }),
)

/** Normal öncelik bilgi taşımaz, yazılmaz (TASARIM.md İlke 3); yalnızca sıradan sapan öncelik görünür. */
export function priorityTag(
  priority: TaskViewPriority,
): { label: string; tone: StatusTone } | null {
  if (priority === 'HIGH') return { label: 'Yüksek öncelik', tone: 'warning' }
  if (priority === 'LOW') return { label: 'Düşük öncelik', tone: 'neutral' }
  return null
}
