<script setup lang="ts">
import { ref } from 'vue'
import { Download } from 'lucide-vue-next'
import { monthKey } from '@/core/format/dates'
import { isExportableMonth, rollCallExportUrl } from '@/core/rollcall/rollCallQueries'

/**
 * Yoklamanın Excel dosyası: ay seçilir (bu ay hazır gelir, gelecek aylar kapalı), "İndir" düz bir bağlantıdır:
 * tarayıcı dosyayı indirir ("yoklama-2026-09.xlsx"). Ay seçicinin paneli pencerenin içinde açılır: dışarıda
 * açılsaydı ona tıklamak pencereyi kapatırdı.
 */
const month = ref(monthKey())
const isFuture = (date: Date) => !isExportableMonth(date)
</script>

<template>
  <el-popover trigger="click" placement="bottom-end" :width="260">
    <template #reference>
      <el-button size="small"><Download :size="15" />&nbsp;Excel</el-button>
    </template>
    <div class="excel-export">
      <span class="excel-export__label">Hangi ayın yoklaması?</span>
      <el-date-picker v-model="month" type="month" value-format="YYYY-MM" format="MMMM YYYY" :clearable="false"
        :disabled-date="isFuture" :teleported="false" aria-label="Ay" />
      <el-button tag="a" type="primary" :href="rollCallExportUrl(month)" download>İndir</el-button>
    </div>
  </el-popover>
</template>

<style scoped>
.excel-export {
  display: grid;
  gap: var(--space-3);
}

.excel-export__label {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.excel-export :deep(.el-date-editor) {
  width: 100%;
}

.excel-export .el-button {
  margin: 0;
}
</style>
