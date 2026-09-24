import type { CurrentUserResponse, PostView } from '@/core/api/generated/model'
import { canCorrect, canDelete } from '@/core/posts/postPermissions'

export type PostAction = 'reply' | 'copy' | 'forward' | 'pin' | 'info' | 'correct' | 'delete'

export interface PostMenuItem {
  action: PostAction
  label: string
  danger?: boolean
}

/**
 * Mesaja uzun basınca (masaüstünde ⋯) açılan menü, WhatsApp'taki sırayla. Silinen mesajda yalnızca iz kalır,
 * menüsü yoktur. Bilgi ("kim gördü") yalnızca kendi mesajında; Düzelt ve Sil yetkiye göre.
 */
export function postMenu(post: PostView, user: CurrentUserResponse | undefined): PostMenuItem[] {
  if (post.deletion) return []
  const mine = post.author.id === user?.id
  const items: Array<PostMenuItem | false> = [
    { action: 'reply', label: 'Yanıtla' },
    !!post.body && { action: 'copy', label: 'Kopyala' },
    { action: 'forward', label: 'İlet' },
    { action: 'pin', label: post.pin ? 'Sabitlemeyi kaldır' : 'Sabitle' },
    mine && { action: 'info', label: 'Bilgi' },
    canCorrect(post, user) && { action: 'correct', label: 'Düzelt' },
    canDelete(post, user) && { action: 'delete', label: 'Sil', danger: true },
  ]
  return items.filter((item): item is PostMenuItem => item !== false)
}
