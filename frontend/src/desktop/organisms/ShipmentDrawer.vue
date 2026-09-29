<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { shipmentNumber, withUnit } from '@/core/shipments/quantity'
import { cancelledLabel, HISTORY_LABELS, routeText, TYPE_LABELS, waitingText } from '@/core/shipments/shipmentLabels'
import { useMaterialPermissions } from '@/core/shipments/useMaterialPermissions'
import { useShipmentActions } from '@/core/shipments/useShipmentActions'
import { useShipmentDetail } from '@/core/shipments/useShipmentDetail'

/**
 * Sevkiyatın ayrıntısı: künyesi, kalemleri, irsaliyesi ve değişmez geçmişi. Teslim alma adımı yoktur — sevkiyat
 * çıktığında yazılır ve biter. Dışarıdaki malzeme geri gelince tek düğmeyle kapatılır.
 */
const shipmentId = defineModel<string | null>('shipmentId', { required: true })
const { detail, isLoading } = useShipmentDetail(shipmentId)
const { cancel, receive, isBusy } = useShipmentActions()
const { canCancel, canCreate } = useMaterialPermissions()

const row = computed(() => detail.value?.row ?? null)
const cancelled = computed(() => (row.value ? cancelledLabel(row.value.status) : null))
const waiting = computed(() => (row.value ? waitingText(row.value) : ''))

async function onReceive() {
  if (!shipmentId.value) return
  try {
    await receive(shipmentId.value)
    ElMessage.success('İade alındı')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

/** İptalin nedeni zorunludur ve geçmişte kalır; kayıt silinmez. */
async function onCancel() {
  const asked = await ElMessageBox.prompt('Neden iptal ediliyor? Bu not geçmişte kalır.', 'Sevkiyatı iptal et', {
    confirmButtonText: 'İptal et',
    cancelButtonText: 'Vazgeç',
    inputPlaceholder: 'Örn. yanlış şantiye yazıldı',
    inputValidator: (value) => (value?.trim() ? true : 'Neden yazılmalı.'),
  }).catch(() => null)
  if (!asked || !shipmentId.value) return
  try {
    await cancel(shipmentId.value, asked.value)
    ElMessage.success('İptal edildi')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-drawer :model-value="!!shipmentId" size="440px" :title="row ? TYPE_LABELS[row.type] : 'Sevkiyat'"
    @update:model-value="shipmentId = null">
    <el-skeleton v-if="isLoading || !row || !detail" :rows="6" animated />
    <template v-else>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="Yol">{{ routeText(row) }}</el-descriptions-item>
        <el-descriptions-item label="Numara">{{ shipmentNumber(row.number) }}</el-descriptions-item>
        <el-descriptions-item label="Kim yazdı">{{ detail.createdByName }}</el-descriptions-item>
        <el-descriptions-item v-if="cancelled" label="Durum">
          <el-tag type="danger" round disable-transitions>{{ cancelled }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-else-if="waiting" label="Dışarıda">{{ waiting }}</el-descriptions-item>
        <el-descriptions-item v-if="detail.description" label="Açıklama">{{ detail.description }}</el-descriptions-item>
      </el-descriptions>

      <el-table :data="row.lines" size="small" class="drawer__lines">
        <el-table-column prop="materialName" label="Malzeme" />
        <el-table-column label="Miktar" width="130" align="right">
          <template #default="{ row: line }">{{ withUnit(line.quantity, line.unit) }}</template>
        </el-table-column>
      </el-table>

      <div v-if="detail.documents.length" class="drawer__docs">
        <el-link v-for="document in detail.documents" :key="document.id" :href="document.url" target="_blank"
          type="primary">
          {{ document.fileName }}
        </el-link>
      </div>

      <el-timeline class="drawer__history">
        <el-timeline-item v-for="entry in detail.history" :key="entry.at" :timestamp="entry.actorName" placement="top">
          {{ HISTORY_LABELS[entry.kind] ?? entry.kind }}
          <div v-if="entry.note">{{ entry.note }}</div>
        </el-timeline-item>
      </el-timeline>
    </template>

    <template #footer>
      <el-button v-if="row && canCreate && row.awaitingReturn" type="success" :loading="isBusy" @click="onReceive">
        İade geldi
      </el-button>
      <el-button v-if="row && canCancel && row.status !== 'CANCELLED'" type="danger" plain :loading="isBusy"
        @click="onCancel">
        İptal et
      </el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
.drawer__lines,
.drawer__docs,
.drawer__history {
  margin-block-start: var(--space-4);
}

.drawer__docs {
  display: grid;
  justify-items: start;
  gap: var(--space-1);
}
</style>
