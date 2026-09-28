<script setup lang="ts">
import type { MovementRow } from '@/core/api/generated/model'
import { shortDay } from '@/core/format/dates'
import { movementFrom, movementTo } from '@/core/materials/movementEnds'
import { withUnit } from '@/core/materials/quantity'
import MovementStatusTag from '@/desktop/atoms/MovementStatusTag.vue'
import MovementTypeBadge from '@/shared/atoms/MovementTypeBadge.vue'

/** Malzemenin son hareketleri, sıkı liste: gün, tür, yol, miktar, durum. Satıra tıklayınca hareketin ayrıntısı. */
const { rows } = defineProps<{ rows: MovementRow[] }>()
const emit = defineEmits<{ open: [movementId: string] }>()
</script>

<template>
  <el-table :data="rows" size="small" :show-header="false" empty-text="Henüz hareket yok"
    @row-click="(row: MovementRow) => emit('open', row.id)">
    <el-table-column width="70"><template #default="{ row }">{{ shortDay(row.day) }}</template></el-table-column>
    <el-table-column min-width="170"><template #default="{ row }"><MovementTypeBadge :type="row.type" size="small" /></template></el-table-column>
    <el-table-column min-width="170" show-overflow-tooltip>
      <template #default="{ row }">{{ movementFrom(row as MovementRow) }} → {{ movementTo(row as MovementRow) }}</template>
    </el-table-column>
    <el-table-column width="100" align="right">
      <template #default="{ row }"><b>{{ withUnit(row.quantity, row.unit) }}</b></template>
    </el-table-column>
    <el-table-column width="170"><template #default="{ row }"><MovementStatusTag :status="row.status" /></template></el-table-column>
  </el-table>
</template>
