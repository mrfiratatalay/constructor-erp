<script setup lang="ts">
import { ref } from 'vue'
import { monthKey } from '@/core/format/dates'
import { rollCallExportUrl } from '@/core/rollcall/rollCallQueries'

/**
 * Yoklamanın Excel dosyası, alttan: ay ve yıl seçilir (bu ay hazır gelir, gelecek aylar yoktur), "İndir"
 * dosyayı indirir ("yoklama-2026-09.xlsx"). Seçici iki yıl geriye gider.
 */
const show = defineModel<boolean>('show', { required: true })
const [year, month] = monthKey().split('-')
const picked = ref<string[]>([year!, month!])
const today = new Date()
const minDate = new Date(today.getFullYear() - 2, 0, 1)

/** Bağlantı gibi indirilir (download): sayfa yerinde kalır, dosya iner. */
function download() {
  const link = document.createElement('a')
  link.href = rollCallExportUrl(picked.value.join('-'))
  link.download = ''
  link.click()
  show.value = false
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round teleport="body">
    <van-date-picker v-model="picked" title="Hangi ayın yoklaması?" :columns-type="['year', 'month']"
      :min-date="minDate" :max-date="today" confirm-button-text="İndir" cancel-button-text="Vazgeç"
      @confirm="download" @cancel="show = false" />
  </van-popup>
</template>
