<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { fieldMenu, type FieldAction } from '@/core/field/fieldMenu'
import { useSiteTab } from '@/core/sites/useSiteTab'
import PostCorrectSheet from '@/mobile/organisms/PostCorrectSheet.vue'
import { sheetItems, useSheetActions } from '@/mobile/postActions'

/**
 * Saha güncellemesinin ⋯ menüsü, alttan: Sohbette göster, Kopyala, Sorun işareti, Düzelt, Sahadan çıkar, Sil.
 * Hangisinin görüneceğine core/field/fieldMenu karar verir. "Sohbette göster" Sohbet sekmesine geçip o mesajı
 * sarı yakar.
 */
const post = defineModel<PostView | null>({ required: true })
const { data: user } = useCurrentUser()
const { actions, attempt, copy, toggleField, confirmDelete } = useSheetActions()
const { open: openTab } = useSiteTab()
const correcting = ref<PostView | null>(null)

const items = computed(() => sheetItems(post.value ? fieldMenu(post.value, user.value) : []))

const HANDLERS: Record<FieldAction, (target: PostView) => unknown> = {
  showInChat: (target) => openTab('chat', target.id),
  copy,
  toggleIssue: (target) =>
    attempt(() => actions.toggleIssue(target), target.issue ? 'Sorun işareti kaldırıldı' : 'Sorun olarak işaretlendi'),
  correct: (target) => (correcting.value = target),
  removeFromField: toggleField,
  delete: confirmDelete,
}

function onSelect(action: { key: FieldAction }) {
  const target = post.value
  post.value = null
  if (target) void HANDLERS[action.key](target)
}
</script>

<template>
  <van-action-sheet :show="post !== null" :actions="items" cancel-text="Vazgeç" teleport="body"
    @select="onSelect" @update:show="(open: boolean) => !open && (post = null)" />
  <PostCorrectSheet v-model="correcting" />
</template>
