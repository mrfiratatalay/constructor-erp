import dayjs from 'dayjs'
import type { PostView, SiteEventView } from '@/core/api/generated/model'
import { relativeDayTitle } from '@/core/format/dates'

/** Akışın bir öğesi: mesaj ya da sistem satırı ("Patron, Musa'yı ekledi"). */
export type TimelineItem =
  | { kind: 'post'; key: string; at: number; post: PostView }
  | { kind: 'event'; key: string; at: number; event: SiteEventView }

export interface FeedDay {
  key: string
  title: string
  items: TimelineItem[]
}

const postItem = (post: PostView): TimelineItem => ({ kind: 'post', key: post.id, at: Date.parse(post.createdAt), post })
const eventItem = (event: SiteEventView): TimelineItem =>
  ({ kind: 'event', key: event.id, at: Date.parse(event.createdAt), event })

/** Aynı anda olan sistem satırı mesajdan önce gelir: önce "kuruldu", sonra ilk mesaj. */
const byTime = (a: TimelineItem, b: TimelineItem) => a.at - b.at || (a.kind === b.kind ? 0 : a.kind === 'event' ? -1 : 1)

function groupByDay(items: TimelineItem[]): FeedDay[] {
  const days: FeedDay[] = []
  for (const item of items) {
    const key = dayjs(item.at).format('YYYY-MM-DD')
    const last = days.at(-1)
    if (last?.key === key) last.items.push(item)
    else days.push({ key, title: relativeDayTitle(new Date(item.at).toISOString()), items: [item] })
  }
  return days
}

/**
 * Akışın dibinin imzası: en alttaki öğe ve öğe sayısı. Sayfa bununla dibe iner, dipte olanı dipte tutar. Mesajlar
 * ve sistem satırları ayrı isteklerle, herhangi bir sırayla gelir: yalnızca son mesaja bakılırsa sonradan gelen
 * "… katıldı" satırları, yalnızca en alttakine bakılırsa sonradan üste eklenen mesajlar dibi aşağı iter.
 */
export function feedBottomKey(days: FeedDay[]): string | undefined {
  const last = days.at(-1)?.items.at(-1)
  if (!last) return undefined
  const count = days.reduce((sum, day) => sum + day.items.length, 0)
  return `${last.key}:${count}`
}

/**
 * Sohbet yönündeki akış: en eski üstte, en yenisi altta, günlere ayrılmış (WhatsApp gibi). posts sunucudan
 * en yeniden eskiye gelir. Sistem satırı yalnızca yüklenmiş aralıktaysa görünür; geçmişin tamamı yüklendiyse
 * (complete) hepsi: yoksa eski bir satır, henüz yüklenmemiş mesajların önüne düşerdi.
 */
export function buildTimeline(posts: PostView[], events: SiteEventView[], complete: boolean): FeedDay[] {
  const oldest = posts.at(-1)
  const since = complete || !oldest ? -Infinity : Date.parse(oldest.createdAt)
  const items = [...posts.map(postItem), ...events.map(eventItem).filter((item) => item.at >= since)]
  return groupByDay(items.sort(byTime))
}
