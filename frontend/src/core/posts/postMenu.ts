import type { CurrentUserResponse, PostView } from '@/core/api/generated/model'
import { canCorrect, canDelete } from '@/core/posts/postPermissions'

export type PostAction =
  'reply' | 'copy' | 'forward' | 'pin' | 'field' | 'info' | 'correct' | 'delete'

/** Menünün bir satırı; Saha'daki menü kendi işlerini (FieldAction) aynı biçimde verir. */
export interface PostMenuItem<Action extends string = PostAction> {
  action: Action
  label: string
  danger?: boolean
}

/**
 * Mesaja uzun basınca (masaüstünde ⋯) açılan menü, WhatsApp'taki sırayla. Silinen mesajda yalnızca iz kalır,
 * menüsü yoktur. Bilgi ("kim gördü") yalnızca kendi mesajında; Düzelt ve Sil yetkiye göre. "Sahaya ekle"
 * sabitlemenin yanındadır ve onun gibi herkesindir: alışkanlıkla sohbete atılan saha haberi günlüğe girer.
 */
export function postMenu(post: PostView, user: CurrentUserResponse | undefined): PostMenuItem[] {
  if (post.deletion) return []
  if (post.deliveryId) return deliveryMenu(post, user)
  const mine = post.author.id === user?.id
  const items: Array<PostMenuItem | false> = [
    { action: 'reply', label: 'Yanıtla' },
    !!post.body && { action: 'copy', label: 'Kopyala' },
    { action: 'forward', label: 'İlet' },
    { action: 'pin', label: post.pin ? 'Sabitlemeyi kaldır' : 'Sabitle' },
    { action: 'field', label: post.fieldUpdate ? 'Sahadan çıkar' : 'Sahaya ekle' },
    mine && { action: 'info', label: 'Bilgi' },
    canCorrect(post, user) && { action: 'correct', label: 'Düzelt' },
    canDelete(post, user) && { action: 'delete', label: 'Sil', danger: true },
  ]
  return items.filter((item): item is PostMenuItem => item !== false)
}

/**
 * İş teslimi ve şefin cevabı işin kanıtıdır: kopyalanmaz, iletilmez, düzeltilmez, silinmez (backend de reddeder).
 * Yanıtlanır ve sabitlenir; fotoğraflı teslim Saha'ya eklenebilir ("3. kat elektrik bitti" günlüğe girer).
 */
function deliveryMenu(post: PostView, user: CurrentUserResponse | undefined): PostMenuItem[] {
  const items: Array<PostMenuItem | false> = [
    { action: 'reply', label: 'Yanıtla' },
    { action: 'pin', label: post.pin ? 'Sabitlemeyi kaldır' : 'Sabitle' },
    post.media.length > 0 && {
      action: 'field',
      label: post.fieldUpdate ? 'Sahadan çıkar' : 'Sahaya ekle',
    },
    post.author.id === user?.id && { action: 'info', label: 'Bilgi' },
  ]
  return items.filter((item): item is PostMenuItem => item !== false)
}
