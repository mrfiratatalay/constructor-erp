<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ShipmentRow } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { clockTime, dayWithYear } from '@/core/format/dates'
import { shipmentNumber, withUnit } from '@/core/shipments/quantity'
import { movementTypeLabel } from '@/core/shipments/movementPresentation'
import { useMaterialPermissions } from '@/core/shipments/useMaterialPermissions'
import { useShipmentActions } from '@/core/shipments/useShipmentActions'
import ShipmentStatusTag from '@/desktop/atoms/ShipmentStatusTag.vue'
import ShipmentRoute from '@/desktop/molecules/ShipmentRoute.vue'
import ShipmentActionMenu from '@/desktop/molecules/ShipmentActionMenu.vue'

defineProps<{ rows: ShipmentRow[]; loading: boolean }>()
const emit = defineEmits<{ open: [shipmentId: string] }>()
const { canCreate, canCancel } = useMaterialPermissions()
const { cancel, receive, isBusy } = useShipmentActions()
const asRow = (row: unknown) => row as ShipmentRow

async function onReceive(row: ShipmentRow) {
  try {
    await receive(row.id)
    ElMessage.success('Malzeme geri dönüşü kaydedildi')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

async function onCancel(row: ShipmentRow) {
  const asked = await ElMessageBox.prompt('İptal nedenini yazın. Kayıt ve nedeni hareket geçmişinde korunur.',
    'Hareketi iptal et', {
      confirmButtonText: 'Hareketi iptal et', cancelButtonText: 'Vazgeç',
      inputPlaceholder: 'İptal nedeni',
      inputValidator: (value) => (value?.trim() ? true : 'İptal nedeni gerekli.'),
    }).catch(() => null)
  if (!asked) return
  try {
    await cancel(row.id, asked.value.trim())
    ElMessage.success('Hareket iptal edildi')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-table v-loading="loading" :data="rows" class="movement-table" row-key="id"
    @row-click="(row) => emit('open', asRow(row).id)">
    <el-table-column label="Tarih / No" width="166">
      <template #default="{ row }">
        <div class="movement-table__date">{{ dayWithYear(asRow(row).day) }}</div>
        <div class="movement-table__meta">
          <span>{{ clockTime(asRow(row).createdAt) }}</span>
          <span>{{ shipmentNumber(asRow(row).number) }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Hareket" min-width="320">
      <template #default="{ row }">
        <button class="movement-table__route" :aria-label="`${shipmentNumber(asRow(row).number)} ayrıntısını aç`"
          @click.stop="emit('open', asRow(row).id)">
          <ShipmentRoute :row="asRow(row)" />
        </button>
        <div class="movement-table__type">{{ movementTypeLabel(asRow(row).type) }}</div>
      </template>
    </el-table-column>
    <el-table-column label="Malzemeler" min-width="195">
      <template #default="{ row }">
        <template v-if="asRow(row).lines[0]">
          <div class="movement-table__material">{{ asRow(row).lines[0]?.materialName }}</div>
          <div class="movement-table__meta">
            <span>{{ withUnit(asRow(row).lines[0]!.quantity, asRow(row).lines[0]!.unit) }}</span>
            <el-tooltip v-if="asRow(row).lines.length > 1" placement="top">
              <template #content>
                <div v-for="line in asRow(row).lines.slice(1)" :key="line.materialId">
                  {{ line.materialName }} · {{ withUnit(line.quantity, line.unit) }}
                </div>
              </template>
              <span class="movement-table__remaining" tabindex="0">+{{ asRow(row).lines.length - 1 }} kalem</span>
            </el-tooltip>
          </div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="Durum" width="154">
      <template #default="{ row }"><ShipmentStatusTag :row="asRow(row)" /></template>
    </el-table-column>
    <el-table-column label="Oluşturan" width="160" show-overflow-tooltip>
      <template #default="{ row }"><span class="movement-table__creator">{{ asRow(row).createdByName }}</span></template>
    </el-table-column>
    <el-table-column width="58" align="center">
      <template #default="{ row }">
        <div class="movement-table__actions" @click.stop>
          <ShipmentActionMenu :label="`${shipmentNumber(asRow(row).number)} işlemleri`" :busy="isBusy"
            :can-receive="canCreate && asRow(row).awaitingReturn"
            :can-cancel="canCancel && asRow(row).status !== 'CANCELLED'"
            @open="emit('open', asRow(row).id)" @receive="onReceive(asRow(row))" @cancel="onCancel(asRow(row))" />
        </div>
      </template>
    </el-table-column>
    <template #empty><el-empty description="Bu filtrelerle eşleşen malzeme hareketi bulunamadı." :image-size="90" /></template>
  </el-table>
</template>

<style scoped src="./shipmentTable.css"></style>
