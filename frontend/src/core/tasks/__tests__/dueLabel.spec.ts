import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import type { TaskView } from '@/core/api/generated/model'
import { dueLabel } from '@/core/tasks/dueLabel'

const TODAY = dayjs('2026-09-23T15:00:00')
const task = (dueDate: string | null, status: TaskView['status'] = 'TODO'): TaskView => ({
  id: 't',
  siteId: 's',
  title: 'İş',
  status,
  priority: 'NORMAL',
  dueDate,
  createdBy: { id: 'u', fullName: 'Patron' },
  createdAt: '2026-09-20T08:00:00Z',
})

describe('dueLabel', () => {
  it.each([
    ['2026-09-20', '3 gün gecikti'],
    ['2026-09-23', 'Bugün teslim'],
    ['2026-09-24', 'Yarın teslim'],
    ['2026-10-12', 'Termin 12 Eki'],
  ])('%s → %s', (dueDate, expected) => {
    expect(dueLabel(task(dueDate), TODAY)?.label).toBe(expected)
  })

  it('terminsiz ya da tamamlanmış görevde yazılacak bir şey yoktur', () => {
    expect(dueLabel(task(null), TODAY)).toBeNull()
    expect(dueLabel(task('2026-09-20', 'DONE'), TODAY)).toBeNull()
  })
})
