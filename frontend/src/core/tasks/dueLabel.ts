import dayjs from 'dayjs'
import type { TaskView } from '@/core/api/generated/model'
import { shortDay } from '@/core/format/dates'
import type { StatusTone } from '@/core/format/statusTone'

/**
 * Terminin ne anlama geldiği yazıyla (TASARIM.md İlke 2): "3 gün gecikti", "Bugün teslim", "Termin 12 Eki".
 * Tamamlanan ya da termini olmayan görevde yazılacak bir şey yoktur (İlke 3).
 */
export function dueLabel(
  task: TaskView,
  today = dayjs(),
): { label: string; tone: StatusTone } | null {
  if (!task.dueDate || task.status === 'DONE') return null
  const due = dayjs(task.dueDate)
  const daysLeft = due.startOf('day').diff(today.startOf('day'), 'day')
  if (daysLeft < 0) return { label: `${-daysLeft} gün gecikti`, tone: 'warning' }
  if (daysLeft === 0) return { label: 'Bugün teslim', tone: 'warning' }
  if (daysLeft === 1) return { label: 'Yarın teslim', tone: 'neutral' }
  return { label: `Termin ${shortDay(task.dueDate)}`, tone: 'neutral' }
}
