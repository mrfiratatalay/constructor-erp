<script setup lang="ts">
import { computed } from 'vue'
import type { MemberView } from '@/core/api/generated/model'

const { member } = defineProps<{ member: MemberView | null }>()
const emit = defineEmits<{
  close: []
  edit: [member: MemberView]
  newLink: [member: MemberView]
  toggleActive: [member: MemberView]
}>()

type ActionKey = 'edit' | 'newLink' | 'toggleActive'

// Patron hesapları buradan pasif yapılamaz: yanlışlıkla kendini kilitlemesin.
const actions = computed(() => {
  if (!member) return []
  const list: { name: string; key: ActionKey }[] = [{ name: 'Düzenle', key: 'edit' }]
  if (member.active) list.push({ name: 'Yeni giriş linki gönder', key: 'newLink' })
  if (member.role !== 'OWNER') list.push({ name: member.active ? 'Pasif yap' : 'Aktif yap', key: 'toggleActive' })
  return list
})

function select(action: { key: ActionKey }) {
  if (!member) return
  if (action.key === 'edit') emit('edit', member)
  else if (action.key === 'newLink') emit('newLink', member)
  else emit('toggleActive', member)
  emit('close')
}
</script>

<template>
  <van-action-sheet :show="member !== null" :title="member?.fullName" :actions="actions"
    cancel-text="Vazgeç" @select="select" @cancel="emit('close')" @click-overlay="emit('close')" />
</template>
