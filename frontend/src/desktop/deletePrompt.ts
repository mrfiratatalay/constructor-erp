import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { usePostActions } from '@/core/posts/usePostActions'
import { confirmAction } from '@/desktop/confirmAction'

/** Gönderiyi onayla siler; yerinde "silindi" izi kalır, fotoğraf ve sesler kalıcı olarak gider. */
export function useDeletePrompt() {
  const { deletePost } = usePostActions()

  return async (post: PostView) => {
    const message = 'Yerinde "silindi" izi kalır; fotoğraf ve sesler kalıcı olarak silinir.'
    if (!(await confirmAction({ title: 'Gönderi silinsin mi?', message, confirm: 'Sil' }))) return
    await deletePost(post.id).then(() => ElMessage.success('Silindi'), (error) => ElMessage.error(errorMessage(error)))
  }
}
