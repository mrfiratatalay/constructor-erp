<script setup lang="ts">
import { computed, ref } from 'vue'
import { rangeLabel } from '@/core/materials/dateRanges'
import { materialExportUrl, REPORT_SHEETS, type ReportSheet } from '@/core/materials/materialExport'
import type { MovementFilters } from '@/core/materials/movementQuery'

/**
 * Excel: ekrandaki süzgeçlerle (tarih, tür, lokasyon, durum, arama) tek çalışma kitabı; sayfalar seçilir. Süzgeçleri
 * değiştirmek için önce liste süzülür, sonra buradan indirilir. Dosya sunucuda oluşur, telefon indirir.
 */
const open = defineModel<boolean>('open', { required: true })
const { filters } = defineProps<{ filters: MovementFilters }>()
const sheets = ref<ReportSheet[]>(REPORT_SHEETS.map((sheet) => sheet.key))
const url = computed(() => materialExportUrl(filters, sheets.value))
</script>

<template>
  <van-popup v-model:show="open" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <div class="export-sheet">
      <h3>Excel raporu</h3>
      <van-checkbox-group v-model="sheets">
        <van-cell-group inset title="Sayfalar">
          <van-cell v-for="sheet in REPORT_SHEETS" :key="sheet.key" :title="sheet.label" :label="sheet.hint" center>
            <template #right-icon><van-checkbox :name="sheet.key" /></template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <van-cell-group inset title="Süzgeçler (listeden gelir)">
        <van-cell title="Tarih" :value="rangeLabel(filters.preset, filters)" />
      </van-cell-group>
      <van-button type="primary" round block tag="a" :url="url" :disabled="!sheets.length" icon="down"
        @click="open = false">
        Excel indir
      </van-button>
    </div>
  </van-popup>
</template>

<style scoped>
.export-sheet {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.export-sheet h3 {
  margin: 0;
}
</style>
