import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import type { FieldAction } from '@/core/field/fieldMenu'
import type { PostAction } from '@/core/posts/postMenu'
import { usePostActions } from '@/core/posts/usePostActions'
import { useSiteTab } from '@/core/sites/useSiteTab'
import { useDeletePrompt } from '@/desktop/deletePrompt'

type Actions = ReturnType<typeof usePostActions>

async function attempt(work: () => Promise<unknown>, done: string) {
  await work().then(
    () => ElMessage.success(done),
    (error) => ElMessage.error(errorMessage(error)),
  )
}

async function copy(actions: Actions, post: PostView) {
  if (await actions.copyText(post)) ElMessage.success('Kopyalandı')
  else ElMessage.error('Kopyalanamadı')
}

const toggleField = (actions: Actions, post: PostView) =>
  attempt(() => actions.toggleField(post), post.fieldUpdate ? 'Sahadan çıkarıldı' : 'Sahaya eklendi')

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

  const handlers: Record<PostAction, (post: PostView) => unknown> = {
    reply: onReply,
    copy: (post) => copy(actions, post),
    forward: (post) => (forwarding.value = post),
    pin: (post) => attempt(() => actions.togglePin(post), post.pin ? 'Sabitleme kaldırıldı' : 'Sabitlendi'),
    field: (post) => toggleField(actions, post),
    info: (post) => (inspecting.value = post),
    correct: (post) => (correcting.value = post),
    delete: promptDelete,
  }

  return { correcting, forwarding, inspecting, run: (action: PostAction, post: PostView) => void handlers[action](post) }
}

/** Saha güncellemesinin ⋯ menüsü: "Sohbette göster" Sohbet sekmesine geçip o mesajı sarı yakar. */
export function useFieldMenuActions() {
  const actions = usePostActions()
  const promptDelete = useDeletePrompt()
  const { open } = useSiteTab()
  const correcting = ref<PostView | null>(null)

  const handlers: Record<FieldAction, (post: PostView) => unknown> = {
    showInChat: (post) => open('chat', post.id),
    copy: (post) => copy(actions, post),
    toggleIssue: (post) =>
      attempt(() => actions.toggleIssue(post), post.issue ? 'Sorun işareti kaldırıldı' : 'Sorun olarak işaretlendi'),
    correct: (post) => (correcting.value = post),
    removeFromField: (post) => toggleField(actions, post),
    delete: promptDelete,
  }

  return { correcting, run: (action: FieldAction, post: PostView) => void handlers[action](post) }
}
