import dayjs from 'dayjs'
import type { PostView } from '@/core/api/generated/model'
import { relativeDayTitle } from '@/core/format/dates'

export interface FeedDay {
  key: string
  title: string
  posts: PostView[]
}

/**
 * Sunucu akışı en yeniden eskiye verir; ekranda sohbet yönüne çevrilir: en eski üstte, en yenisi en altta.
 * Şantiye günü kronolojiktir (sabah demir geldi, öğlen beton döküldü) ve şefin alışkanlığı WhatsApp'tır.
 * Ardışık aynı günler tek başlık altında toplanır.
 */
export function groupByDay(posts: PostView[]): FeedDay[] {
  const days: FeedDay[] = []
  for (const post of posts) {
    const key = dayjs(post.createdAt).format('YYYY-MM-DD')
    const last = days[days.length - 1]
    if (last?.key === key) last.posts.push(post)
    else days.push({ key, title: relativeDayTitle(post.createdAt), posts: [post] })
  }
  return days.reverse().map((day) => ({ ...day, posts: day.posts.reverse() }))
}
