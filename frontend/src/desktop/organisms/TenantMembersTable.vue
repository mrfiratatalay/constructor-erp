<script setup lang="ts">
import type { TenantMemberRow } from '@/core/api/generated/model'
import { timeAgo } from '@/core/format/dates'
import { ROLE_LABELS } from '@/core/team/roles'

/** Firmanın kişileri (salt okunur): kişileri firmanın patronu yönetir, platform yalnızca görür. */
const { members = [] } = defineProps<{ members?: TenantMemberRow[] }>()
const asMember = (row: unknown) => row as TenantMemberRow
</script>

<template>
  <el-table :data="members" empty-text="Henüz kişi yok (kurulum bekliyor olabilir)">
    <el-table-column label="Ad" prop="fullName" min-width="180" />
    <el-table-column label="Rol" width="150">
      <template #default="{ row }">{{ ROLE_LABELS[asMember(row).role as keyof typeof ROLE_LABELS] ?? asMember(row).role }}</template>
    </el-table-column>
    <el-table-column label="Telefon" prop="phone" width="150" />
    <el-table-column label="E-posta" prop="email" min-width="200" />
    <el-table-column label="Durum" width="120">
      <template #default="{ row }">
        <el-tag :type="asMember(row).active ? 'success' : 'info'" size="small">{{ asMember(row).active ? 'Firmada' : 'Çıkarıldı' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Son görülme" width="150">
      <template #default="{ row }">{{ asMember(row).lastSeenAt ? timeAgo(asMember(row).lastSeenAt!) : '—' }}</template>
    </el-table-column>
  </el-table>
</template>
