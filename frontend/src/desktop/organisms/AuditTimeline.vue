<script setup lang="ts">
import type { AuditEntryView } from '@/core/api/generated/model'
import { AUDIT_ACTIONS, auditTone } from '@/core/admin/adminLabels'
import { dateTime } from '@/core/format/dates'

/** Platform işlemlerinin zaman çizelgesi: ne, kim, hangi firmada. showCompany: bütün firmaların geçmişinde. */
const { entries, showCompany = false } = defineProps<{ entries: AuditEntryView[]; showCompany?: boolean }>()
</script>

<template>
  <el-empty v-if="!entries.length" :image-size="64" description="Henüz işlem yok" />
  <el-timeline v-else class="audit-timeline">
    <el-timeline-item v-for="entry in entries" :key="entry.id" :timestamp="dateTime(entry.createdAt)"
      :type="auditTone(entry.action)" placement="top">
      <div class="audit-timeline__row">
        <el-tag size="small" :type="auditTone(entry.action)" effect="plain">{{ AUDIT_ACTIONS[entry.action] ?? entry.action }}</el-tag>
        <span>{{ entry.summary }}</span>
      </div>
      <small class="audit-timeline__meta">
        <RouterLink v-if="showCompany && entry.companyId" :to="{ name: 'platformTenant', params: { companyId: entry.companyId } }">
          {{ entry.companyName }}
        </RouterLink>
        <template v-if="showCompany && entry.companyId"> · </template>{{ entry.actorName ?? 'Sistem' }}
      </small>
    </el-timeline-item>
  </el-timeline>
</template>

<style scoped>
.audit-timeline {
  padding-left: var(--space-1);
}

.audit-timeline__row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.audit-timeline__meta {
  color: var(--text-muted);
}

.audit-timeline__meta a {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
  text-decoration: none;
}
</style>
