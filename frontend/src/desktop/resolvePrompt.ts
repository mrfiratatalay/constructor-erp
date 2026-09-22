import { ElMessage, ElMessageBox } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { useResolveIssue } from '@/core/issues/useIssues'

/**
 * Açık sorunu kapatır; not isteğe bağlı. Akış ve Sorunlar sayfası aynı pencereyi kullanır.
 * Çözüldüyse true döner: Sorunlar ekranı kuyruğun sıradaki sorununa geçer.
 */
export function useResolvePrompt() {
  const { resolve } = useResolveIssue()

  return async (post: PostView): Promise<boolean> => {
    try {
      const { value } = await ElMessageBox.prompt('Nasıl çözüldü? (isteğe bağlı)', 'Sorun çözüldü mü?', {
        confirmButtonText: 'Çözüldü olarak işaretle',
        cancelButtonText: 'Vazgeç',
        inputPlaceholder: 'Örn. demir geldi, döküm yarın',
        inputType: 'textarea',
      })
      await resolve(post.id, value?.trim() || null)
      ElMessage.success('Sorun çözüldü')
      return true
    } catch (error) {
      // Vazgeçilirse Element Plus "cancel"/"close" fırlatır; bu bir hata değil.
      if (error !== 'cancel' && error !== 'close') ElMessage.error(errorMessage(error))
      return false
    }
  }
}
