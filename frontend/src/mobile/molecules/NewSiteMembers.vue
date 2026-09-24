<script setup lang="ts">
import type { MemberView } from '@/core/api/generated/model'
import { ROLE_LABELS } from '@/core/team/roles'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Şantiye kurmanın 1. adımı, WhatsApp'ta grup kurarken kişi seçmek gibi: firmadan işaretle. Firmada olmayan
 * yeni kişi burada yazılmaz; şantiye kurulunca içinden WhatsApp'la davet edilir. Kimseyi seçmeden geçmek serbest.
 */
const memberIds = defineModel<string[]>('memberIds', { required: true })
const { people } = defineProps<{ people: MemberView[] }>()

function toggle(memberId: string) {
  memberIds.value = memberIds.value.includes(memberId)
    ? memberIds.value.filter((id) => id !== memberId)
    : [...memberIds.value, memberId]
}
</script>

<template>
  <p class="members__hint">Yeni kişileri şantiyeyi kurduktan sonra WhatsApp'tan davet edersin.</p>
  <van-cell-group v-if="people.length" inset class="members">
    <van-checkbox-group v-model="memberIds">
      <van-cell v-for="member in people" :key="member.id" :title="member.fullName" :label="ROLE_LABELS[member.role]"
        clickable center @click="toggle(member.id)">
        <template #icon><UserAvatar :name="member.fullName" :size="36" class="members__avatar" /></template>
        <template #right-icon><van-checkbox :name="member.id" @click.stop /></template>
      </van-cell>
    </van-checkbox-group>
  </van-cell-group>
</template>

<style scoped>
.members {
  --van-cell-background: var(--surface-muted);
}

.members__hint {
  margin: 0 var(--space-4);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.members__avatar {
  margin-right: var(--space-3);
}
</style>
