import dayjs, { type Dayjs } from 'dayjs'
import type { TaskView } from '@/core/api/generated/model'
import type { StatusTone } from '@/core/format/statusTone'
import { shortDay } from '@/core/format/dates'
import { isDeliverable } from '@/core/tasks/deliverableTasks'

/**
 * Sohbetteki görev kartı: 📋 GÖREV, ne yapılacak, 👤 kim, 🕐 ne zaman, durum. Durum zincir ilerledikçe değişir:
 * Bekliyor → Kontrol bekliyor → Eksik var → Tamamlandı. canDeliver: bakan kişi işin sorumlusu ve iş teslim
 * edilebilir; kartta büyük "✅ İŞİ TESLİM ET" durur.
 */
export interface TaskCard {
  what: string
  who: string | null
  when: string | null
  status: { label: string; tone: StatusTone }
  canDeliver: boolean
}

const CARD_STATUS: Record<TaskView['status'], { label: string; tone: StatusTone }> = {
  TODO: { label: 'Bekliyor', tone: 'warning' },
  IN_PROGRESS: { label: 'Devam ediyor', tone: 'warning' },
  SUBMITTED: { label: 'Kontrol bekliyor', tone: 'warning' },
  RETURNED: { label: 'Eksik var', tone: 'danger' },
  DONE: { label: 'Tamamlandı', tone: 'success' },
}

/** "Bugün", "Yarın", "3 gün gecikti", "12 Eki". Termin yoksa ya da iş bittiyse yazılacak bir şey yoktur (İlke 3). */
function whenOf(task: TaskView, today: Dayjs): string | null {
  if (!task.dueDate || task.status === 'DONE') return null
  const daysLeft = dayjs(task.dueDate).startOf('day').diff(today.startOf('day'), 'day')
  if (daysLeft < 0) return `${-daysLeft} gün gecikti`
  if (daysLeft === 0) return 'Bugün'
  if (daysLeft === 1) return 'Yarın'
  return shortDay(task.dueDate)
}

export function taskCard(task: TaskView, userId: string | undefined, today = dayjs()): TaskCard {
  const when = whenOf(task, today)
  return {
    what: task.title,
    who: task.assignee ? `👤 ${task.assignee.fullName}` : null,
    when: when ? `🕐 ${when}` : null,
    status: CARD_STATUS[task.status],
    canDeliver: task.assignee?.id === userId && isDeliverable(task.status),
  }
}
