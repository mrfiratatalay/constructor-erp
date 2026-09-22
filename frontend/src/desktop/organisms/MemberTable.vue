<script setup lang="ts">
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { siteNames } from '@/core/sites/siteNames'
import { lastSeenText, memberStatus } from '@/core/team/memberStatus'
import { ROLE_LABELS } from '@/core/team/roles'
import StatusTag from '@/desktop/atoms/StatusTag.vue'

const { members, sites, loading } = defineProps<{ members: MemberView[]; sites: SiteView[]; loading: boolean }>()
const emit = defineEmits<{
  edit: [member: MemberView]
  newLink: [member: MemberView]
  toggleActive: [member: MemberView]
}>()

// Element Plus tablo satırını genel bir tiple verir (sütun slot'u generic değil);
// satırın bizim MemberView tipimiz olduğunu tek yerde söylüyoruz.
const asMember = (row: unknown) => row as MemberView
</script>

<template>
  <el-skeleton v-if="loading" :rows="4" animated />
  <el-table v-else :data="members" empty-text="Henüz kimse yok">
    <el-table-column prop="fullName" label="Ad soyad" min-width="170" />
    <el-table-column label="Rol" width="160">
      <template #default="{ row }">{{ ROLE_LABELS[asMember(row).role] }}</template>
    </el-table-column>
    <el-table-column label="Şantiyeler" min-width="200">
      <template #default="{ row }">
        {{ asMember(row).role === 'OWNER' ? 'Hepsi' : siteNames(asMember(row).siteIds, sites) }}
      </template>
    </el-table-column>
    <el-table-column label="Durum" min-width="210">
      <template #default="{ row }">
        <StatusTag :tone="memberStatus(asMember(row)).tone">{{ memberStatus(asMember(row)).label }}</StatusTag>
        <span class="member-table__seen">{{ lastSeenText(asMember(row)) }}</span>
      </template>
    </el-table-column>
    <el-table-column width="300" align="right">
      <template #default="{ row }">
        <el-button size="small" @click="emit('edit', asMember(row))">Düzenle</el-button>
        <el-button v-if="asMember(row).active" size="small" @click="emit('newLink', asMember(row))">Giriş linki</el-button>
        <!-- Patron hesapları buradan pasif yapılamaz: yanlışlıkla kendini kilitlemesin. -->
        <el-button v-if="asMember(row).role !== 'OWNER'" size="small" @click="emit('toggleActive', asMember(row))">
          {{ asMember(row).active ? 'Pasif yap' : 'Aktif yap' }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.member-table__seen {
  margin-left: var(--space-2);
  color: var(--text-subtle);
  font-size: var(--text-sm);
}
</style>
