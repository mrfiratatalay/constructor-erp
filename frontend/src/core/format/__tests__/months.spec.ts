import { describe, expect, it } from 'vitest'
import { fullDate, monthKey, monthTitle, shiftMonth } from '@/core/format/dates'

describe('ay yardımcıları', () => {
  it('ay anahtarı tarihten çıkar; ileri geri giderken yıl sınırı doğru geçilir', () => {
    expect(monthKey('2026-09-25')).toBe('2026-09')
    expect(shiftMonth('2026-01', -1)).toBe('2025-12')
    expect(shiftMonth('2026-12', 1)).toBe('2027-01')
  })

  it('başlık ve tarih Türkçe yazılır', () => {
    expect(monthTitle('2026-09')).toBe('Eylül 2026')
    expect(fullDate('2026-09-25')).toBe('25 Eylül 2026')
  })
})
