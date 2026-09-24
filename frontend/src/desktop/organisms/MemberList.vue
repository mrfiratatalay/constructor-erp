<script setup lang="ts">
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { siteLine } from '@/core/team/memberLines'
import ListRow from '@/desktop/molecules/ListRow.vue'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Ekip listesi, WhatsApp'taki Kişiler gibi: yuvarlak, ad, altında şantiyeleri. Etiket yok; kişinin durumu
 * (son görülme, henüz girmedi) kişi bilgisinde yazar. Satır bir adrestir: kişi bilgisi paylaşılabilir.
 */
const { members, sites, selectedId } = defineProps<{
  members: MemberView[]
  sites: SiteView[]
  selectedId: string | null
}>()
</script>

<template>
  <ListRow v-for="member in members" :key="member.id" :selected="member.id === selectedId"
    :to="{ name: 'teamMember', params: { memberId: member.id } }">
    <template #leading><UserAvatar :name="member.fullName" :size="44" /></template>
    <template #title>{{ member.fullName }}</template>
    <template v-if="siteLine(member, sites)" #default>
      <span class="member-list__sites">{{ siteLine(member, sites) }}</span>
    </template>
  </ListRow>
</template>

<style scoped>
.member-list__sites {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
