<script setup lang="ts">
import { ref } from 'vue'
import type { StockRow } from '@/core/api/generated/model'
import { dayWithYear } from '@/core/format/dates'
import { withUnit } from '@/core/materials/quantity'
import StockStatusTag from '@/desktop/atoms/StockStatusTag.vue'
import MaterialCell from '@/desktop/molecules/MaterialCell.vue'
import StockBreakdown from '@/desktop/molecules/StockBreakdown.vue'

/**
 * Stok tablosu: malzeme, kategori, birim, toplam kullanılabilir, kaç lokasyonda, durum, son hareket. Satır açılınca
 * lokasyon kırılımı çıkar; ada tıklayınca malzeme kartı açılır. Pasif malzeme yalnızca stoğu kaldıysa görünür.
 */
const { rows, canAdjust } = defineProps<{ rows: StockRow[]; canAdjust: boolean }>()
const emit = defineEmits<{ open: [materialId: string]; adjust: [materialId: string, locationId: string] }>()
const expanded = ref<string[]>([])
const rowOf = (row: unknown) => row as StockRow

function placesText(row: StockRow): string {
  if (row.locations.length === 0) return '—'
  return row.locations.length === 1 ? row.locations[0]!.name : `${row.locations.length} lokasyon`
}

function toggle(row: unknown) {
  const id = rowOf(row).materialId
  expanded.value = expanded.value.includes(id) ? expanded.value.filter((item) => item !== id) : [...expanded.value, id]
}
</script>

<template>
  <el-table :data="rows" row-key="materialId" size="large" :expand-row-keys="expanded" class="stock-table"
    @row-click="toggle" @expand-change="(row: unknown) => toggle(row)">
    <el-table-column type="expand" width="44">
      <template #default="{ row }">
        <StockBreakdown :row="rowOf(row)" :can-adjust="canAdjust"
          @adjust="(locationId) => emit('adjust', rowOf(row).materialId, locationId)" />
      </template>
    </el-table-column>
    <el-table-column label="Malzeme" min-width="200">
      <template #default="{ row }">
        <el-space :size="8">
          <el-link underline="never" @click.stop="emit('open', row.materialId)">
            <MaterialCell :name="row.name" :code="row.code" />
          </el-link>
          <el-tag v-if="!row.active" type="info" size="small" round>Pasif</el-tag>
        </el-space>
      </template>
    </el-table-column>
    <el-table-column prop="category" label="Kategori" min-width="120" />
    <el-table-column prop="unit" label="Birim" width="90" />
    <el-table-column label="Toplam Kullanılabilir" min-width="160" align="right">
      <template #default="{ row }"><el-text tag="b" size="large">{{ withUnit(row.available, row.unit) }}</el-text></template>
    </el-table-column>
    <el-table-column label="Lokasyon" min-width="150">
      <template #default="{ row }">{{ placesText(rowOf(row)) }}</template>
    </el-table-column>
    <el-table-column label="Durum" width="120">
      <template #default="{ row }"><StockStatusTag :status="row.status" /></template>
    </el-table-column>
    <el-table-column label="Son Hareket" width="130">
      <template #default="{ row }">{{ row.lastMovementDay ? dayWithYear(row.lastMovementDay) : '—' }}</template>
    </el-table-column>
    <template #empty><slot name="empty" /></template>
  </el-table>
</template>

<style scoped>
.stock-table :deep(.el-table__row) {
  cursor: pointer;
}
</style>
