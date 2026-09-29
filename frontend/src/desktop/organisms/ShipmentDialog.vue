<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, type UploadUserFile } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { withUnit } from '@/core/shipments/quantity'
import { draftProblem, emptyDraft, requestOf, type ShipmentDraft } from '@/core/shipments/shipmentForm'
import { useShipmentOptions } from '@/core/shipments/useShipmentOptions'
import { useShipmentSave } from '@/core/shipments/useShipmentSave'
import { useStockAt } from '@/core/shipments/useStockAt'
import NewMaterialDialog from '@/desktop/molecules/NewMaterialDialog.vue'

/**
 * Sevkiyat çıkarmak, geniş ekranda. Telefondaki üç soru burada da aynıdır: nereye, ne kadar, irsaliye.
 * "Nereden" ve "hareket türü" sorulmaz; çıkış ana depodur, türü sunucu hesaplar. Listede olmayan malzeme
 * seçicinin altındaki bağlantıyla oracıkta açılır.
 */
const show = defineModel<boolean>('show', { required: true })
const emit = defineEmits<{ saved: [shipmentId: string] }>()

const { sites, mainDepot, materials } = useShipmentOptions()
const { save, isSaving } = useShipmentSave()
const stock = useStockAt(() => mainDepot.value?.id ?? null)

const draft = ref<ShipmentDraft>(emptyDraft())
const files = ref<UploadUserFile[]>([])
const outside = computed(() => draft.value.targetKind === 'OUTSIDE')
const inbound = computed(() => draft.value.targetKind === 'INBOUND')
const elsewhere = computed(() => outside.value || inbound.value)
/** Yeni malzeme hangi kalem için açılıyor: eklenince o satıra yerleşir. */
const addingFor = ref<number | null>(null)

watch(show, (open) => {
  if (open) {
    draft.value = emptyDraft()
    files.value = []
  }
})

/** Hedef seçimi tek listedir: şantiyeler, "Başka firmaya" ve "Depoya mal geldi". */
function onTarget(value: string) {
  const special = value === 'OUTSIDE' || value === 'INBOUND'
  draft.value.targetKind = special ? (value as 'OUTSIDE' | 'INBOUND') : 'SITE'
  draft.value.destinationId = special ? null : value
}

function onMaterialCreated(materialId: string) {
  const line = draft.value.lines[addingFor.value ?? 0]
  if (line) line.materialId = materialId
  addingFor.value = null
}

const unitOf = (materialId: string) => materials.value.find((item) => item.id === materialId)?.unit ?? ''

async function submit() {
  const problem = draftProblem(draft.value)
  if (problem) return ElMessage.warning(problem)
  if (!mainDepot.value) return ElMessage.error('Depo bulunamadı.')
  try {
    const documents = files.value.flatMap((item) => (item.raw ? [item.raw as File] : []))
    const detail = await save(requestOf(draft.value, mainDepot.value.id), documents)
    ElMessage.success('Sevkiyat kaydedildi')
    show.value = false
    emit('saved', detail.row.id)
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-drawer v-model="show" size="520px" title="Sevkiyat çıkar">
    <el-form label-position="top">
      <el-form-item label="1 · Nereye gidiyor?">
        <el-select :model-value="elsewhere ? draft.targetKind : draft.destinationId" placeholder="Şantiye seç"
          style="width: 100%" @update:model-value="onTarget">
          <el-option v-for="site in sites" :key="site.id" :label="site.name" :value="site.id" />
          <el-option label="Başka firmaya" value="OUTSIDE" />
          <el-option label="Depoya mal geldi" value="INBOUND" />
        </el-select>
      </el-form-item>
      <template v-if="elsewhere">
        <el-form-item :label="inbound ? 'Kimden' : 'Kime'">
          <el-input v-model="draft.partyName" placeholder="Firma ya da kişi adı" />
        </el-form-item>
        <el-form-item v-if="outside" label="Geri gelecek mi?">
          <el-switch v-model="draft.expectsReturn" active-text="Geri gelecek" inactive-text="Gelmeyecek" />
        </el-form-item>
      </template>

      <el-form-item label="2 · Ne, ne kadar?">
        <div v-for="(line, index) in draft.lines" :key="index" class="dialog__line">
          <el-select v-model="line.materialId" placeholder="Malzeme" filterable class="dialog__material">
            <el-option v-for="material in materials" :key="material.id" :label="material.name" :value="material.id" />
            <template #footer>
              <el-button link type="primary" @click="addingFor = index">+ Listede yok, yeni malzeme ekle</el-button>
            </template>
          </el-select>
          <el-input-number v-model="line.quantity" :min="0" :controls="false" placeholder="0" class="dialog__amount" />
          <el-button link type="danger" :disabled="draft.lines.length === 1" @click="draft.lines.splice(index, 1)">
            Sil
          </el-button>
          <el-text v-if="stock.quantityOf(line.materialId) > 0" size="small" type="info" class="dialog__stock">
            Depoda: {{ withUnit(stock.quantityOf(line.materialId), unitOf(line.materialId)) }}
          </el-text>
        </div>
        <el-button link type="primary" @click="draft.lines.push({ materialId: '', quantity: null })">
          + Bir şey daha ekle
        </el-button>
      </el-form-item>

      <el-form-item label="3 · İrsaliye">
        <el-upload v-model:file-list="files" :auto-upload="false" accept="image/*,application/pdf" :limit="3" drag>
          <div>İrsaliyeyi buraya bırak ya da seç</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="Açıklama">
        <el-input v-model="draft.description" type="textarea" :rows="2" placeholder="Anlaşma, kim teslim aldı…" />
      </el-form-item>
    </el-form>

    <NewMaterialDialog :show="addingFor !== null" @created="onMaterialCreated"
      @update:show="(open: boolean) => !open && (addingFor = null)" />

    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="isSaving" @click="submit">Gönder</el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
.dialog__line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px auto;
  gap: var(--space-2);
  width: 100%;
  margin-block-end: var(--space-2);
}

.dialog__stock {
  grid-column: 1 / -1;
}
</style>
