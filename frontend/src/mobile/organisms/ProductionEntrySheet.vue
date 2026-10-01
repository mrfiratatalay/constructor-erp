<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showNotify, type UploaderFileListItem } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { ProductionItemView } from '@/core/api/generated/model'
import { ENTRY_FILE_ACCEPT, ENTRY_FILE_LIMIT, entryFileProblem } from '@/core/production/entryFiles'
import { barPercent, entryAmount, percentLabel, progressLine } from '@/core/production/productionFormat'
import { useProductionEntry } from '@/core/production/useProductionEntry'
import { confirmAction } from '@/mobile/confirmAction'
import DateField from '@/mobile/molecules/DateField.vue'
import TradeIcon from '@/shared/atoms/TradeIcon.vue'

/**
 * "Günlük İlerleme", alttan: sahanın en sık işi, "Demir → Güncelle → 3,5 → Kaydet". Miktar kutusu
 * telefonun sayı klavyesini açar ve virgülü kabul eder; birim imalatındır. Çalışan sayısı, tarih (ileri gün yok),
 * not, fotoğraf ve PDF, "Saha akışına yansıt" (kapalı gelir). Toplamı aşan giriş sorulur.
 */
const show = defineModel<boolean>('show', { required: true })
const { siteId, item } = defineProps<{ siteId: string; item: ProductionItemView | null }>()
const { form, reset, save, problem, overflow, quantity, isSaving } = useProductionEntry(() => siteId)
const files = ref<UploaderFileListItem[]>([])
const workers = computed({
  get: () => form.workerCount?.toString() ?? '',
  set: (text: string) => (form.workerCount = text ? Number(text) : undefined),
})

watch(show, (open) => {
  if (!open) return
  reset()
  files.value = []
})

/** Fotoğraf ve PDF dışındaki dosya eklenmez; nedeni söylenir. */
function acceptable(picked: File | File[]) {
  const problems = [picked].flat().map(entryFileProblem).filter(Boolean)
  if (problems.length) showFailToast(problems.join('\n'))
  return problems.length === 0
}

const confirmOverflow = (message: string) =>
  confirmAction({ title: 'Toplamı aşıyor', message, confirm: 'Evet, kaydet', danger: false })

async function submit() {
  if (!item) return
  if (problem.value) return showFailToast(problem.value)
  const question = overflow(item)
  if (question && !(await confirmOverflow(question))) return
  try {
    await save(item, files.value.flatMap((file) => (file.file ? [file.file] : [])))
    const field = form.onField ? ' Saha akışına da eklendi.' : ''
    showNotify({ type: 'success', message: `İlerleme kaydedildi: ${item.name} ${entryAmount(quantity.value, item.unit)}.${field}` })
    show.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-action-sheet v-model:show="show" title="Günlük İlerleme" teleport="body">
    <van-form v-if="item" label-width="8.5em" @submit="submit">
      <van-cell-group inset>
        <van-cell center :title="item.name" :label="`Taşeron: ${item.crew?.name ?? 'atanmadı'}`">
          <template #icon><TradeIcon :trade="item.trade" :size="40" class="entry-sheet__icon" /></template>
        </van-cell>
        <van-cell>
          <template #title>
            <div class="entry-sheet__figures">
              <strong>{{ progressLine(item) }}</strong><strong>{{ percentLabel(item.percent) }}</strong>
            </div>
            <van-progress :percentage="barPercent(item.percent)" :show-pivot="false" stroke-width="8" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset class="entry-sheet__group">
        <van-field v-model="form.quantity" label="Bugün yapılan" inputmode="decimal" placeholder="3,5" required
          aria-label="Bugün yapılan">
          <template #extra>{{ item.unit }}</template>
        </van-field>
        <van-field v-model="workers" label="Çalışan sayısı" type="digit" maxlength="3" placeholder="12" />
        <DateField v-model="form.day" label="Tarih" required />
        <van-field v-model="form.note" label="Not" type="textarea" rows="2" autosize maxlength="500" show-word-limit
          placeholder="A Blok 4. kat donatı tamamlandı." />
        <van-field label="Fotoğraf / belge">
          <template #input>
            <van-uploader v-model="files" multiple :accept="ENTRY_FILE_ACCEPT" :max-count="ENTRY_FILE_LIMIT"
              :before-read="acceptable" upload-text="Ekle" />
          </template>
        </van-field>
        <van-cell center title="Saha akışına yansıt" label="Açıksa Saha'da çalışanlar dahil herkese görünür.">
          <template #right-icon><van-switch v-model="form.onField" aria-label="Saha akışına yansıt" /></template>
        </van-cell>
      </van-cell-group>
      <div class="entry-sheet__submit">
        <van-button type="primary" native-type="submit" block round :loading="isSaving">Güncellemeyi kaydet</van-button>
      </div>
    </van-form>
  </van-action-sheet>
</template>

<style scoped>
.entry-sheet__icon {
  margin-right: var(--space-3);
}

.entry-sheet__figures {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  color: var(--text-strong);
}

.entry-sheet__group {
  margin-top: var(--space-3);
}

.entry-sheet__submit {
  padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom));
}
</style>
