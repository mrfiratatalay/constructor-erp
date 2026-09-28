<script setup lang="ts">
import { Paperclip } from 'lucide-vue-next'
import type { MovementRow } from '@/core/api/generated/model'
import { dayWithYear } from '@/core/format/dates'
import { movementFrom, movementTo } from '@/core/materials/movementEnds'
import type { MovementSortKey } from '@/core/materials/movementQuery'
import { withUnit } from '@/core/materials/quantity'
import MovementStatusTag from '@/desktop/atoms/MovementStatusTag.vue'
import MaterialCell from '@/desktop/molecules/MaterialCell.vue'
import MovementRowMenu from '@/desktop/molecules/MovementRowMenu.vue'
import MovementTypeBadge from '@/shared/atoms/MovementTypeBadge.vue'

type Command = 'open' | 'deliver' | 'takeReturn' | 'cancel'

/**
 * Hareket tablosu: tarih, malzeme, hareket türü (renkli rozet), nereden, nereye, miktar, durum (etiket), açıklama.
 * Satıra tıklayınca ayrıntı açılır; ⋯ satırın işleridir. Sıralama sunucuda yapılır (sayfalı liste). İptal edilmiş
 * satır soluk durur: silinmemiştir, izi kalır.
 */
const { rows, sort, ascending, loading } = defineProps<{
  rows: MovementRow[]
  sort: MovementSortKey
  ascending: boolean
  loading: boolean
}>()
const emit = defineEmits<{ command: [command: Command, row: MovementRow]; sort: [sort: MovementSortKey, ascending: boolean] }>()
const SORT_PROPS: Record<string, MovementSortKey> = { day: 'DAY', materialName: 'MATERIAL', quantity: 'QUANTITY' }
const PROP_OF: Record<MovementSortKey, string> = { DAY: 'day', MATERIAL: 'materialName', QUANTITY: 'quantity' }

function onSort({ prop, order }: { prop: string | null; order: string | null }) {
  if (!order || !prop) return emit('sort', 'DAY', false)
  emit('sort', SORT_PROPS[prop] ?? 'DAY', order === 'ascending')
}

/** Element Plus satırı genel tipte verir; tablonun verisi hareket satırıdır. */
const rowOf = (row: unknown) => row as MovementRow
const rowClass = ({ row }: { row: unknown }) => (rowOf(row).status === 'CANCELLED' ? 'movement-row--cancelled' : '')
</script>

<template>
  <el-table v-loading="loading" :data="rows" row-key="id" size="large" class="movement-table"
    :default-sort="{ prop: PROP_OF[sort], order: ascending ? 'ascending' : 'descending' }"
    :row-class-name="rowClass" @sort-change="onSort" @row-click="(row: unknown) => emit('command', 'open', rowOf(row))">
    <el-table-column prop="day" label="Tarih" width="124" sortable="custom" :sort-orders="['descending', 'ascending']">
      <template #default="{ row }">{{ dayWithYear(row.day) }}</template>
    </el-table-column>
    <el-table-column prop="materialName" label="Malzeme" min-width="150" sortable="custom">
      <template #default="{ row }"><MaterialCell :name="row.materialName" :code="row.materialCode" /></template>
    </el-table-column>
    <el-table-column label="Hareket" min-width="184">
      <template #default="{ row }"><MovementTypeBadge :type="row.type" /></template>
    </el-table-column>
    <el-table-column label="Nereden" min-width="124" show-overflow-tooltip>
      <template #default="{ row }">{{ movementFrom(rowOf(row)) }}</template>
    </el-table-column>
    <el-table-column label="Nereye" min-width="124" show-overflow-tooltip>
      <template #default="{ row }">{{ movementTo(rowOf(row)) }}</template>
    </el-table-column>
    <el-table-column prop="quantity" label="Miktar" width="108" align="right" sortable="custom">
      <template #default="{ row }"><el-text tag="b">{{ withUnit(row.quantity, row.unit) }}</el-text></template>
    </el-table-column>
    <el-table-column label="Durum" min-width="150">
      <template #default="{ row }"><MovementStatusTag :status="row.status" /></template>
    </el-table-column>
    <el-table-column label="Açıklama" min-width="140" show-overflow-tooltip>
      <template #default="{ row }">
        <el-space :size="6">
          <el-text v-if="row.documentCount" type="info"><Paperclip :size="14" aria-label="Belgesi var" /></el-text>
          <el-text type="info">{{ row.description ?? row.usageArea ?? '—' }}</el-text>
        </el-space>
      </template>
    </el-table-column>
    <el-table-column width="52" align="center" fixed="right">
      <template #default="{ row }">
        <MovementRowMenu :row="rowOf(row)" @command="(command) => emit('command', command, rowOf(row))" />
      </template>
    </el-table-column>
    <template #empty><slot name="empty" /></template>
  </el-table>
</template>

<style scoped>
.movement-table :deep(.el-table__row) {
  cursor: pointer;
}

/* İptal edilen hareket silinmez: satır soluk durur, tutarı üstü çizili (izi kalır, İlke 6). */
.movement-table :deep(.movement-row--cancelled td) {
  opacity: 0.55;
}

.movement-table :deep(.movement-row--cancelled td:nth-child(6) .el-text) {
  text-decoration: line-through;
}
</style>
