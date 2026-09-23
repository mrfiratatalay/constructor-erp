import type { TaskView, TaskViewPriority } from '@/core/api/generated/model'

const PRIORITY_RANK: Record<TaskViewPriority, number> = { HIGH: 0, NORMAL: 1, LOW: 2 }

/** Terminsiz görev en sona: bir tarihi olan her iş ondan önce ele alınır. */
function dueOrder(task: TaskView): string {
  return task.dueDate ?? '9999-12-31'
}

/**
 * Açık görevler: termini en yakın üstte, aynı gün içinde önceliği yüksek olan önce, sonra açılış sırası.
 * Tamamlananlar listenin sonunda ayrı durur ("Tamamlanan N görev", şantiye listesindeki gibi).
 */
export function openTasks(tasks: TaskView[]): TaskView[] {
  return tasks
    .filter((task) => task.status !== 'DONE')
    .sort(
      (a, b) =>
        dueOrder(a).localeCompare(dueOrder(b)) ||
        PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
        a.createdAt.localeCompare(b.createdAt),
    )
}

/** En son tamamlanan en üstte. */
export function doneTasks(tasks: TaskView[]): TaskView[] {
  return tasks
    .filter((task) => task.status === 'DONE')
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
}
