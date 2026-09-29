<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import type { AuditEntryView } from '@/core/api/generated/model'
import { AUDIT_ACTIONS, auditTone } from '@/core/admin/adminLabels'
import { useAuditLog } from '@/core/admin/useAuditLog'
import { dateTime } from '@/core/format/dates'

/** Platformun işlem geçmişi: kim, ne yaptı, hangi firmada. Kayıtlar silinmez ve değişmez. */
const { entries, action, search, isPending } = useAuditLog()
const asEntry = (row: unknown) => row as AuditEntryView
</script>

<template>
  <el-scrollbar>
    <el-main class="audit">
      <header><h1>İşlem geçmişi</h1><p>Platformda yapılan kritik işlemlerin değişmez kaydı.</p></header>
      <div class="audit__toolbar">
        <el-select v-model="action" placeholder="Bütün işlemler" clearable class="audit__action">
          <el-option v-for="(label, key) in AUDIT_ACTIONS" :key="key" :value="key" :label="label" />
        </el-select>
        <el-input v-model="search" placeholder="Özet, firma ya da kişi ara" clearable class="audit__search">
          <template #prefix><Search :size="16" /></template>
        </el-input>
      </div>
      <el-card shadow="never" body-class="audit__card">
        <el-table v-loading="isPending" :data="entries" empty-text="Kayıt yok">
          <el-table-column label="Zaman" width="170"><template #default="{ row }">{{ dateTime(asEntry(row).createdAt) }}</template></el-table-column>
          <el-table-column label="İşlem" width="180">
            <template #default="{ row }">
              <el-tag size="small" :type="auditTone(asEntry(row).action)">{{ AUDIT_ACTIONS[asEntry(row).action] ?? asEntry(row).action }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Özet" prop="summary" min-width="280" />
          <el-table-column label="Firma" min-width="180">
            <template #default="{ row }">
              <RouterLink v-if="asEntry(row).companyId" :to="{ name: 'platformTenant', params: { companyId: asEntry(row).companyId } }">
                {{ asEntry(row).companyName }}
              </RouterLink>
            </template>
          </el-table-column>
          <el-table-column label="Yapan" width="180"><template #default="{ row }">{{ asEntry(row).actorName ?? 'Sistem' }}</template></el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-scrollbar>
</template>

<style scoped>
.audit {
  display: grid;
  gap: var(--space-5);
  max-width: 1320px;
  padding: var(--space-8);
}

.audit h1 {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
}

.audit header p {
  margin: var(--space-1) 0 0;
  color: var(--text-muted);
}

.audit__toolbar {
  display: flex;
  gap: var(--space-3);
}

.audit__action {
  width: 220px;
}

.audit__search {
  width: 320px;
}

.audit a {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
  text-decoration: none;
}

:deep(.audit__card) {
  padding: 0;
}
</style>
