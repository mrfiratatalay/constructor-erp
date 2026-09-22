import { ElMessage, ElMessageBox } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { usePostActions } from '@/core/posts/usePostActions'

/** Gönderiyi onayla siler; yerinde "silindi" izi kalır, fotoğraf ve sesler kalıcı olarak gider. */
export function useDeletePrompt() {
  const { deletePost } = usePostActions()

  return async (post: PostView) => {
    try {
      await ElMessageBox.confirm(
        'Yerinde "silindi" izi kalır; fotoğraf ve sesler kalıcı olarak silinir.',
        post.issue ? 'Sorun silinsin mi?' : 'Gönderi silinsin mi?',
        { confirmButtonText: 'Sil', cancelButtonText: 'Vazgeç', type: 'warning', confirmButtonClass: 'el-button--danger' },
      )
      await deletePost(post.id)
      ElMessage.success('Silindi')
    } catch (error) {
      // Vazgeçilirse Element Plus "cancel"/"close" fırlatır; bu bir hata değil.
      if (error !== 'cancel' && error !== 'close') ElMessage.error(errorMessage(error))
    }
  }
}
