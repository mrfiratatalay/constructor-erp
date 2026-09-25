<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { postMenu, type PostAction } from '@/core/posts/postMenu'
import ForwardSheet from '@/mobile/organisms/ForwardSheet.vue'
import PostCorrectSheet from '@/mobile/organisms/PostCorrectSheet.vue'
import PostInfoSheet from '@/mobile/organisms/PostInfoSheet.vue'
import { sheetItems, useSheetActions } from '@/mobile/postActions'

/**
 * Mesaja uzun basınca alttan açılan menü, WhatsApp'taki sırayla: Yanıtla, Kopyala, İlet, Sabitle, Sahaya ekle,
 * Bilgi, Düzelt, Sil. Hangisinin görüneceğine core/posts/postMenu karar verir; burada yalnızca seçilen iş yapılır.
 */
const post = defineModel<PostView | null>({ required: true })
const emit = defineEmits<{ reply: [post: PostView] }>()
const { data: user } = useCurrentUser()
const { actions, attempt, copy, toggleField, confirmDelete } = useSheetActions()
const correcting = ref<PostView | null>(null)
const forwarding = ref<PostView | null>(null)
const inspecting = ref<PostView | null>(null)

const items = computed(() => sheetItems(post.value ? postMenu(post.value, user.value) : []))

const HANDLERS: Record<PostAction, (target: PostView) => unknown> = {
  reply: (target) => emit('reply', target),
  copy,
  forward: (target) => (forwarding.value = target),
  pin: (target) => attempt(() => actions.togglePin(target), target.pin ? 'Sabitleme kaldırıldı' : 'Sabitlendi'),
  field: toggleField,
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
