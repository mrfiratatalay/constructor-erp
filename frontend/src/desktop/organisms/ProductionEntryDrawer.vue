<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { ElMessage, ElMessageBox, type UploadFile, type UploadInstance, type UploadUserFile } from 'element-plus'
import { FileText, ImagePlus, Trash2 } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { ProductionItemView } from '@/core/api/generated/model'
import { ENTRY_FILE_ACCEPT, ENTRY_FILE_LIMIT, entryFileProblem } from '@/core/production/entryFiles'
import { barPercent, entryAmount, percentLabel, progressLine } from '@/core/production/productionFormat'
import { useProductionEntry } from '@/core/production/useProductionEntry'
import TradeIcon from '@/shared/atoms/TradeIcon.vue'

/**
 * "Günlük İlerleme", sağdan çekmece; modülün en sık işi: "Demir İşleri → Güncelle → 3,5 → Kaydet".
 * Üstte imalat ve mevcut durumu; bugün yapılan (birim imalatındır), çalışan sayısı, tarih (bugün; geçmiş güne
 * değiştirilebilir), not, fotoğraf ve PDF, "Saha akışına yansıt" (kapalı gelir: Saha'yı çalışanlar da görür).
 * Toplamı aşan giriş sorulur. Yüzde, kalan ve toplamı sunucu hesaplar.
 */
const show = defineModel<boolean>('show', { required: true })
const { siteId, item } = defineProps<{ siteId: string; item: ProductionItemView | null }>()
const { form, reset, save, problem, overflow, quantity, isSaving } = useProductionEntry(() => siteId)
const files = ref<UploadUserFile[]>([])
const upload = useTemplateRef<UploadInstance>('upload')
const tried = ref(false)
const isFuture = (date: Date) => date > new Date()
const isImage = (file: UploadFile) => !!file.raw?.type.startsWith('image/')

watch(show, (open) => {
  if (!open) return
  reset()
  files.value = []
  tried.value = false
})

/** Fotoğraf ve PDF dışındaki dosya listeye girmez; nedeni söylenir. */
function onPicked(file: UploadFile) {
  const problemOfFile = file.raw ? entryFileProblem(file.raw) : null
  if (!problemOfFile) return
  ElMessage.warning(problemOfFile)
  files.value = files.value.filter((candidate) => candidate.uid !== file.uid)
}

const confirmOverflow = (question: string) =>
  ElMessageBox.confirm(question, 'Toplamı aşıyor', { confirmButtonText: 'Evet, kaydet', cancelButtonText: 'Vazgeç',
    type: 'warning' }).then(() => true, () => false)

async function submit() {
  tried.value = true
  if (!item || problem.value) return
  const question = overflow(item)
  if (question && !(await confirmOverflow(question))) return
  try {
    await save(item, files.value.flatMap((file) => (file.raw ? [file.raw] : [])))
    const field = form.onField ? ' Saha akışına da eklendi.' : ''
    const message = `${item.name} için ${entryAmount(quantity.value, item.unit)} kaydedildi.${field}`
    // Platformdaki her başarı bildirimi gibi üstte ortada: burada tek başına sağ üstte bildirim kartı açılıyordu.
    ElMessage.success(message)
    show.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-drawer v-model="show" size="480px" append-to-body title="Günlük İlerleme">
    <template v-if="item">
      <el-text type="info">Bugün yapılan işin miktarını kaydedin.</el-text>
      <el-card shadow="never" class="entry__card">
        <el-space :size="12">
          <TradeIcon :trade="item.trade" />
          <div class="entry__title">
            <el-text tag="b" size="large">{{ item.name }}</el-text>
            <el-text size="small" type="info">Taşeron: {{ item.crew?.name ?? 'atanmadı' }}</el-text>
          </div>
        </el-space>
      </el-card>
      <el-card shadow="never" class="entry__card">
        <div class="entry__figures">
          <el-text tag="b" size="large">{{ progressLine(item) }}</el-text>
          <el-text tag="b">{{ percentLabel(item.percent) }}</el-text>
        </div>
        <el-progress :percentage="barPercent(item.percent)" :show-text="false" :stroke-width="8" />
      </el-card>
      <el-form label-position="top" class="entry__form" @submit.prevent="submit">
        <el-row :gutter="12">
          <el-col :span="14">
            <el-form-item label="Bugün yapılan" required>
              <el-input v-model="form.quantity" inputmode="decimal" placeholder="3,5" aria-label="Bugün yapılan" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="Birim"><el-input :model-value="item.unit" disabled /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="Çalışan sayısı">
              <el-input-number v-model="form.workerCount" :min="1" :max="999" :controls="false" align="left"
                placeholder="12" class="entry__wide" aria-label="Çalışan sayısı" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tarih" required>
              <el-date-picker v-model="form.day" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY"
                :clearable="false" :disabled-date="isFuture" class="entry__wide" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Açıklama / not">
          <el-input v-model="form.note" type="textarea" :rows="3" maxlength="500" show-word-limit
            placeholder="A Blok 4. kat donatı tamamlandı." />
        </el-form-item>
        <el-form-item label="Fotoğraf / belge">
          <el-upload ref="upload" v-model:file-list="files" drag multiple list-type="picture-card" :auto-upload="false"
            :accept="ENTRY_FILE_ACCEPT" :limit="ENTRY_FILE_LIMIT" :on-change="onPicked"
            :on-exceed="() => ElMessage.warning(`En fazla ${ENTRY_FILE_LIMIT} dosya eklenebilir.`)">
            <el-space direction="vertical" :size="4"><ImagePlus :size="22" /><span>Fotoğraf / PDF</span></el-space>
            <template #file="{ file }">
              <div class="entry__file">
                <img v-if="isImage(file)" class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <el-space v-else direction="vertical" :size="4" class="entry__doc">
                  <FileText :size="26" /><el-text size="small" truncated>{{ file.name }}</el-text>
                </el-space>
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete" @click="upload?.handleRemove(file)"><Trash2 :size="18" /></span>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-space :size="12" alignment="flex-start">
          <el-switch v-model="form.onField" aria-label="Saha akışına yansıt" />
          <div class="entry__title">
            <el-text tag="b">Saha akışına yansıt</el-text>
            <el-text size="small" type="info">Açıksa bu giriş Saha'da çalışanlar dahil herkese görünür.</el-text>
          </div>
        </el-space>
      </el-form>
    </template>
    <template #footer>
      <el-text v-if="tried && problem" type="danger" size="small" class="entry__problem">{{ problem }}</el-text>
      <el-button @click="show = false">İptal</el-button>
      <el-button type="primary" :loading="isSaving" @click="submit">Güncellemeyi kaydet</el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
.entry__card {
  margin-top: var(--space-3);
}

.entry__title {
  display: grid;
}

.entry__figures {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.entry__form {
  margin-top: var(--space-4);
}

.entry__wide {
  width: 100%;
}

/* PDF karesi: simge ve adı ortada (Element Plus'ın resim karesinin içinde). */
.entry__file,
.entry__doc {
  width: 100%;
  height: 100%;
}

.entry__doc {
  justify-content: center;
  padding: var(--space-2);
  color: var(--text-muted);
}

.entry__problem {
  margin-right: var(--space-3);
}
</style>
