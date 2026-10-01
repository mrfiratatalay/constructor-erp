<script setup lang="ts">
import type { ShipmentRow } from '@/core/api/generated/model'
import { dayWithYear } from '@/core/format/dates'
import { shipmentNumber } from '@/core/shipments/quantity'
import { cancelledLabel, linesText, routeText, waitingText } from '@/core/shipments/shipmentLabels'

/**
 * Sevkiyat listesi, geniş ekranda. Üç kolon: tarih, yol, kalemler. Eski ekranın dokuz kolonu, yedi tür çipi ve
 * durum kolonu kalktı — sevkiyatın normal hali rozet almaz, yalnızca iptal ve geciken iade işaretlenir.
 */
defineProps<{ rows: ShipmentRow[]; loading: boolean }>()
defineEmits<{ open: [shipmentId: string] }>()

/** Element Plus satırı gevşek tiple verir; tablo tek tür satır gösterdiği için burada daraltılır. */
const asRow = (row: unknown) => row as ShipmentRow
</script>

<template>
  <el-table v-loading="loading" :data="rows" style="width: 100%" row-key="id" highlight-current-row
    @row-click="(row) => $emit('open', asRow(row).id)">
    <el-table-column label="Tarih" width="150">
      <template #default="{ row }">
        {{ dayWithYear(asRow(row).day) }}
        <div class="table__note">{{ shipmentNumber(asRow(row).number) }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Nereye" min-width="300">
      <template #default="{ row }">
        <span :class="{ 'table__cancelled': cancelledLabel(asRow(row).status) }">{{ routeText(asRow(row)) }}</span>
        <el-tag v-if="cancelledLabel(asRow(row).status)" type="danger" size="small" round disable-transitions>
          {{ cancelledLabel(asRow(row).status) }}
        </el-tag>
        <el-text v-else-if="waitingText(asRow(row))" type="danger" size="small" class="table__note">
          {{ waitingText(asRow(row)) }}
        </el-text>
      </template>
    </el-table-column>
    <el-table-column label="Kalemler" min-width="300">
      <template #default="{ row }">{{ linesText(asRow(row).lines) }}</template>
    </el-table-column>
    <template #empty>
      <el-empty description="Henüz sevkiyat yok." />
    </template>
  </el-table>
</template>

<style scoped>
.table__note {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-extra-small);
}

.table__cancelled {
  color: var(--el-text-color-placeholder);
  text-decoration: line-through;
}
</style>
