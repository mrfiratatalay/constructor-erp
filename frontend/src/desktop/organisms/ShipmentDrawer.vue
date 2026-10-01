<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FileText, Pencil, RotateCcw } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { clockTime, dayWithYear } from '@/core/format/dates'
import { shipmentNumber } from '@/core/shipments/quantity'
import { movementTypeLabel } from '@/core/shipments/movementPresentation'
import { waitingText } from '@/core/shipments/shipmentLabels'
import { useMaterialPermissions } from '@/core/shipments/useMaterialPermissions'
import { useShipmentActions } from '@/core/shipments/useShipmentActions'
import { useShipmentDetail } from '@/core/shipments/useShipmentDetail'
import { useShipmentEdit } from '@/core/shipments/useShipmentEdit'
import ShipmentStatusTag from '@/desktop/atoms/ShipmentStatusTag.vue'
import ShipmentActionMenu from '@/desktop/molecules/ShipmentActionMenu.vue'
import ShipmentEditFields from '@/desktop/molecules/ShipmentEditFields.vue'
import ShipmentHistory from '@/desktop/molecules/ShipmentHistory.vue'
import ShipmentMaterials from '@/desktop/molecules/ShipmentMaterials.vue'
import ShipmentRoute from '@/desktop/molecules/ShipmentRoute.vue'

const shipmentId = defineModel<string | null>('shipmentId', { required: true })
const { detail, isLoading, isError, refetch } = useShipmentDetail(shipmentId)
const { cancel, receive, isBusy } = useShipmentActions()
const { edit, isSaving } = useShipmentEdit()
const { canCancel, canCreate } = useMaterialPermissions()
const row = computed(() => detail.value?.row ?? null)
const editing = ref(false)
const editDay = ref('')
const editDescription = ref('')
const busy = computed(() => isBusy.value || isSaving.value)
const editable = computed(() => canCreate.value && row.value?.status !== 'CANCELLED')
watch(shipmentId, () => { editing.value = false })

function startEdit() {
  if (!row.value || !detail.value) return
  editDay.value = row.value.day
  editDescription.value = detail.value.description ?? ''
  editing.value = true
}

async function saveEdit() {
  if (!shipmentId.value || !editDay.value) return
  try {
    await edit(shipmentId.value, { day: editDay.value, description: editDescription.value.trim() || null })
    editing.value = false
    ElMessage.success('Hareket güncellendi')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

async function onReceive() {
  if (!shipmentId.value || !row.value?.awaitingReturn) return
  const confirmed = await ElMessageBox.confirm('Bu hareketteki tüm malzemeler tam miktarıyla geri geldi mi?',
    'Malzeme geri dönüşü', { confirmButtonText: 'Tamamı geri geldi', cancelButtonText: 'Vazgeç' }).catch(() => false)
  if (!confirmed || !shipmentId.value) return
  try {
    const returned = await receive(shipmentId.value)
    shipmentId.value = returned.row.id
    ElMessage.success('Malzemelerin geri dönüşü kaydedildi')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

async function onCancel() {
  const asked = await ElMessageBox.prompt('İptal nedenini yazın. Kayıt ve nedeni hareket geçmişinde korunur.',
    'Hareketi iptal et', {
      confirmButtonText: 'Hareketi iptal et', cancelButtonText: 'Vazgeç', inputPlaceholder: 'İptal nedeni',
      inputValidator: (value) => value?.trim() ? true : 'İptal nedeni gerekli.',
    }).catch(() => null)
  if (!asked || !shipmentId.value) return
  try {
    await cancel(shipmentId.value, asked.value.trim())
    editing.value = false
    ElMessage.success('Hareket iptal edildi')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-drawer :model-value="!!shipmentId" size="540px" class="movement-detail"
    :close-on-click-modal="!busy" :close-on-press-escape="!busy" :show-close="!busy"
    @update:model-value="shipmentId = null">
    <template #header="{ titleId }">
      <div v-if="row" class="movement-detail__heading">
        <div class="movement-detail__number"><span>{{ shipmentNumber(row.number) }}</span><ShipmentStatusTag :row="row" /></div>
        <h2 :id="titleId">{{ movementTypeLabel(row.type) }}</h2>
        <p>{{ dayWithYear(row.day) }} · {{ clockTime(row.createdAt) }}</p>
      </div>
      <h2 v-else :id="titleId">Hareket ayrıntısı</h2>
    </template>
    <el-alert v-if="isError" title="Hareket ayrıntısı yüklenemedi." type="error" :closable="false" show-icon>
      <el-button link type="primary" @click="refetch()">Yeniden dene</el-button>
    </el-alert>
    <el-skeleton v-else-if="isLoading || !row || !detail" :rows="6" animated />
    <div v-else class="movement-detail__body">
      <div class="movement-detail__route"><ShipmentRoute :row="row" vertical /></div>
      <p v-if="waitingText(row)" class="movement-detail__waiting">{{ waitingText(row) }}</p>
      <ShipmentEditFields v-if="editing" v-model:day="editDay" v-model:description="editDescription" :disabled="busy" />
      <ShipmentMaterials :lines="row.lines" />
      <section>
        <h3>İRSALİYE</h3>
        <div v-if="detail.documents.length" class="movement-detail__documents">
          <el-link v-for="document in detail.documents" :key="document.id" :href="document.url" target="_blank"
            rel="noopener noreferrer" :underline="false" class="movement-detail__document">
            <FileText :size="18" /><span>{{ document.fileName }}</span>
          </el-link>
        </div>
        <p v-else class="movement-detail__muted">İrsaliye eklenmemiş.</p>
      </section>
      <section v-if="detail.description && !editing">
        <h3>AÇIKLAMA</h3><p class="movement-detail__description">{{ detail.description }}</p>
      </section>
      <dl class="movement-detail__metadata">
        <div><dt>Oluşturan</dt><dd>{{ detail.createdByName }}</dd></div>
        <div><dt>Oluşturulma</dt><dd>{{ dayWithYear(row.createdAt) }} · {{ clockTime(row.createdAt) }}</dd></div>
      </dl>
      <ShipmentHistory :entries="detail.history" />
    </div>
    <template #footer>
      <div v-if="row && !isError" class="movement-detail__footer">
        <template v-if="editing">
          <el-button :disabled="busy" @click="editing = false">Vazgeç</el-button>
          <el-button type="primary" :loading="isSaving" @click="saveEdit">Değişiklikleri kaydet</el-button>
        </template>
        <template v-else>
          <el-button v-if="editable" :icon="Pencil" :disabled="busy" @click="startEdit">Düzenle</el-button>
          <div class="movement-detail__footer-actions">
            <el-button v-if="canCreate && row.awaitingReturn" :icon="RotateCcw" type="primary" :loading="isBusy" @click="onReceive">Malzeme geri geldi</el-button>
            <ShipmentActionMenu v-if="canCancel && row.status !== 'CANCELLED'" :show-details="false" :can-cancel="true"
              :busy="busy" @cancel="onCancel" />
          </div>
        </template>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped src="./shipmentDrawer.css"></style>
<style>
.movement-detail.el-drawer { max-width: 100vw; }
.movement-detail .el-drawer__header { margin-bottom: 0; padding: var(--space-6); border-bottom: 1px solid var(--border-soft); align-items: flex-start; }
.movement-detail .el-drawer__body { padding: var(--space-6); }
.movement-detail .el-drawer__footer { padding: var(--space-4) var(--space-6); border-top: 1px solid var(--border-soft); }
</style>
