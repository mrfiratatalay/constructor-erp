<script setup lang="ts">
import { ref } from 'vue'
import type { MemberView } from '@/core/api/generated/model'
import { timeAgo } from '@/core/format/dates'
import { memberFlag } from '@/core/team/memberStatus'
import { ROLE_LABELS } from '@/core/team/roles'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'

/**
 * Ekip listesi: ad, rol ve son görülme. Tek etiket "Linki açmadı": patronun yapacağı bir iş varsa.
 * Uygulamayı kullanan kişi etiketsizdir (iyi haber sessizdir). Pasifler en altta, istenince açılır.
 */
const { active, inactive, selectedId } = defineProps<{
  active: MemberView[]
  inactive: MemberView[]
  selectedId: string | null
}>()
const emit = defineEmits<{ select: [memberId: string] }>()
const showInactive = ref(false)

const detailOf = (member: MemberView) =>
  member.lastSeenAt ? `${ROLE_LABELS[member.role]} · ${timeAgo(member.lastSeenAt)}` : ROLE_LABELS[member.role]
</script>

<template>
  <ListRow v-for="member in active" :key="member.id" :selected="member.id === selectedId"
    @select="emit('select', member.id)">
    <template #title>{{ member.fullName }}</template>
    <template #meta>
      <StatusTag v-if="memberFlag(member)" :tone="memberFlag(member)!.tone">{{ memberFlag(member)!.label }}</StatusTag>
    </template>
    {{ detailOf(member) }}
  </ListRow>
  <template v-if="inactive.length">
    <el-button text class="member-list__more" @click="showInactive = !showInactive">
      Pasif {{ inactive.length }} kişi {{ showInactive ? '⌃' : '›' }}
    </el-button>
    <template v-if="showInactive">
      <ListRow v-for="member in inactive" :key="member.id" :selected="member.id === selectedId"
        @select="emit('select', member.id)">
        <template #title>{{ member.fullName }}</template>
        <template #meta><StatusTag tone="neutral">Pasif</StatusTag></template>
        {{ ROLE_LABELS[member.role] }}
      </ListRow>
    </template>
  </template>
</template>

<style scoped>
.member-list__more {
  width: 100%;
  justify-content: flex-start;
  margin: var(--space-2) 0;
  padding: var(--space-2) var(--space-4);
}
</style>
