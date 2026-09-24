<script setup lang="ts">
import { computed, ref } from 'vue'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { postMenu, type PostAction } from '@/core/posts/postMenu'
import { usePostActions } from '@/core/posts/usePostActions'
import ForwardSheet from '@/mobile/organisms/ForwardSheet.vue'
import PostCorrectSheet from '@/mobile/organisms/PostCorrectSheet.vue'
import PostInfoSheet from '@/mobile/organisms/PostInfoSheet.vue'

/**
 * Mesaja uzun basınca alttan açılan menü, WhatsApp'taki sırayla: Yanıtla, Kopyala, İlet, Sabitle, Bilgi,
 * Düzelt, Sil. Hangisinin görüneceğine core/posts/postMenu karar verir; burada yalnızca seçilen iş yapılır.
 */
const post = defineModel<PostView | null>({ required: true })
const emit = defineEmits<{ reply: [post: PostView] }>()
const { data: user } = useCurrentUser()
const actions = usePostActions()
const correcting = ref<PostView | null>(null)
const forwarding = ref<PostView | null>(null)
const inspecting = ref<PostView | null>(null)

const items = computed(() =>
  (post.value ? postMenu(post.value, user.value) : []).map((item) => ({
    name: item.label,
    key: item.action,
    color: item.danger ? 'var(--status-danger)' : undefined,
  })),
)

async function attempt(work: () => Promise<unknown>, done?: string) {
  try {
    await work()
    if (done) showSuccessToast(done)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

async function copy(target: PostView) {
  if (await actions.copyText(target)) showSuccessToast('Kopyalandı')
  else showFailToast('Kopyalanamadı')
}

async function confirmDelete(target: PostView) {
  const confirmed = await showConfirmDialog({
    title: 'Mesaj silinsin mi?',
    message: 'Yerinde "silindi" izi kalır; fotoğraf ve sesler kalıcı olarak silinir.',
    confirmButtonText: 'Sil',
    confirmButtonColor: 'var(--status-danger)',
    cancelButtonText: 'Vazgeç',
  }).then(() => true, () => false)
  if (confirmed) await attempt(() => actions.deletePost(target.id), 'Silindi')
}

const HANDLERS: Record<PostAction, (target: PostView) => unknown> = {
  reply: (target) => emit('reply', target),
  copy,
  forward: (target) => (forwarding.value = target),
  pin: (target) => attempt(() => actions.togglePin(target), target.pin ? 'Sabitleme kaldırıldı' : 'Sabitlendi'),
  info: (target) => (inspecting.value = target),
  correct: (target) => (correcting.value = target),
  delete: confirmDelete,
}

function onSelect(action: { key: PostAction }) {
  const target = post.value
  post.value = null
  if (target) void HANDLERS[action.key](target)
}
</script>

<template>
  <van-action-sheet :show="post !== null" :actions="items" cancel-text="Vazgeç" teleport="body"
    @select="onSelect" @update:show="(open: boolean) => !open && (post = null)" />
  <PostCorrectSheet v-model="correcting" />
  <ForwardSheet v-model="forwarding" />
  <PostInfoSheet v-model="inspecting" />
</template>
