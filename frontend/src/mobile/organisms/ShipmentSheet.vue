<script setup lang="ts">
import { computed } from 'vue'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
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
    showSuccessToast('İade alındı')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

/** İptalin nedeni zorunludur ve geçmişte kalır; kayıt silinmez. */
async function onCancel() {
  const asked = await showConfirmDialog({
    title: 'Sevkiyat iptal edilsin mi?',
    message: 'Kayıt silinmez, "İptal" olarak kalır.',
    confirmButtonText: 'İptal et',
    cancelButtonText: 'Vazgeç',
  }).then(() => true, () => false)
  if (!asked || !shipmentId.value) return
  try {
    await cancel(shipmentId.value, 'Yanlış kayıt')
    showSuccessToast('İptal edildi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup :show="!!shipmentId" position="bottom" round :style="{ maxHeight: '88%' }" teleport="body"
    @update:show="shipmentId = null">
    <van-nav-bar :title="row ? TYPE_LABELS[row.type] : 'Sevkiyat'" left-text="Kapat" @click-left="shipmentId = null" />
    <van-skeleton v-if="isLoading || !row || !detail" :row="5" class="sheet__body" />
    <div v-else class="sheet__body">
      <van-cell-group inset>
        <van-cell title="Yol" :value="routeText(row)" />
        <van-cell title="Numara" :value="shipmentNumber(row.number)" />
        <van-cell v-if="cancelled" title="Durum">
          <template #value><van-tag type="danger" round>{{ cancelled }}</van-tag></template>
        </van-cell>
        <van-cell v-else-if="waiting" title="Dışarıda" :value="waiting" />
        <van-cell v-if="detail.description" title="Açıklama" :label="detail.description" />
      </van-cell-group>

      <van-cell-group inset title="Kalemler">
        <van-cell v-for="line in row.lines" :key="line.materialId" :title="line.materialName"
          :value="withUnit(line.quantity, line.unit)" />
      </van-cell-group>

      <van-cell-group v-if="detail.documents.length" inset title="İrsaliye">
        <van-cell v-for="document in detail.documents" :key="document.id" :title="document.fileName" is-link
          :url="document.url" target="_blank" />
      </van-cell-group>

      <van-cell-group inset title="Geçmiş">
        <van-cell v-for="entry in detail.history" :key="entry.at" :title="HISTORY_LABELS[entry.kind] ?? entry.kind"
          :label="entry.note ?? ''" :value="entry.actorName" />
      </van-cell-group>

      <div class="sheet__actions">
        <van-button v-if="canCreate && row.awaitingReturn" type="success" block round :loading="isBusy"
          @click="onReceive">
          İade geldi
        </van-button>
        <van-button v-if="canCancel && row.status !== 'CANCELLED'" type="danger" plain block round :loading="isBusy"
          @click="onCancel">
          İptal et
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
.sheet__body {
  overflow-y: auto;
  max-height: calc(88vh - var(--van-nav-bar-height));
  padding-bottom: var(--van-padding-md);
  background: var(--van-background);
}

.sheet__actions {
  display: grid;
  gap: var(--van-padding-sm);
  padding: var(--van-padding-md);
}
</style>
