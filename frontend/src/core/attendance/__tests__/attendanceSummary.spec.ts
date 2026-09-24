import { describe, expect, it } from 'vitest'
import type { SiteAttendanceOverview } from '@/core/api/generated/model'
import { monthSummary, todayLine } from '@/core/attendance/attendanceSummary'

const site = (fields: Partial<SiteAttendanceOverview>): SiteAttendanceOverview => ({
  siteId: 's',
  siteName: 'Çamlıca',
  workerCount: 12,
  ...fields,
})

describe('yoklama özetleri', () => {
  it('ana sayfa satırı: bugünün sayıları, yoksa son yoklama günü, o da yoksa hiçbir şey', () => {
    expect(todayLine(site({ today: { present: 10, absent: 2, excused: 0 } }))).toBe('Bugün 10 geldi · 2 gelmedi · 0 izinli')
    expect(todayLine(site({ lastDay: '2026-09-23' }))).toBe('Son yoklama: 23 Eyl')
    expect(todayLine(site({}))).toBe('')
  })

  it('ay özeti tek satır; o ay yoklama yoksa yazılmaz', () => {
    const history = {
      siteId: 's',
      month: '2026-09',
      workerCount: 12,
      totals: { present: 11, absent: 1, excused: 0 },
      days: [{ day: '2026-09-25', counts: { present: 11, absent: 1, excused: 0 } }],
    }
    expect(monthSummary(history)).toBe('Eylül 2026 · 1 yoklama günü · %92 geldi')
    expect(monthSummary({ ...history, days: [] })).toBe('')
    expect(monthSummary(undefined)).toBe('')
  })
})
