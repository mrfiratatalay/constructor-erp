import type { TaskView } from '@/core/api/generated/model'

const DELIVERABLE = new Set<TaskView['status']>(['RETURNED', 'IN_PROGRESS', 'TODO'])
const ORDER: TaskView['status'][] = ['RETURNED', 'IN_PROGRESS', 'TODO']

/**
 * "İş Teslim Et"te listelenen işler: bu şantiyede kişiye verilmiş, bitmemiş ve kontrolde olmayan görevler.
 * Eksiği dönen iş en üstte (yeniden teslim edilecek olan o), sonra yapılmakta olan, sonra sıradaki.
 */
export function deliverableTasks(tasks: TaskView[], userId: string | undefined): TaskView[] {
  return tasks
    .filter((task) => task.assignee?.id === userId && DELIVERABLE.has(task.status))
    .sort((left, right) => ORDER.indexOf(left.status) - ORDER.indexOf(right.status))
}
