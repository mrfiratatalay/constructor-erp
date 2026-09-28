<script setup lang="ts">
import type { RecentRow } from '@/core/production/productionBoard'
import { shortDay } from '@/core/format/dates'
import { entryAmount, PRODUCTION_STATUS } from '@/core/production/productionFormat'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import TradeIcon from '@/shared/atoms/TradeIcon.vue'

/**
 * İmalat sekmesinin altı: şantiyenin son günlük girişleri, en yenisi üstte (gün içinde hangi işin ilerlediği bir
 * bakışta). Satıra tıklayınca imalatın detayı açılır.
 */
const { rows } = defineProps<{ rows: RecentRow[] }>()
const emit = defineEmits<{ open: [itemId: string] }>()
/** Element Plus satırı tipsiz verir; satırlarımız RecentRow'dur. */
const rowOf = (row: unknown) => row as RecentRow
</script>

<template>
  <el-card shadow="never">
    <template #header><el-text tag="b">Son günlük girişler</el-text></template>
    <el-table :data="rows" size="small" empty-text="Henüz günlük giriş yok" class="recent"
      @row-click="(row: unknown) => emit('open', rowOf(row).item.id)">
      <el-table-column label="Tarih" width="90">
        <template #default="{ row }">{{ shortDay(rowOf(row).entry.day) }}</template>
      </el-table-column>
      <el-table-column label="İmalat" min-width="150">
        <template #default="{ row }">
          <el-space :size="8">
            <TradeIcon :trade="rowOf(row).item.trade" :size="24" />
            {{ rowOf(row).item.name }}
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="Günlük giriş" width="110">
        <template #default="{ row }">
          <el-text tag="b">{{ entryAmount(rowOf(row).entry.quantity, rowOf(row).item.unit) }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="Taşeron" min-width="120">
        <template #default="{ row }">{{ rowOf(row).item.crew?.name ?? '—' }}</template>
      </el-table-column>
      <el-table-column label="Durum" width="130">
        <template #default="{ row }">
          <StatusTag :tone="PRODUCTION_STATUS[rowOf(row).item.status].tone">
            {{ PRODUCTION_STATUS[rowOf(row).item.status].label }}
          </StatusTag>
        </template>
      </el-table-column>
      <el-table-column label="Not" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">{{ rowOf(row).entry.note ?? '' }}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>
.recent :deep(.el-table__row) {
  cursor: pointer;
}
</style>
