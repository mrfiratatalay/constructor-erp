import dayjs from 'dayjs'
import type { PostView } from '@/core/api/generated/model'
import { relativeDayTitle } from '@/core/format/dates'
import type { QueuedPost } from '@/core/posts/uploadStorage'

export interface FieldDay {
  key: string
  /** "Bugün", "Dün", "23 Eylül Salı". */
  title: string
  /** Bu telefondan henüz gitmemiş güncellemeler (🕓); yalnızca bugünün başında olur. */
  pending: QueuedPost[]
  entries: PostView[]
  /** Silinenler (iz olarak duranlar) sayılmaz: silinmiş bir güncelleme haber değildir. */
  count: number
  /** Günün bütün güncellemeleri yüklendi mi; yarım günün sayısı yazılmaz, yanlış sayı gösterilmez. */
  complete: boolean
}

const dayKey = (isoDate: string) => dayjs(isoDate).format('YYYY-MM-DD')

const newDay = (isoDate: string): FieldDay => ({
  key: dayKey(isoDate),
  title: relativeDayTitle(isoDate),
  pending: [],
  entries: [],
  count: 0,
  complete: true,
})

/** Gitmemiş güncellemeler bugüne aittir: bugün henüz başka güncelleme yoksa "Bugün" onlarla açılır. */
function withPending(days: FieldDay[], pending: QueuedPost[]): FieldDay[] {
  if (!pending.length) return days
  const now = new Date().toISOString()
  const today = days[0]?.key === dayKey(now) ? days[0] : newDay(now)
  today.pending = pending
  return today === days[0] ? days : [today, ...days]
}

/**
 * Saha akışı günlere ayrılır; günlük gibi en yeni gün ve en yeni güncelleme üstte (sohbetin tersine: burada
 * okunan, şantiyenin bugünkü hali). Sunucu en yeniden eskiye verir. Arkasında daha eskiler varsa son gün
 * yarımdır.
 */
export function fieldDays(entries: PostView[], pending: QueuedPost[], hasMore: boolean): FieldDay[] {
  const days: FieldDay[] = []
  for (const entry of entries) {
    let day = days.at(-1)
    if (day?.key !== dayKey(entry.createdAt)) {
      day = newDay(entry.createdAt)
      days.push(day)
    }
    day.entries.push(entry)
    if (!entry.deletion) day.count++
  }
  const oldest = days.at(-1)
  if (oldest && hasMore) oldest.complete = false
  return withPending(days, pending)
}

/** Önceki günlere geçerken çizginin yazısı: "23 Eylül Salı · 6 güncelleme"; yarım günde yalnızca tarih. */
export function dayDividerText(day: FieldDay): string {
  return day.complete && day.count ? `${day.title} · ${day.count} güncelleme` : day.title
}
