<script setup lang="ts">
import { monthTitle, shiftMonth } from '@/core/format/dates'

/** Ay seçici: ‹ Eylül 2026 ›. Gelecek aya gidilmez (henüz yaşanmamış ayın puantajı olmaz). */
const { month, isCurrentMonth } = defineProps<{ month: string; isCurrentMonth: boolean }>()
const emit = defineEmits<{ change: [month: string] }>()
</script>

<template>
  <van-row justify="space-between" align="center">
    <van-button icon="arrow-left" size="small" round plain aria-label="Önceki ay"
      @click="emit('change', shiftMonth(month, -1))" />
    <b>{{ monthTitle(`${month}-01`) }}</b>
    <van-button icon="arrow" size="small" round plain aria-label="Sonraki ay" :disabled="isCurrentMonth"
      @click="emit('change', shiftMonth(month, 1))" />
  </van-row>
</template>
