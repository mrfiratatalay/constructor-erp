import type { MemberCalendarDay } from '@/core/api/generated/model'
import { clockTime, dateTime } from '@/core/format/dates'
import { dayKind, type DayKind } from '@/core/rollcall/rollCallLabels'

/** Takvimde günü bulmak için: "2026-09-22" → o günün kaydı. Listede olmayan gün boyanmaz (yoklama alınmadı). */
export function calendarIndex(days: MemberCalendarDay[]): Map<string, MemberCalendarDay> {
  return new Map(days.map((day) => [day.day, day]))
}

/** Takvim hücresinin rengi (CSS sınıfı): geldi yeşil, gelmedi kırmızı, izinli sarı, katılmadı gri. */
export function calendarClass(day: MemberCalendarDay | undefined): string {
  return day ? `roll-day--${dayKind(day.record).toLowerCase() as Lowercase<DayKind>}` : ''
}

/**
 * Güne dokununca açılan detayın satırları: kendisi katıldıysa saati ve şantiyesi, patron işaretlediyse kim ve
 * ne zaman. İkisi birden olabilir: patron sonradan değiştirse de katılma izi kalır.
 */
export function dayDetailLines(day: MemberCalendarDay): string[] {
  const record = day.record
  if (!record) return ['O gün yoklama vardı; katılmadı ve işaretlenmedi.']
  const lines: string[] = []
  if (record.checkedInAt) {
    lines.push(['Yoklamaya kendisi katıldı', clockTime(record.checkedInAt), record.siteName].filter(Boolean).join(' · '))
  }
  if (record.markedByName && record.markedAt) {
    lines.push(`${record.markedByName} işaretledi · ${dateTime(record.markedAt)}`)
  }
  return lines
}
