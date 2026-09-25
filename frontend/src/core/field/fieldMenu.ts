import type { CurrentUserResponse, PostView } from '@/core/api/generated/model'
import type { PostMenuItem } from '@/core/posts/postMenu'
import { canCorrect, canDelete } from '@/core/posts/postPermissions'

export type FieldAction = 'showInChat' | 'copy' | 'toggleIssue' | 'correct' | 'removeFromField' | 'delete'

/**
 * Saha güncellemesinin ⋯ menüsü (telefonda uzun basınca da açılır). Yanıtla, İlet, Sabitle sohbetin işleridir:
 * güncelleme sohbette de durduğu için "Sohbette göster" oraya götürür. Sorun işaretini yalnızca yazar değiştirir
 * (başkasının ağzından "sorun var" denmez); çözülmüş bir sorunun işareti değişmez. "Sahadan çıkar" herkesindir
 * (yanlışlıkla eklenen mesaj için); mesaj sohbette kalır, silinmez.
 */
export function fieldMenu(post: PostView, user: CurrentUserResponse | undefined): PostMenuItem<FieldAction>[] {
  if (post.deletion) return []
  const author = canCorrect(post, user)
  const items: Array<PostMenuItem<FieldAction> | false> = [
    { action: 'showInChat', label: 'Sohbette göster' },
    !!post.body && { action: 'copy', label: 'Kopyala' },
    author && !post.resolution && {
      action: 'toggleIssue',
      label: post.issue ? 'Sorun işaretini kaldır' : 'Sorun olarak işaretle',
    },
    author && { action: 'correct', label: 'Düzelt' },
    { action: 'removeFromField', label: 'Sahadan çıkar' },
    canDelete(post, user) && { action: 'delete', label: 'Sil', danger: true },
  ]
  return items.filter((item): item is PostMenuItem<FieldAction> => item !== false)
}
