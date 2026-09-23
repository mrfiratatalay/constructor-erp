import { describe, expect, it } from 'vitest'
import type { TaskView } from '@/core/api/generated/model'
import { doneTasks, openTasks } from '@/core/tasks/taskOrder'

const BASE: TaskView = {
  id: '',
  siteId: 's',
  title: '',
  status: 'TODO',
  priority: 'NORMAL',
  createdBy: { id: 'u', fullName: 'Patron' },
  createdAt: '2026-09-20T08:00:00Z',
}
const task = (id: string, fields: Partial<TaskView> = {}): TaskView => ({ ...BASE, id, ...fields })

describe('openTasks', () => {
  it('termini yakın olanı üste, terminsizi sona koyar; aynı günde yüksek öncelik önce gelir', () => {
    const tasks = [
      task('terminsiz'),
      task('sonra', { dueDate: '2026-10-05' }),
      task('yakin-normal', { dueDate: '2026-09-25' }),
      task('yakin-yuksek', { dueDate: '2026-09-25', priority: 'HIGH' }),
    ]
    expect(openTasks(tasks).map((t) => t.id)).toEqual(['yakin-yuksek', 'yakin-normal', 'sonra', 'terminsiz'])
  })

  it('tamamlananları açık listeye almaz; onlar en son tamamlanan üstte ayrı durur', () => {
    const tasks = [
      task('acik'),
      task('eski', { status: 'DONE', completedAt: '2026-09-21T10:00:00Z' }),
      task('yeni', { status: 'DONE', completedAt: '2026-09-22T10:00:00Z' }),
    ]
    expect(openTasks(tasks).map((t) => t.id)).toEqual(['acik'])
    expect(doneTasks(tasks).map((t) => t.id)).toEqual(['yeni', 'eski'])
  })
})
