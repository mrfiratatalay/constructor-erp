<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast, type UploaderFileListItem } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MovementKind } from '@/core/shipments/movementPresentation'
import { MOVEMENT_COPY } from '@/core/shipments/movementForm'
import { shipmentNumber, withUnit } from '@/core/shipments/quantity'
import { newLine } from '@/core/shipments/shipmentForm'
import { useMovementComposer } from '@/core/shipments/useMovementComposer'
import { confirmAction } from '@/mobile/confirmAction'
import MaterialLineField from '@/mobile/molecules/MaterialLineField.vue'
import MovementTargetField from '@/mobile/molecules/MovementTargetField.vue'
import MovementReturnField from '@/mobile/molecules/MovementReturnField.vue'
import MovementUploadField from '@/mobile/molecules/MovementUploadField.vue'
import MaterialPickerSheet from '@/mobile/organisms/MaterialPickerSheet.vue'

const show = defineModel<boolean>('show', { required: true })
const { initialKind = 'SITE' } = defineProps<{ initialKind?: MovementKind }>()
const emit = defineEmits<{ saved: [shipmentId: string] }>()
const { draft, returnId, original, awaiting, returnsLoading, returnsError, refetch, reset,
  sites, mainDepot, materials, create, receive, isSaving } = useMovementComposer()
const files = ref<UploaderFileListItem[]>([])
const pickingLine = ref<number | null>(null)
const submitting = ref(false)
const busy = computed(() => submitting.value || isSaving.value)
const copy = computed(() => MOVEMENT_COPY[initialKind])
const returning = computed(() => initialKind === 'RETURN')
const materialOf = (id: string) => materials.value.find((item) => item.id === id) ?? null

watch(show, (open) => {
  if (!open) return
  reset(initialKind)
  files.value = []
  pickingLine.value = null
}, { immediate: true })

function chooseMaterial(id: string) {
  const line = draft.value.lines[pickingLine.value ?? 0]
  if (line) line.materialId = id
  pickingLine.value = null
}

async function confirmReturn() {
  if (!original.value) throw new Error('Geri beklenen bir hareket seçin.')
  const lines = original.value.lines.map((line) => `${line.materialName}: ${withUnit(line.quantity, line.unit)}`)
  const confirmed = await confirmAction({
    title: 'Tamamı geri geldi mi?', danger: false, confirm: 'Tamamı geri geldi',
    message: `${shipmentNumber(original.value.number)} · ${original.value.toName}\n\n${lines.join('\n')}\n\nTüm malzemeler tam miktarıyla geri alınacak.`,
  })
  return confirmed ? receive() : null
}

async function submit() {
  if (busy.value) return
  submitting.value = true
  try {
    const documents = files.value.flatMap((file) => file.file ? [file.file] : [])
    const detail = await (returning.value ? confirmReturn() : create(documents))
    if (!detail) return
    showSuccessToast(returning.value ? 'Malzemelerin geri dönüşü kaydedildi.' : 'Malzeme hareketi kaydedildi.')
    show.value = false
    emit('saved', detail.row.id)
  } catch (error) {
    showFailToast(errorMessage(error))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" teleport="body" :close-on-click-overlay="!busy"
    :style="{ height: '100%' }" class="movement-form">
    <van-nav-bar :title="copy.title" :left-text="busy ? '' : 'Vazgeç'" safe-area-inset-top
      @click-left="!busy && (show = false)" />
    <div class="movement-form__body" :class="{ 'movement-form__body--busy': busy }" :inert="busy">
      <p class="movement-form__intro">{{ copy.subtitle }}</p>
      <MovementReturnField v-if="returning" v-model="returnId" :awaiting="awaiting" :original="original"
        :loading="returnsLoading" :failed="returnsError" @retry="refetch()" />
      <template v-else>
        <section>
          <van-divider content-position="left">{{ initialKind === 'INBOUND' ? 'Kaynak' : 'Hedef' }}</van-divider>
          <MovementTargetField v-model="draft" :sites="sites" :depot-name="mainDepot?.name ?? 'Ana depo yükleniyor…'" />
        </section>
        <section>
          <van-divider content-position="left">Malzemeler</van-divider>
          <van-cell-group v-for="(line, index) in draft.lines" :key="line.key" inset class="movement-form__line">
            <MaterialLineField v-model:quantity="line.quantity" :material="materialOf(line.materialId)"
              @pick="pickingLine = index" @remove="draft.lines.splice(index, 1)" />
          </van-cell-group>
          <div class="movement-form__add">
            <van-button size="small" icon="plus" round block @click="draft.lines.push(newLine())">Malzeme ekle</van-button>
          </div>
        </section>
        <section>
          <van-divider content-position="left">İrsaliye · İsteğe bağlı</van-divider>
          <MovementUploadField v-model="files" />
        </section>
        <section>
          <van-divider content-position="left">Açıklama · İsteğe bağlı</van-divider>
          <van-cell-group inset>
            <van-field v-model="draft.description" type="textarea" rows="3" autosize maxlength="500" show-word-limit
              placeholder="Teslim alan kişi veya not…" aria-label="Açıklama" />
          </van-cell-group>
        </section>
      </template>
    </div>
    <footer class="movement-form__footer">
      <van-button type="primary" block round :loading="busy" :disabled="returning && !original"
        @click="submit">{{ copy.submit }}</van-button>
    </footer>
    <MaterialPickerSheet :show="pickingLine !== null" :materials="materials" @choose="chooseMaterial"
      @update:show="(open: boolean) => !open && (pickingLine = null)" />
  </van-popup>
</template>

<style scoped>
.movement-form { display: flex; flex-direction: column; background: var(--van-background); }
.movement-form > :deep(.van-nav-bar) { flex-shrink: 0; }
.movement-form :deep(.van-nav-bar__title) { font-size: var(--text-sm); max-width: 67%; }
.movement-form__body { flex: 1; min-height: 0; overflow-y: auto; padding-bottom: var(--space-5); }
.movement-form__body--busy { pointer-events: none; }
.movement-form__intro { margin: var(--space-4) var(--space-5); color: var(--text-muted); font-size: var(--text-sm); line-height: 1.6; }
.movement-form__line { margin-bottom: var(--space-3); }
.movement-form__add { padding: 0 var(--space-4); }
.movement-form__footer { flex-shrink: 0; padding: var(--space-3) var(--space-4) calc(var(--space-3) + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--border-soft); }
</style>
