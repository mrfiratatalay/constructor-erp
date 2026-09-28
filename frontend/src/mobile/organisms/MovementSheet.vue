<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showNotify, type UploaderFileListItem } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { DOCUMENT_ACCEPT, documentError, MAX_DOCUMENT_BYTES } from '@/core/materials/documentRules'
import type { MovementForm } from '@/core/materials/movementForm'
import { withUnit } from '@/core/materials/quantity'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { useMovementEditor } from '@/core/materials/useMovementEditor'
import { savedSummary } from '@/core/materials/useMovementSave'
import LoanPicker from '@/mobile/molecules/LoanPicker.vue'
import MaterialPickerField from '@/mobile/molecules/MaterialPickerField.vue'
import MovementSheetFields from '@/mobile/organisms/MovementSheetFields.vue'
import MovementTypeCards from '@/shared/molecules/MovementTypeCards.vue'

/**
 * Telefonda "+ Malzeme Hareketi": tam ekran (masaüstündeki çekmecenin karşılığı). Üstte işlem türü, sonra yalnızca
 * o türün alanları; kaynakta kullanılabilir miktar miktarın altında yazar. Belgeler fotoğraf ya da PDF olarak eklenir.
 * Kaydet düğmesi ekranın dibinde sabittir.
 */
const open = defineModel<boolean>('open', { required: true })
const { initial = null } = defineProps<{ initial?: MovementForm | null }>()
const emit = defineEmits<{ createMaterial: [name: string] }>()
const editor = useMovementEditor(open, () => initial)
const { form, fields, material, available, touchesSite, options, loans } = editor
const { can } = useMaterialPermissions()
const uploads = ref<UploaderFileListItem[]>([])
const over = computed(() => available.value !== null && (form.value.quantity ?? 0) > available.value)
/** Vant alanı yazı tutar; formda miktar sayıdır (boşsa yok). Virgülle yazılan ondalık da okunur. */
const quantity = computed({
  get: () => (form.value.quantity === null ? '' : String(form.value.quantity)),
  set: (text: string) => (form.value.quantity = text.trim() === '' ? null : Number(text.replace(',', '.'))),
})

watch(open, (isOpen) => isOpen && (uploads.value = []))
watch(uploads, (items) => (form.value.files = items.flatMap((item) => (item.file ? [item.file] : []))), { deep: true })
defineExpose({ pickMaterial: editor.pickMaterial })

const accept = (file: File | File[]) => [file].flat().every((item) => !documentError(item) || !showFailToast(documentError(item)))

async function submit() {
  const problem = editor.problem()
  if (problem) return showFailToast(problem)
  try {
    const detail = await editor.submit()
    showNotify({ type: 'success', message: `Malzeme hareketi kaydedildi\n${savedSummary(detail)}`, duration: 3500 })
    open.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="open" position="bottom" :style="{ height: '100%' }" teleport="body"
    :close-on-click-overlay="false" :close-on-popstate="true">
    <div class="movement-sheet">
      <van-nav-bar title="Yeni Malzeme Hareketi" left-text="Vazgeç" @click-left="open = false" />
      <div class="movement-sheet__body">
        <van-cell-group inset title="İşlem türü">
          <div class="movement-sheet__types"><MovementTypeCards v-model="form.type" :locked="!!initial?.returnOfId" /></div>
        </van-cell-group>
        <van-cell-group inset>
          <LoanPicker v-if="fields.returnOf" v-model="form.returnOfId" :loans="loans.rows.value" />
          <MaterialPickerField v-model="form.materialId" :materials="options.activeMaterials.value"
            :disabled="fields.returnOf" :can-create="can('MANAGE_MATERIAL_CATALOG')"
            @create="(name) => emit('createMaterial', name)" />
          <van-field v-model="quantity" type="number" label="Miktar" placeholder="0" required
            :error-message="over ? `Kullanılabilir: ${withUnit(Math.max(available ?? 0, 0), material?.unit ?? '')}` : ''">
            <template #extra><van-tag plain type="primary">{{ material?.unit ?? 'Birim' }}</van-tag></template>
          </van-field>
          <van-cell v-if="available !== null && material && !over" title="Kullanılabilir"
            :value="withUnit(available, material.unit)" />
        </van-cell-group>
        <MovementSheetFields v-model="form" :locations="options.locations.value" :parties="options.parties.value" />
        <van-cell-group inset>
          <van-field v-model="form.description" type="textarea" :label="fields.descriptionLabel" rows="2" autosize
            maxlength="500" show-word-limit :placeholder="fields.descriptionHint" />
        </van-cell-group>
        <van-cell-group inset title="Belge / İrsaliye (PDF, JPG, PNG · en çok 10 MB)">
          <div class="movement-sheet__uploads">
            <van-uploader v-model="uploads" multiple :max-count="5" :max-size="MAX_DOCUMENT_BYTES" :accept="DOCUMENT_ACCEPT"
              :before-read="accept" upload-text="Belge ekle" @oversize="showFailToast('Belge en çok 10 MB olabilir.')" />
          </div>
        </van-cell-group>
        <van-cell-group v-if="touchesSite" inset>
          <van-cell center title="Saha akışına yansıt" label="Bu hareket, ilgili şantiyenin Saha akışında görünsün.">
            <template #right-icon><van-switch v-model="form.reflectToField" /></template>
          </van-cell>
        </van-cell-group>
      </div>
      <div class="movement-sheet__footer">
        <van-button type="primary" block round :loading="editor.isSaving.value" @click="submit">Hareketi Kaydet</van-button>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
.movement-sheet {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: 100%;
  background: var(--canvas);
}

/* Kartlar (overflow: hidden) ızgarada 0'a kadar büzülebiliyordu: satırlar içerik boyunda sabit, gövde kayar. */
.movement-sheet__body {
  display: grid;
  grid-auto-rows: max-content;
  align-content: start;
  gap: var(--space-3);
  padding: var(--space-3) 0 var(--space-6);
  overflow-y: auto;
}

.movement-sheet__types,
.movement-sheet__uploads {
  padding: var(--space-3);
}

.movement-sheet__footer {
  padding: var(--space-3) var(--space-4) calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--border-soft);
  background: var(--surface);
}
</style>
