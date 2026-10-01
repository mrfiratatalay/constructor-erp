<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { clockTime, dayWithYear } from '@/core/format/dates'
import { movementTypeLabel } from '@/core/shipments/movementPresentation'
import { shipmentNumber } from '@/core/shipments/quantity'
import { waitingText } from '@/core/shipments/shipmentLabels'
import { useMaterialPermissions } from '@/core/shipments/useMaterialPermissions'
import { useShipmentActions } from '@/core/shipments/useShipmentActions'
import { useShipmentDetail } from '@/core/shipments/useShipmentDetail'
import { useShipmentEdit } from '@/core/shipments/useShipmentEdit'
import { confirmAction } from '@/mobile/confirmAction'
import ShipmentStatusTag from '@/mobile/atoms/ShipmentStatusTag.vue'
import ShipmentCancelPopup from '@/mobile/molecules/ShipmentCancelPopup.vue'
import ShipmentDocuments from '@/mobile/molecules/ShipmentDocuments.vue'
import ShipmentEditFields from '@/mobile/molecules/ShipmentEditFields.vue'
import ShipmentHistory from '@/mobile/molecules/ShipmentHistory.vue'
import ShipmentMaterials from '@/mobile/molecules/ShipmentMaterials.vue'
import ShipmentRoute from '@/mobile/molecules/ShipmentRoute.vue'

const shipmentId = defineModel<string | null>('shipmentId', { required: true })
const { detail, isLoading, isError, refetch } = useShipmentDetail(shipmentId)
const { cancel, receive, isBusy } = useShipmentActions()
const { edit, isSaving } = useShipmentEdit()
const { canCancel, canCreate } = useMaterialPermissions()
const row = computed(() => detail.value?.row ?? null)
const editing = ref(false)
const editDay = ref('')
const editDescription = ref('')
const showMore = ref(false)
const cancelling = ref(false)
const confirming = ref(false)
const retrying = ref(false)
const busy = computed(() => isBusy.value || isSaving.value || confirming.value)
const editable = computed(() => !!row.value && canCreate.value && row.value.status !== 'CANCELLED')
const cancellable = computed(() => !!row.value && canCancel.value && row.value.status !== 'CANCELLED')
const moreActions = [{ name: 'Hareketi iptal et', color: 'var(--status-danger)' }]
watch(shipmentId, () => { editing.value = false; cancelling.value = false; showMore.value = false })

function closeSheet(open = false) {
  if (!open && !busy.value) shipmentId.value = null
}

function startEdit() {
  if (!row.value || !detail.value || !editable.value || busy.value) return
  editDay.value = row.value.day
  editDescription.value = detail.value.description ?? ''
  editing.value = true
}

async function saveEdit() {
  if (!shipmentId.value || !editDay.value || !editable.value || busy.value || isError.value) return
  try {
    await edit(shipmentId.value, { day: editDay.value, description: editDescription.value.trim() || null })
    editing.value = false
    showSuccessToast('Hareket güncellendi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

async function onReceive() {
  if (!shipmentId.value || !row.value?.awaitingReturn || !canCreate.value || busy.value) return
  const id = shipmentId.value
  confirming.value = true
  try {
    const agreed = await confirmAction({ title: 'Malzeme geri dönüşü',
      message: 'Bu hareketteki tüm malzemeler tam miktarıyla geri geldi mi?',
      confirm: 'Tamamı geri geldi', danger: false })
    if (!agreed || shipmentId.value !== id) return
    const returned = await receive(id)
    shipmentId.value = returned.row.id
    showSuccessToast('Malzemelerin geri dönüşü kaydedildi')
  } catch (error) {
    showFailToast(errorMessage(error))
  } finally {
    confirming.value = false
  }
}

function openCancel() {
  showMore.value = false
  if (cancellable.value && !busy.value) cancelling.value = true
}

async function onCancel(reason: string) {
  if (!shipmentId.value || !reason.trim() || !cancellable.value || busy.value || isError.value) return
  try {
    await cancel(shipmentId.value, reason.trim())
    cancelling.value = false
    editing.value = false
    showSuccessToast('Hareket iptal edildi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

async function retry() {
  if (retrying.value) return
  retrying.value = true
  try { await refetch() } finally { retrying.value = false }
}
</script>

<template>
  <van-popup :show="!!shipmentId" position="bottom" round teleport="body" class="movement-sheet"
    :close-on-click-overlay="!busy" @update:show="closeSheet">
    <van-nav-bar title="Hareket ayrıntısı" :left-text="busy ? '' : 'Kapat'" :border="false" @click-left="closeSheet()" />
    <div class="movement-sheet__body">
      <van-empty v-if="isError" image="error" description="Hareket ayrıntısı yüklenemedi.">
        <van-button type="primary" size="small" :loading="retrying" @click="retry">Yeniden dene</van-button>
      </van-empty>
      <van-skeleton v-else-if="isLoading" title :row="7" />
      <template v-else-if="row && detail">
        <header class="movement-sheet__heading">
          <div class="movement-sheet__number"><strong>{{ shipmentNumber(row.number) }}</strong><ShipmentStatusTag :row="row" /></div>
          <h2>{{ movementTypeLabel(row.type) }}</h2>
          <p>{{ dayWithYear(row.day) }} · {{ clockTime(row.createdAt) }}</p>
        </header>
        <section class="movement-sheet__route"><ShipmentRoute :row="row" vertical /></section>
        <p v-if="waitingText(row)" class="movement-sheet__waiting">{{ waitingText(row) }}</p>
        <ShipmentEditFields v-if="editing" v-model:day="editDay" v-model:description="editDescription" :disabled="busy" />
        <ShipmentMaterials :lines="row.lines" />
        <ShipmentDocuments :documents="detail.documents" />
        <section v-if="detail.description && !editing" class="movement-sheet__note">
          <h3>AÇIKLAMA</h3><p>{{ detail.description }}</p>
        </section>
        <dl class="movement-sheet__metadata">
          <div><dt>Oluşturan</dt><dd>{{ detail.createdByName }}</dd></div>
          <div><dt>Oluşturulma</dt><dd>{{ dayWithYear(row.createdAt) }} · {{ clockTime(row.createdAt) }}</dd></div>
        </dl>
        <ShipmentHistory :entries="detail.history" />
      </template>
      <van-empty v-else description="Hareket bulunamadı.">
        <van-button size="small" :loading="retrying" @click="retry">Yeniden dene</van-button>
      </van-empty>
    </div>
    <footer v-if="row && !isError && (editable || cancellable || editing)" class="movement-sheet__footer">
      <template v-if="editing">
        <van-button :disabled="busy" @click="editing = false">Vazgeç</van-button>
        <van-button type="primary" class="movement-sheet__main-action" :disabled="busy" :loading="isSaving"
          @click="saveEdit">Değişiklikleri kaydet</van-button>
      </template>
      <template v-else>
        <van-button v-if="editable" icon="edit" :disabled="busy" @click="startEdit">Düzenle</van-button>
        <van-button v-if="canCreate && row.awaitingReturn" type="primary" class="movement-sheet__main-action"
          :loading="isBusy || confirming" :disabled="busy" @click="onReceive">Malzeme geri geldi</van-button>
        <van-button v-if="cancellable" icon="ellipsis" aria-label="Diğer hareket işlemleri" :disabled="busy"
          class="movement-sheet__more" @click="showMore = true" />
      </template>
    </footer>
  </van-popup>
  <van-action-sheet v-model:show="showMore" :actions="moreActions" title="Diğer işlemler" cancel-text="Vazgeç"
    teleport="body" close-on-click-action @select="openCancel" />
  <ShipmentCancelPopup v-model:show="cancelling" :busy="busy" @submit="onCancel" />
</template>

<style scoped src="./shipmentSheet.css"></style>
