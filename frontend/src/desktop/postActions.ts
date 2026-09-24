import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import type { PostAction } from '@/core/posts/postMenu'
import { usePostActions } from '@/core/posts/usePostActions'
import { useDeletePrompt } from '@/desktop/deletePrompt'

/**
 * Mesajın ⋯ menüsünden seçilen işi yapar. Pencereler (düzelt, ilet, bilgi) akışta birer tane durur; burada
 * yalnızca hangisinin hangi mesaj için açılacağı tutulur. Yanıtla gönderme çubuğuna gider (onReply).
 */
export function usePostMenuActions(onReply: (post: PostView) => void) {
  const actions = usePostActions()
  const promptDelete = useDeletePrompt()
  const correcting = ref<PostView | null>(null)
  const forwarding = ref<PostView | null>(null)
  const inspecting = ref<PostView | null>(null)

  async function togglePin(post: PostView) {
    await actions.togglePin(post).then(
      () => ElMessage.success(post.pin ? 'Sabitleme kaldırıldı' : 'Sabitlendi'),
      (error) => ElMessage.error(errorMessage(error)),
    )
  }

  async function copy(post: PostView) {
    if (await actions.copyText(post)) ElMessage.success('Kopyalandı')
    else ElMessage.error('Kopyalanamadı')
  }

  const handlers: Record<PostAction, (post: PostView) => unknown> = {
    reply: onReply,
    copy,
    forward: (post) => (forwarding.value = post),
    pin: togglePin,
    info: (post) => (inspecting.value = post),
    correct: (post) => (correcting.value = post),
    delete: promptDelete,
  }

  return { correcting, forwarding, inspecting, run: (action: PostAction, post: PostView) => void handlers[action](post) }
}
