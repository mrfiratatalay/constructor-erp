<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type UploadUserFile } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { MovementKind } from '@/core/shipments/movementPresentation'
import { MOVEMENT_COPY } from '@/core/shipments/movementForm'
import { shipmentNumber, withUnit } from '@/core/shipments/quantity'
import { newLine } from '@/core/shipments/shipmentForm'
import { useMovementComposer } from '@/core/shipments/useMovementComposer'
import NewMaterialDialog from '@/desktop/molecules/NewMaterialDialog.vue'
import MovementLines from '@/desktop/molecules/MovementLines.vue'
import MovementDocuments from '@/desktop/molecules/MovementDocuments.vue'
import ReturnSelection from '@/desktop/molecules/ReturnSelection.vue'

const show = defineModel<boolean>('show', { required: true })
const { initialKind = 'SITE' } = defineProps<{ initialKind?: MovementKind }>()
const emit = defineEmits<{ saved: [shipmentId: string] }>()
const { draft, returnId, original, awaiting, returnsLoading, returnsError, refetch, reset,
  sites, mainDepot, materials, create, receive, isSaving } = useMovementComposer()
const files = ref<UploadUserFile[]>([])
const addingFor = ref<number | null>(null)
const submitting = ref(false)
const busy = computed(() => submitting.value || isSaving.value)
const copy = computed(() => MOVEMENT_COPY[initialKind])
const returning = computed(() => initialKind === 'RETURN')
const inbound = computed(() => initialKind === 'INBOUND')

watch(show, (open) => {
  if (!open) return
  reset(initialKind)
  files.value = []
  addingFor.value = null
}, { immediate: true })

function onMaterialCreated(id: string) {
  const line = draft.value.lines[addingFor.value ?? 0]
  if (line) line.materialId = id
  addingFor.value = null
}

async function confirmReturn() {
  if (!original.value) throw new Error('Geri beklenen bir hareket seçin.')
  const lines = original.value.lines.map((line) => `${line.materialName}: ${withUnit(line.quantity, line.unit)}`)
  const message = `${shipmentNumber(original.value.number)} · ${original.value.toName}\n\n${lines.join('\n')}\n\nTüm malzemeler tam miktarıyla geri geldi mi?`
  await ElMessageBox.confirm(message, 'Geri dönüşü onaylayın', {
    confirmButtonText: 'Tamamı geri geldi', cancelButtonText: 'Vazgeç', type: 'warning',
    customClass: 'movement-return-confirm',
  })
  return receive()
}

async function submit() {
  if (busy.value) return
  submitting.value = true
  try {
    const documents = files.value.flatMap((file) => file.raw ? [file.raw] : [])
    const detail = await (returning.value ? confirmReturn() : create(documents))
    ElMessage.success(returning.value ? 'Malzemelerin geri dönüşü kaydedildi.' : 'Malzeme hareketi kaydedildi.')
    show.value = false
    emit('saved', detail.row.id)
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(errorMessage(error))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-drawer v-model="show" size="540px" class="movement-form" :close-on-click-modal="!busy"
    :close-on-press-escape="!busy" :show-close="!busy">
    <template #header="{ titleId }">
      <div class="movement-form__title"><h2 :id="titleId">{{ copy.title }}</h2><p>{{ copy.subtitle }}</p></div>
    </template>
    <el-form label-position="top" :disabled="busy" class="movement-form__body">
      <ReturnSelection v-if="returning" v-model="returnId" :awaiting="awaiting" :original="original"
        :loading="returnsLoading" :failed="returnsError" @retry="refetch()" />
      <template v-else>
        <section>
          <h3>{{ inbound ? 'Kaynak' : 'Hedef' }}</h3>
          <el-form-item v-if="initialKind === 'SITE'" label="Şantiye" required>
            <el-select v-model="draft.destinationId" filterable placeholder="Şantiye seçin" class="movement-form__select">
              <el-option v-for="site in sites" :key="site.id" :label="site.name" :value="site.id" />
            </el-select>
          </el-form-item>
          <el-form-item v-else :label="inbound ? 'Kimden geldi?' : 'Firma veya kişi'" required>
            <el-input v-model="draft.partyName" placeholder="Firma veya kişi adı" maxlength="120" />
          </el-form-item>
          <el-form-item v-if="initialKind === 'OUTSIDE'" class="movement-form__return-option">
            <el-switch v-model="draft.expectsReturn" /><span>Malzemelerin geri gelmesini bekliyorum</span>
          </el-form-item>
          <p class="movement-form__depot">{{ inbound ? 'Hedef' : 'Kaynak' }}: {{ mainDepot?.name ?? 'Ana depo yükleniyor…' }}</p>
        </section>
        <section>
          <h3>Malzemeler</h3>
          <MovementLines v-model="draft.lines" :materials="materials" @add="draft.lines.push(newLine())"
            @create-material="addingFor = $event" />
        </section>
        <section><h3>İrsaliye <span>İsteğe bağlı</span></h3><MovementDocuments v-model="files" /></section>
        <section>
          <h3>Açıklama <span>İsteğe bağlı</span></h3>
          <el-input v-model="draft.description" type="textarea" :rows="3" maxlength="500" show-word-limit
            placeholder="Teslim alan kişi veya not…" aria-label="Açıklama" />
        </section>
      </template>
    </el-form>
    <NewMaterialDialog :show="addingFor !== null" @created="onMaterialCreated"
      @update:show="(open: boolean) => !open && (addingFor = null)" />
    <template #footer>
      <el-button :disabled="busy" @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="busy" :disabled="returning && !original" @click="submit">{{ copy.submit }}</el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
.movement-form__title h2 { margin: 0; font-size: var(--text-lg); font-weight: var(--weight-bold); color: var(--text-strong); }
.movement-form__title p { margin: var(--space-2) 0 0; color: var(--text-muted); font-size: var(--text-sm); line-height: 1.6; }
.movement-form__body { display: grid; gap: var(--space-6); }
.movement-form__body h3 { display: flex; align-items: center; gap: var(--space-2); margin: 0 0 var(--space-4); font-size: var(--text-xs); letter-spacing: .08em; text-transform: uppercase; }
.movement-form__body h3 span { color: var(--text-subtle); font-size: 11px; letter-spacing: normal; font-weight: var(--weight-medium); text-transform: none; }
.movement-form__select { width: 100%; }
.movement-form__depot { margin: 0; font-size: var(--text-xs); color: var(--text-muted); }
.movement-form__return-option :deep(.el-form-item__content) { gap: var(--space-3); font-size: var(--text-sm); }
</style>

<style>
.movement-form.el-drawer { max-width: 100vw; }
.movement-form .el-drawer__header { margin-bottom: 0; padding: var(--space-6); border-bottom: 1px solid var(--border-soft); }
.movement-form .el-drawer__body { padding: var(--space-6); }
.movement-form .el-drawer__footer { border-top: 1px solid var(--border-soft); padding: var(--space-4) var(--space-6); }
.movement-return-confirm .el-message-box__message { white-space: pre-line; }
</style>
