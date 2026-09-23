import dayjs from 'dayjs'
import type { PostView } from '@/core/api/generated/model'

const isUnread = (post: PostView, seenAt: string, viewerId?: string) =>
  !post.deletion && post.author.id !== viewerId && dayjs(post.createdAt).isAfter(seenAt)

/**
 * "Buradan aşağısı yeni" çizgisinin üstüne geleceği gönderi: önceki bakıştan sonra başkalarının gönderdiği
 * en eskisi. Akış eskiden yeniye dizilir, bu yüzden çizgi o gönderinin önüne çizilir. İlk ziyarette
 * (önceki bakış yok) çizgi çizilmez, her şey zaten yeni. Silinen gönderi yeni sayılmaz.
 */
export function firstUnreadPostId(posts: PostView[], seenAt: string | null, viewerId?: string): string | null {
  if (!seenAt) return null
  return posts.find((post) => isUnread(post, seenAt, viewerId))?.id ?? null
}
