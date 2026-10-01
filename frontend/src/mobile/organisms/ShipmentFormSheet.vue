<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast, type UploaderFileListItem } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { draftProblem, emptyDraft, newLine, requestOf, type ShipmentDraft } from '@/core/shipments/shipmentForm'
import { useShipmentOptions } from '@/core/shipments/useShipmentOptions'
import { useShipmentSave } from '@/core/shipments/useShipmentSave'
import { useStockAt } from '@/core/shipments/useStockAt'
import MaterialLineField from '@/mobile/molecules/MaterialLineField.vue'
import MaterialPickerSheet from '@/mobile/organisms/MaterialPickerSheet.vue'

/**
 * Sevkiyat çıkarmak: üç soru. Nereye, ne kadar, irsaliye. "Nereden" sorulmaz — çıkış her zaman ana depodur.
 * Hareket türü de sorulmaz: nereye gittiğinden sunucu hesaplar. Dışarı verilende tek ek soru çıkar:
 * geri gelecek mi?
 */
const show = defineModel<boolean>('show', { required: true })
const emit = defineEmits<{ saved: [shipmentId: string] }>()

const { sites, mainDepot, materials } = useShipmentOptions()
const { save, isSaving } = useShipmentSave()
const stock = useStockAt(() => mainDepot.value?.id ?? null)

const draft = ref<ShipmentDraft>(emptyDraft())
const files = ref<UploaderFileListItem[]>([])
const outside = computed(() => draft.value.targetKind === 'OUTSIDE')
const inbound = computed(() => draft.value.targetKind === 'INBOUND')
/** Hedef seçilene kadar liste açık durur; seçilince tek satıra iner, çünkü dokuz şantiyeli firmada form uzar. */
const choosing = ref(true)
/** Malzeme seçici tek tanedir; hangi kalem için açıldığı burada tutulur. */
const pickingLine = ref<number | null>(null)

const targetName = computed(() => {
  if (outside.value) return 'Başka firmaya'
  if (inbound.value) return 'Depoya mal geldi'
  return sites.value.find((site) => site.id === draft.value.destinationId)?.name ?? ''
})
const materialOf = (materialId: string) => materials.value.find((item) => item.id === materialId) ?? null

watch(show, (open) => {
  if (open) {
    draft.value = emptyDraft()
    files.value = []
    choosing.value = true
  }
})

function pickTarget(kind: ShipmentDraft['targetKind'], siteId: string | null) {
  draft.value.targetKind = kind
  draft.value.destinationId = siteId
  choosing.value = false
}

function chooseMaterial(materialId: string) {
  const line = draft.value.lines[pickingLine.value ?? 0]
  if (line) line.materialId = materialId
  pickingLine.value = null
}

async function submit() {
  const problem = draftProblem(draft.value)
  if (problem) return showFailToast(problem)
  if (!mainDepot.value) return showFailToast('Depo bulunamadı.')
  try {
    const documents = files.value.map((item) => item.file).filter((file): file is File => !!file)
    const detail = await save(requestOf(draft.value, mainDepot.value.id), documents)
    showSuccessToast('Sevkiyat kaydedildi')
    show.value = false
    emit('saved', detail.row.id)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" :style="{ height: '100%' }" teleport="body">
    <van-nav-bar title="Sevkiyat çıkar" left-text="Vazgeç" safe-area-inset-top @click-left="show = false" />

    <div class="form">
      <van-divider content-position="left">1 · Nereye gidiyor?</van-divider>
      <van-cell-group v-if="!choosing" inset>
        <van-cell is-link :title="targetName" @click="choosing = true" />
      </van-cell-group>
      <van-cell-group v-else inset>
        <van-cell v-for="site in sites" :key="site.id" :title="site.name" clickable
          @click="pickTarget('SITE', site.id)" />
        <van-cell title="Başka firmaya" clickable @click="pickTarget('OUTSIDE', null)" />
        <van-cell title="Depoya mal geldi" clickable @click="pickTarget('INBOUND', null)" />
      </van-cell-group>
      <van-cell-group v-if="outside || inbound" inset>
        <van-field v-model="draft.partyName" :label="inbound ? 'Kimden' : 'Kime'"
          placeholder="Firma ya da kişi adı" />
        <van-cell v-if="outside" title="Geri gelecek mi?">
          <template #right-icon><van-switch v-model="draft.expectsReturn" size="22" /></template>
        </van-cell>
      </van-cell-group>

      <van-divider content-position="left">2 · Ne, ne kadar?</van-divider>
      <van-cell-group v-for="(line, index) in draft.lines" :key="line.key" inset>
        <MaterialLineField v-model:quantity="line.quantity" :material="materialOf(line.materialId)"
          :available="stock.quantityOf(line.materialId)" @pick="pickingLine = index"
          @remove="draft.lines.splice(index, 1)" />
      </van-cell-group>
      <div class="form__add">
        <van-button size="small" icon="plus" round block
          @click="draft.lines.push(newLine())">
          Bir şey daha ekle
        </van-button>
      </div>

      <van-divider content-position="left">3 · İrsaliye</van-divider>
      <van-cell-group inset>
        <van-field label="Fotoğraf">
          <template #input>
            <van-uploader v-model="files" accept="image/*,application/pdf" capture="environment" :max-count="3" />
          </template>
        </van-field>
        <van-field v-model="draft.description" label="Açıklama" type="textarea" rows="2" autosize
          placeholder="Anlaşma, kim teslim aldı…" />
      </van-cell-group>

      <div class="form__send">
        <van-button type="primary" block round :loading="isSaving" @click="submit">Gönder</van-button>
      </div>
    </div>

    <MaterialPickerSheet :show="pickingLine !== null" :materials="materials" @choose="chooseMaterial"
      @update:show="(open: boolean) => !open && (pickingLine = null)" />
  </van-popup>
</template>

<style scoped>
.form {
  overflow-y: auto;
  height: calc(100% - var(--van-nav-bar-height));
  padding-bottom: var(--van-padding-xl);
  background: var(--van-background);
}

.form__add,
.form__send {
  padding: var(--van-padding-md);
}
</style>
