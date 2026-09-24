<script setup lang="ts">
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { siteLine } from '@/core/team/memberLines'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Ekip listesi, WhatsApp'taki Kişiler gibi: yuvarlak, ad, altında şantiyeleri. Etiket yok; kişinin durumu
 * kişi bilgisinde yazar. Dokununca kişi bilgisi tam sayfa açılır (telefonun geri hareketi listeye döner).
 */
const { members, sites, loading } = defineProps<{ members: MemberView[]; sites: SiteView[]; loading: boolean }>()
</script>

<template>
  <van-skeleton v-if="loading" avatar :row="2" />
  <van-empty v-else-if="!members.length" description="Henüz kimse yok. ＋ ile ilk kişiyi ekle." />
  <van-cell-group v-else inset class="member-list">
    <van-cell v-for="member in members" :key="member.id" :title="member.fullName"
      :label="siteLine(member, sites) || undefined" center is-link
      :to="{ name: 'teamMember', params: { memberId: member.id } }">
      <template #icon><UserAvatar :name="member.fullName" :size="44" class="member-list__avatar" /></template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
.member-list__avatar {
  margin-right: var(--space-3);
}

.member-list :deep(.van-cell__title) {
  min-width: 0;
  font-weight: var(--weight-bold);
}

.member-list :deep(.van-cell__label) {
  overflow: hidden;
  font-weight: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
