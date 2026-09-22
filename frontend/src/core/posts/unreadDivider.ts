import dayjs from 'dayjs'
import type { PostView } from '@/core/api/generated/model'

const isUnread = (post: PostView, seenAt: string, viewerId?: string) =>
  !post.deletion && post.author.id !== viewerId && dayjs(post.createdAt).isAfter(seenAt)

/**
 * "Buradan yukarısı yeni" çizgisinin altına geleceği gönderi: önceki bakıştan sonra başkalarının
 * gönderdiği en eskisi. İlk ziyarette (önceki bakış yok) çizgi çizilmez, her şey zaten yeni.
 * Silinen gönderi yeni sayılmaz (sunucudaki okunmadı sayısıyla aynı kural).
 */
export function lastUnreadPostId(posts: PostView[], seenAt: string | null, viewerId?: string): string | null {
  if (!seenAt) return null
  return posts.filter((post) => isUnread(post, seenAt, viewerId)).at(-1)?.id ?? null
}
