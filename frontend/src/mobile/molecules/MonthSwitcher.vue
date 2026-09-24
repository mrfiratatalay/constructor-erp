<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { monthTitle, shiftMonth } from '@/core/format/dates'

/** "‹ Eylül 2026 ›": geçmiş aylara gidilir; gelecek ay yoktur, ileri düğmesi bu ayda kapanır. */
const { month, canGoForward } = defineProps<{ month: string; canGoForward: boolean }>()
const emit = defineEmits<{ change: [month: string] }>()
</script>

<template>
  <div class="month-switcher">
    <van-button round size="small" aria-label="Önceki ay" @click="emit('change', shiftMonth(month, -1))">
      <ChevronLeft :size="18" />
    </van-button>
    <strong>{{ monthTitle(month) }}</strong>
    <van-button round size="small" aria-label="Sonraki ay" :disabled="!canGoForward"
      @click="emit('change', shiftMonth(month, 1))">
      <ChevronRight :size="18" />
    </van-button>
  </div>
</template>

<style scoped>
.month-switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.month-switcher strong {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
}

/* Parmakla basılacak kadar büyük, yuvarlak ok düğmeleri. */
.month-switcher :deep(.van-button) {
  width: 40px;
  height: 40px;
  padding: 0;
}
</style>
