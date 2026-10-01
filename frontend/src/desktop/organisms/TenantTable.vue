<script setup lang="ts">
import type { TenantRow } from '@/core/api/generated/model'
import { daysLeftTone, tenantBadge } from '@/core/admin/tenantStatus'
import { dayWithYear, timeAgo } from '@/core/format/dates'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/** Firmalar tablosu: kimlik, bugünkü durum, paket ve dönem sonu, kullanım, son aktivite, kurulum. */
const { tenants, loading = false } = defineProps<{ tenants: TenantRow[]; loading?: boolean }>()
const emit = defineEmits<{ open: [companyId: string] }>()
/** Element Plus satırı tipsiz verir; tablo yalnızca TenantRow gösterir. */
const asRow = (row: unknown) => row as TenantRow
</script>

<template>
  <!-- Sütunlar 1366 px dizüstünde (sol menüyle) kaydırmadan sığar: toplam ~1000 px, Firma sütunu esner. -->
  <el-table v-loading="loading" :data="tenants" row-class-name="tenant-table__row" empty-text="Bu süzgece uyan firma yok"
    @row-click="(row: unknown) => emit('open', asRow(row).id)">
    <el-table-column label="Firma" min-width="220">
      <template #default="{ row }">
        <div class="tenant-table__company">
          <CompanyLogo :name="row.name" :size="34" />
          <span :title="row.name"><strong>{{ row.name }}</strong><small>{{ row.slug }}{{ row.city ? ` · ${row.city}` : '' }}</small></span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Durum" width="110">
      <template #default="{ row }">
        <el-tag :type="tenantBadge(asRow(row)).tone" effect="light">{{ tenantBadge(asRow(row)).label }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Paket" prop="planName" width="120" />
    <el-table-column label="Dönem sonu" width="160">
      <template #default="{ row }">
        <template v-if="row.endsOn">
          {{ dayWithYear(row.endsOn) }}
          <el-tag v-if="row.daysLeft != null && row.daysLeft >= 0" size="small" :type="daysLeftTone(row.daysLeft)" round>
            {{ row.daysLeft }} g
          </el-tag>
        </template>
        <span v-else class="tenant-table__muted">—</span>
      </template>
    </el-table-column>
    <el-table-column label="Kişi" prop="userCount" width="64" align="right" />
    <el-table-column label="Şantiye" prop="siteCount" width="80" align="right" />
    <el-table-column label="Son aktivite" width="130">
      <template #default="{ row }">
        <span :class="{ 'tenant-table__muted': !row.lastActivityAt }">{{ row.lastActivityAt ? timeAgo(row.lastActivityAt) : 'Hiç' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Kurulum" width="120">
      <template #default="{ row }">
        <el-tag v-if="row.setupCompleted" type="success" effect="plain" size="small">Tamamlandı</el-tag>
        <el-tag v-else type="primary" size="small">Bekliyor</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.tenant-table__company {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

/* Uzun firma adı dört satıra, kısa adı (slug) yarım kırılıyordu: ad en çok iki satır, kısa ad tek satır. */
.tenant-table__company span {
  display: grid;
  min-width: 0;
}

.tenant-table__company strong {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.tenant-table__company small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tenant-table__company small,
.tenant-table__muted {
  color: var(--text-muted);
}

:deep(.tenant-table__row) {
  cursor: pointer;
}
</style>
