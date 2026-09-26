import { describe, expect, it } from 'vitest'
import { isExportableMonth, rollCallExportUrl } from '@/core/rollcall/rollCallQueries'

describe('yoklamanın Excel dosyası', () => {
  it('ayın dosyasının adresi', () => {
    expect(rollCallExportUrl('2026-09')).toBe('/api/roll-calls/export?month=2026-09')
  })

  it('bu ay ve geçmiş aylar indirilir, gelecek aylar indirilmez', () => {
    const now = new Date()
    expect(isExportableMonth(now)).toBe(true)
    expect(isExportableMonth(new Date(2020, 0, 1))).toBe(true)
    expect(isExportableMonth(new Date(now.getFullYear(), now.getMonth() + 1, 1))).toBe(false)
  })
})
