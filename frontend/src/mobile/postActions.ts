import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import type { PostMenuItem } from '@/core/posts/postMenu'
import { usePostActions } from '@/core/posts/usePostActions'

/** Menü öğeleri, Vant'ın alttan açılan menüsünün beklediği biçimde; silme kırmızı. */
export function sheetItems<Action extends string>(items: PostMenuItem<Action>[]) {
  return items.map((item) => ({
    name: item.label,
    key: item.action,
    color: item.danger ? 'var(--status-danger)' : undefined,
  }))
}

/**
 * Mesaj menülerinin (sohbet ve Saha) telefondaki ortak işleri: sonucu kısa bir bildirimle söyler, silmeden
 * önce onay ister. Hangi işin görüneceğine core karar verir; burada yalnızca yapılır.
 */
export function useSheetActions() {
  const actions = usePostActions()

  async function attempt(work: () => Promise<unknown>, done?: string) {
    try {
      await work()
      if (done) showSuccessToast(done)
    } catch (error) {
      showFailToast(errorMessage(error))
    }
  }

  async function copy(post: PostView) {
    if (await actions.copyText(post)) showSuccessToast('Kopyalandı')
    else showFailToast('Kopyalanamadı')
  }

  const toggleField = (post: PostView) =>
    attempt(() => actions.toggleField(post), post.fieldUpdate ? 'Sahadan çıkarıldı' : 'Sahaya eklendi')

  async function confirmDelete(post: PostView) {
    const confirmed = await showConfirmDialog({
      title: 'Mesaj silinsin mi?',
      message: 'Yerinde "silindi" izi kalır; fotoğraf ve sesler kalıcı olarak silinir.',
      confirmButtonText: 'Sil',
      confirmButtonColor: 'var(--status-danger)',
      cancelButtonText: 'Vazgeç',
    }).then(() => true, () => false)
    if (confirmed) await attempt(() => actions.deletePost(post.id), 'Silindi')
  }

  return { actions, attempt, copy, toggleField, confirmDelete }
}
