import dayjs from 'dayjs'
import type { PostView } from '@/core/api/generated/model'
import { relativeDayTitle } from '@/core/format/dates'

export interface FeedDay {
  key: string
  title: string
  posts: PostView[]
  /** Gün başlığındaki "3 gönderi": silinenlerin izi sayılmaz. */
  count: number
}

/** Akış zaten en yeniden eskiye gelir; ardışık aynı günler tek başlık altında toplanır. */
export function groupByDay(posts: PostView[]): FeedDay[] {
  const days: FeedDay[] = []
  for (const post of posts) {
    const key = dayjs(post.createdAt).format('YYYY-MM-DD')
    const last = days[days.length - 1]
    if (last?.key === key) last.posts.push(post)
    else days.push({ key, title: relativeDayTitle(post.createdAt), posts: [post], count: 0 })
  }
  return days.map((day) => ({ ...day, count: day.posts.filter((post) => !post.deletion).length }))
}
