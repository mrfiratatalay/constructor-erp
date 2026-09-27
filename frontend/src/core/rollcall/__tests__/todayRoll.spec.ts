import { describe, expect, it } from 'vitest'
import type { DayRecord, MemberDayView } from '@/core/api/generated/model'
import { recordLabel } from '@/core/rollcall/rollCallLabels'
import { countsLine, rollSections, rowDetail } from '@/core/rollcall/todayRoll'

const member = (fullName: string, record?: Partial<DayRecord>): MemberDayView => ({
  member: { id: fullName, fullName },
  record: record ? { status: 'PRESENT', ...record } : undefined,
})

describe('patronun yoklama ekranı', () => {
  it('bölümler: katılmayanlar, gelmeyenler (izinli dahil), gelenler', () => {
    const sections = rollSections([
      member('Ali'),
      member('Veli', { status: 'ABSENT', reason: 'SICK' }),
      member('Hasan', { status: 'EXCUSED' }),
      member('Musa', { checkedInAt: '2026-09-27T08:12:00' }),
    ])
    expect(sections.missing.map((row) => row.member.fullName)).toEqual(['Ali'])
    expect(sections.absent.map((row) => row.member.fullName)).toEqual(['Veli', 'Hasan'])
    expect(sections.present.map((row) => row.member.fullName)).toEqual(['Musa'])
  })

  it('özet satırı; katılmayan yoksa yazılmaz', () => {
    expect(countsLine({ present: 8, absent: 1, excused: 1, missing: 2 })).toBe(
      '8 geldi · 1 gelmedi · 1 izinli · 2 katılmadı',
    )
    expect(countsLine({ present: 8, absent: 0, excused: 0, missing: 0 })).toBe(
      '8 geldi · 0 gelmedi · 0 izinli',
    )
    expect(countsLine({ present: 20, absent: 2, excused: 1, missing: 0 }, ' gün')).toBe(
      '20 gün geldi · 2 gün gelmedi · 1 gün izinli',
    )
  })

  it('satırın ikinci satırı: katıldıysa saat ve şantiye, işaretlendiyse kim işaretledi', () => {
    expect(
      rowDetail({ status: 'PRESENT', checkedInAt: '2026-09-27T08:12:00', siteName: 'Çamlıca' }),
    ).toBe('08:12 · Çamlıca')
    expect(rowDetail({ status: 'PRESENT', markedByName: 'Patron' })).toBe('Patron işaretledi')
    expect(
      rowDetail({ status: 'EXCUSED', checkedInAt: '2026-09-27T08:12:00', markedByName: 'Patron' }),
    ).toBe('Patron işaretledi')
    expect(rowDetail(undefined)).toBe('')
  })

  it('durum her zaman yazıyla: gelmeyende nedeni de', () => {
    expect(recordLabel({ status: 'ABSENT', reason: 'SICK' })).toBe('Gelmedi · Hastalık')
    expect(recordLabel({ status: 'EXCUSED' })).toBe('İzinli')
    expect(recordLabel(undefined)).toBe('Katılmadı')
  })
})
