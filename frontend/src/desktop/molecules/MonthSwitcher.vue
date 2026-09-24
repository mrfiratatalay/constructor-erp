<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { monthTitle, shiftMonth } from '@/core/format/dates'

/** "‹ Eylül 2026 ›": geçmiş aylara gidilir; gelecek ay yoktur, ileri düğmesi bu ayda kapanır. */
const { month, canGoForward } = defineProps<{ month: string; canGoForward: boolean }>()
const emit = defineEmits<{ change: [month: string] }>()
</script>

<template>
  <div class="month-switcher">
    <el-button circle aria-label="Önceki ay" @click="emit('change', shiftMonth(month, -1))">
      <ChevronLeft :size="16" />
    </el-button>
    <strong class="month-switcher__title">{{ monthTitle(month) }}</strong>
    <el-button circle aria-label="Sonraki ay" :disabled="!canGoForward" @click="emit('change', shiftMonth(month, 1))">
      <ChevronRight :size="16" />
    </el-button>
  </div>
</template>

<style scoped>
.month-switcher {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Ay adı değişince düğmeler yerinden oynamasın: en uzun ad ("Ağustos 2026") kadar yer. */
.month-switcher__title {
  min-width: 112px;
  font-weight: var(--weight-bold);
  text-align: center;
}
</style>
