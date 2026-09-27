import type { MemberCalendarDay } from '@/core/api/generated/model'
import { clockTime, dateTime, todayIsoDate } from '@/core/format/dates'
import { dayKind, statusLabel, type DayKind } from '@/core/rollcall/rollCallLabels'

const SYMBOLS: Record<DayKind, string> = { PRESENT: '✓', ABSENT: '✕', EXCUSED: 'İ', MISSED: '–' }

/**
 * Takvimin altındaki açıklama: renk tek başına anlam taşımaz (TASARIM.md İlke 2). Telefonun dar hücresine
 * kelime sığmaz; hücrede kısa işaret durur, anlamı burada yazar.
 */
export const CALENDAR_LEGEND = (['PRESENT', 'ABSENT', 'EXCUSED', 'MISSED'] as const).map(
  (kind) => ({
    kind,
    label: statusLabel(kind),
    symbol: SYMBOLS[kind],
    className: `roll-day--${kind.toLowerCase()}`,
  }),
)

/** Takvimde günü bulmak için: "2026-09-22" → o günün kaydı. Listede olmayan gün boyanmaz (yoklama alınmadı). */
export function calendarIndex(days: MemberCalendarDay[]): Map<string, MemberCalendarDay> {
  return new Map(days.map((day) => [day.day, day]))
}

/** Takvim hücresinin rengi (CSS sınıfı): geldi yeşil, gelmedi kırmızı, izinli sarı, katılmadı gri. */
export function calendarClass(day: MemberCalendarDay | undefined): string {
  return day ? `roll-day--${dayKind(day.record).toLowerCase() as Lowercase<DayKind>}` : ''
}

/** Telefonun dar hücresindeki kısa işaret: ✓ geldi, ✕ gelmedi, İ izinli, – katılmadı. */
export function daySymbol(day: MemberCalendarDay | undefined): string {
  return day ? SYMBOLS[dayKind(day.record)] : ''
}

/** Patron geçmiş günü ve bugünü işaretler (unutulan gün düzeltilir); ileri bir gün işaretlenmez. */
export function canMarkDay(day: string): boolean {
  return day <= todayIsoDate()
}

/**
 * Güne dokununca açılan detayın satırları: kendisi katıldıysa saati ve şantiyesi, patron işaretlediyse kim ve
 * ne zaman. İkisi birden olabilir: patron sonradan değiştirse de katılma izi kalır.
 */
export function dayDetailLines(day: MemberCalendarDay | undefined): string[] {
  if (!day) return ['O gün yoklama alınmadı.']
  const record = day.record
  if (!record) return ['O gün yoklama vardı; katılmadı ve işaretlenmedi.']
  const lines: string[] = []
  if (record.checkedInAt) {
    lines.push(
      ['Yoklamaya kendisi katıldı', clockTime(record.checkedInAt), record.siteName]
        .filter(Boolean)
        .join(' · '),
    )
  }
  if (record.markedByName && record.markedAt) {
    lines.push(`${record.markedByName} işaretledi · ${dateTime(record.markedAt)}`)
  }
  return lines
}
