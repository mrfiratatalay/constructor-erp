import { describe, expect, it } from 'vitest'
import { statusTag, TASK_STATUS_OPTIONS } from '@/core/tasks/taskLabels'

describe('görev durumları', () => {
  it('satırda yapılıyor, kontrolde ve eksik var yazar; yapılacak ve tamamlandı yazılmaz', () => {
    expect(statusTag('IN_PROGRESS')?.label).toBe('Devam ediyor')
    expect(statusTag('SUBMITTED')).toEqual({ label: 'Kontrolde', tone: 'warning' })
    expect(statusTag('RETURNED')).toEqual({ label: 'Eksik var', tone: 'danger' })
    expect(statusTag('TODO')).toBeNull()
    expect(statusTag('DONE')).toBeNull()
  })

  it('kontrolde ve eksik var elle seçilmez: teslimle ve şefin cevabıyla olur', () => {
    expect(TASK_STATUS_OPTIONS.map((option) => option.label)).toEqual([
      'Yapılacak',
      'Devam ediyor',
      'Tamamlandı',
    ])
  })
})
