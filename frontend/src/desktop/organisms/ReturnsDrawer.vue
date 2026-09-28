<script setup lang="ts">
import type { ReturnRow } from '@/core/api/generated/model'
import { dayWithYear } from '@/core/format/dates'
import { movementNumber, withUnit } from '@/core/materials/quantity'
import { dueText, overdueDays, useAwaitingReturns } from '@/core/materials/useAwaitingReturns'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import MovementStatusTag from '@/desktop/atoms/MovementStatusTag.vue'
import MaterialCell from '@/desktop/molecules/MaterialCell.vue'

/**
 * Beklenen iadeler: ödünç verilip tamamı dönmemiş çıkışlar, beklenen tarihi en yakın olan önde; tarihi geçen kırmızı
 * yazar. İade buradan alınır ("İade Al"): malzeme, firma ve kalan miktar çıkıştan gelir.
 */
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ openMovement: [movementId: string]; takeReturn: [loanId: string] }>()
const { rows, overdue, isPending } = useAwaitingReturns()
const { can } = useMaterialPermissions()
const rowOf = (row: unknown) => row as ReturnRow
</script>

<template>
  <el-drawer v-model="open" size="72%">
    <template #header>
      <el-space direction="vertical" alignment="flex-start" :size="4">
        <el-text tag="b" size="large">Beklenen İadeler</el-text>
        <el-text :type="overdue ? 'danger' : 'info'">
          {{ rows.length }} ödünç kaydı{{ overdue ? ` · ${overdue} tanesinin tarihi geçti` : '' }}
        </el-text>
      </el-space>
    </template>
    <el-skeleton v-if="isPending" :rows="6" animated />
    <el-table v-else :data="rows" size="large" empty-text="İadesi beklenen ödünç malzeme yok"
      @row-click="(row: unknown) => emit('openMovement', rowOf(row).movementId)">
      <el-table-column label="Firma" min-width="150">
        <template #default="{ row }">
          <el-space direction="vertical" alignment="flex-start" :size="0">
            <el-text tag="b">{{ row.partyName ?? '—' }}</el-text>
            <el-text type="info" size="small">{{ movementNumber(row.number) }} · {{ dayWithYear(row.day) }}</el-text>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="Malzeme" min-width="150">
        <template #default="{ row }"><MaterialCell :name="row.materialName" /></template>
      </el-table-column>
      <el-table-column label="Verilen" width="110" align="right">
        <template #default="{ row }">{{ withUnit(row.quantity, row.unit) }}</template>
      </el-table-column>
      <el-table-column label="İade edilen" width="120" align="right">
        <template #default="{ row }">{{ withUnit(row.returned, row.unit) }}</template>
      </el-table-column>
      <el-table-column label="Kalan" width="110" align="right">
        <template #default="{ row }"><el-text tag="b" type="warning">{{ withUnit(row.remaining, row.unit) }}</el-text></template>
      </el-table-column>
      <el-table-column label="Beklenen tarih" width="150">
        <template #default="{ row }">
          <el-space direction="vertical" alignment="flex-start" :size="0">
            <span>{{ row.expectedReturnDate ? dayWithYear(row.expectedReturnDate) : '—' }}</span>
            <el-text :type="overdueDays(rowOf(row)) > 0 ? 'danger' : 'info'" size="small">{{ dueText(rowOf(row)) }}</el-text>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="Durum" width="160">
        <template #default="{ row }"><MovementStatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column v-if="can('CREATE_MATERIAL_MOVEMENT')" width="104" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click.stop="emit('takeReturn', row.movementId)">İade Al</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>
