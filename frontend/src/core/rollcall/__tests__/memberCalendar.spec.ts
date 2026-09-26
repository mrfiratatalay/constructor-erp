import { describe, expect, it } from 'vitest'
import { calendarClass, calendarIndex, dayDetailLines } from '@/core/rollcall/memberCalendar'

describe('kişinin takvimi', () => {
  it('günün rengi: geldi, gelmedi, izinli, katılmadı; yoklama alınmayan gün boyanmaz', () => {
    const days = calendarIndex([
      { day: '2026-09-21', record: { status: 'PRESENT' } },
      { day: '2026-09-22', record: { status: 'ABSENT', reason: 'SICK' } },
      { day: '2026-09-23', record: { status: 'EXCUSED' } },
      { day: '2026-09-24' },
    ])
    expect(calendarClass(days.get('2026-09-21'))).toBe('roll-day--present')
    expect(calendarClass(days.get('2026-09-22'))).toBe('roll-day--absent')
    expect(calendarClass(days.get('2026-09-23'))).toBe('roll-day--excused')
    expect(calendarClass(days.get('2026-09-24'))).toBe('roll-day--missed')
    expect(calendarClass(days.get('2026-09-27'))).toBe('')
  })

  it('gün detayı: katılma izi ve patronun işareti birlikte kalır', () => {
    expect(
      dayDetailLines({
        day: '2026-09-22',
        record: {
          status: 'EXCUSED',
          checkedInAt: '2026-09-22T08:12:00',
          siteName: 'Çamlıca',
          markedByName: 'Patron',
          markedAt: '2026-09-22T10:40:00',
        },
      }),
    ).toEqual(['Yoklamaya kendisi katıldı · 08:12 · Çamlıca', 'Patron işaretledi · 22 Eylül 10:40'])
    expect(dayDetailLines({ day: '2026-09-24' })).toEqual(['O gün yoklama vardı; katılmadı ve işaretlenmedi.'])
  })
})
