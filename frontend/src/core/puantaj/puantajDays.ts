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

/** Dar sütunun başlığı, iki harf: "Pt", "Cu", "Pz". Üç harfli kısaltmalar ("Cum.", "Pts") eşit genişlikte durmuyordu. */
export const weekdayShort = (isoDate: string): string => dayjs(isoDate).format('dd')

/** Sütun başlığı: "28". */
export const dayOfMonth = (isoDate: string): string => dayjs(isoDate).format('D')

/** Pazar günleri cetvelde ayrışır: çoğu şantiyede tatil. */
export const isSunday = (isoDate: string): boolean => dayjs(isoDate).day() === 0

/** Ay seçicinin listesi: bu ay ve ondan önceki aylar, yeniden eskiye ("2026-09", "2026-08", …). */
export function monthsBack(month: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => dayjs(`${month}-01`).subtract(index, 'month').format('YYYY-MM'))
}

/**
 * Ayın bugüne kadarki iş günleri (Pazar hariç): çalışılan günün oranı buna göre. Geçmiş ayda ayın tamamı, gelecek
 * ayda hiç.
 */
export function workingDaysSoFar(month: string, today: string): number {
  const { from, to } = monthRange(month)
  const last = to < today ? to : today
  if (last < from) return 0
  return isoDays(from, last).filter((day) => !isSunday(day)).length
}

/**
 * Bu gün işaretlenebilir mi? İleri gün hiç; şef yalnızca bugünü, patron geçmişi de düzeltir. Sunucu aynı kuralı
 * uygular, arayüz yalnızca olmayacak düğmeyi göstermez.
 */
export function canMarkDay(role: CurrentUserResponseRole | undefined, day: string, today: string): boolean {
  if (day > today) return false
  return day === today || role === 'OWNER'
}
