import dayjs from 'dayjs'
import type { CurrentUserResponseRole } from '@/core/api/generated/model'

/** Bugünün ekranında bugünle birlikte geriye doğru gösterilen gün sayısı: şef dünü görerek bugünü işaretler. */
export const RECENT_DAYS = 6

/** "2026-09-23"ten "2026-09-28"e her gün, sırayla. */
export function isoDays(from: string, to: string): string[] {
  const days: string[] = []
  for (let day = dayjs(from); !day.isAfter(dayjs(to), 'day'); day = day.add(1, 'day')) {
    days.push(day.format('YYYY-MM-DD'))
  }
  return days
}

/** Bugün ve ondan önceki günler: bugünün ekranının sütunları. */
export function recentDays(today: string, count = RECENT_DAYS): string[] {
  return isoDays(dayjs(today).subtract(count - 1, 'day').format('YYYY-MM-DD'), today)
}

/** Ayın ilk ve son günü: ayın cetvelinin aralığı. */
export function monthRange(month: string): { from: string; to: string } {
  const first = dayjs(`${month}-01`)
  return { from: first.format('YYYY-MM-DD'), to: first.endOf('month').format('YYYY-MM-DD') }
}

/** Sütun başlığı: "Pzt". */
export const weekdayShort = (isoDate: string): string => dayjs(isoDate).format('ddd')

/** Sütun başlığı: "28". */
export const dayOfMonth = (isoDate: string): string => dayjs(isoDate).format('D')

/** Pazar günleri cetvelde ayrışır: çoğu şantiyede tatil. */
export const isSunday = (isoDate: string): boolean => dayjs(isoDate).day() === 0

/**
 * Bu gün işaretlenebilir mi? İleri gün hiç; şef yalnızca bugünü, patron geçmişi de düzeltir. Sunucu aynı kuralı
 * uygular, arayüz yalnızca olmayacak düğmeyi göstermez.
 */
export function canMarkDay(role: CurrentUserResponseRole | undefined, day: string, today: string): boolean {
  if (day > today) return false
  return day === today || role === 'OWNER'
}
