<script setup lang="ts">
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { siteNames } from '@/core/sites/siteNames'
import { lastSeenText, memberStatus } from '@/core/team/memberStatus'
import { ROLE_LABELS } from '@/core/team/roles'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

const { members, sites, loading } = defineProps<{ members: MemberView[]; sites: SiteView[]; loading: boolean }>()
const emit = defineEmits<{ select: [member: MemberView] }>()
</script>

<template>
  <van-skeleton v-if="loading" :row="4" />
  <van-cell-group v-else inset>
    <van-cell v-for="member in members" :key="member.id" is-link center @click="emit('select', member)">
      <template #title>
        <span class="member-list__head">
          <span class="member-list__name">{{ member.fullName }}</span>
          <StatusTag :tone="memberStatus(member).tone">{{ memberStatus(member).label }}</StatusTag>
        </span>
      </template>
      <template #label>
        <span>{{ ROLE_LABELS[member.role] }} · {{ lastSeenText(member) }}</span>
        <span v-if="member.role === 'SITE_LEAD'" class="member-list__sites">{{ siteNames(member.siteIds, sites) }}</span>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
.member-list__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.member-list__name {
  font-weight: var(--weight-bold);
}

.member-list__sites {
  display: block;
  margin-top: 4px;
}
</style>
