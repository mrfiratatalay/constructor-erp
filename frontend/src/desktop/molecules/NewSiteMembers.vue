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
</script>

<template>
  <div class="members">
    <p class="members__hint">Yeni kişileri şantiyeyi kurduktan sonra WhatsApp'tan davet edersin.</p>
    <el-checkbox-group v-model="memberIds" class="members__list">
      <el-checkbox v-for="member in people" :key="member.id" :value="member.id" class="members__row">
        <UserAvatar :name="member.fullName" :size="36" />
        <span class="members__who"><strong>{{ member.fullName }}</strong><small>{{ ROLE_LABELS[member.role] }}</small></span>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<style scoped>
.members {
  display: grid;
  gap: var(--space-3);
  max-height: 52vh;
  overflow-y: auto;
}

.members__hint {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.members__list {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.members__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: auto;
  margin: 0;
}

.members__row :deep(.el-checkbox__label) {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.members__who {
  display: grid;
  flex: 1;
}

.members__who small {
  color: var(--text-muted);
}
</style>
