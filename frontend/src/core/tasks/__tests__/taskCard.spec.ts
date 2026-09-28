import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import type { CurrentUserResponse, TaskView } from '@/core/api/generated/model'
import { dueDateOf } from '@/core/tasks/dueChoice'
import { taskCard } from '@/core/tasks/taskCard'
import { canAssignTasks } from '@/core/tasks/taskPermissions'

const today = dayjs('2026-09-28')

const task = (fields: Partial<TaskView> = {}) =>
  ({
    id: 't',
    title: 'Kalıp sökülecek',
    status: 'TODO',
    assignee: { id: 'ali', fullName: 'Ali' },
    dueDate: '2026-09-29',
    ...fields,
  }) as TaskView

describe('sohbetteki görev kartı', () => {
  it('ne yapılacak, kim, ne zaman, durum', () => {
    expect(taskCard(task(), 'veli', today)).toEqual({
      what: 'Kalıp sökülecek',
      who: '👤 Ali',
      when: '🕐 Yarın',
      status: { label: 'Bekliyor', tone: 'warning' },
      canDeliver: false,
    })
  })

  it('İŞİ TESLİM ET yalnızca işin sorumlusunda, iş teslim edilebilirken', () => {
    expect(taskCard(task(), 'ali', today).canDeliver).toBe(true)
    expect(taskCard(task({ status: 'RETURNED' }), 'ali', today).canDeliver).toBe(true)
    expect(taskCard(task({ status: 'SUBMITTED' }), 'ali', today).canDeliver).toBe(false)
    expect(taskCard(task({ status: 'DONE' }), 'ali', today).canDeliver).toBe(false)
  })

  it('zincir ilerledikçe durum; gecikme yazılır, biten işte zaman yazılmaz', () => {
    expect(taskCard(task({ status: 'SUBMITTED' }), 'ali', today).status.label).toBe(
      'Kontrol bekliyor',
    )
    expect(taskCard(task({ status: 'RETURNED' }), 'ali', today).status).toEqual({
      label: 'Eksik var',
      tone: 'danger',
    })
    expect(taskCard(task({ dueDate: '2026-09-25' }), 'ali', today).when).toBe('🕐 3 gün gecikti')
    expect(taskCard(task({ dueDate: '2026-09-28' }), 'ali', today).when).toBe('🕐 Bugün')
    expect(taskCard(task({ status: 'DONE' }), 'ali', today)).toMatchObject({
      when: null,
      status: { label: 'Tamamlandı', tone: 'success' },
    })
    expect(taskCard(task({ assignee: undefined, dueDate: undefined }), 'ali', today)).toMatchObject(
      {
        who: null,
        when: null,
      },
    )
  })
})

describe('görev penceresi', () => {
  it('ne zaman: bugün, yarın ya da takvimden seçilen gün', () => {
    expect(dueDateOf('today', null, today)).toBe('2026-09-28')
    expect(dueDateOf('tomorrow', null, today)).toBe('2026-09-29')
    expect(dueDateOf('date', '2026-10-05', today)).toBe('2026-10-05')
    expect(dueDateOf('date', null, today)).toBeNull()
  })

  it('＋ menüsündeki Görev patronda ve şefte, çalışanda değil', () => {
    expect(canAssignTasks({ role: 'OWNER' } as CurrentUserResponse)).toBe(true)
    expect(canAssignTasks({ role: 'SITE_LEAD' } as CurrentUserResponse)).toBe(true)
    expect(canAssignTasks({ role: 'WORKER' } as CurrentUserResponse)).toBe(false)
    expect(canAssignTasks(undefined)).toBe(false)
  })
})
