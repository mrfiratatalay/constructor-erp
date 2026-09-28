<script setup lang="ts">
import { dayOfMonth } from '@/core/puantaj/puantajDays'
import type { MarkLike } from '@/core/puantaj/puantajLabels'
import MarkTag from '@/desktop/atoms/MarkTag.vue'

/**
 * Ayın takvimi: her günde o günün işareti (renkli, kısa). Güne tıklayınca altta ayrıntısı açılır; takvimin kendi
 * düğmeleriyle önceki ya da sonraki aya geçilir. Yalnızca gösterilen ayın işaretleri bilinir.
 */
const date = defineModel<Date>({ required: true })
const { marks } = defineProps<{ marks: Record<string, MarkLike> }>()
</script>

<template>
  <el-calendar v-model="date">
    <template #date-cell="{ data }">
      <el-space direction="vertical" alignment="flex-start" :size="6">
        <el-text :type="data.type === 'current-month' ? undefined : 'info'">{{ dayOfMonth(data.day) }}</el-text>
        <MarkTag v-if="data.type === 'current-month' && marks[data.day]" :mark="marks[data.day]!" compact />
      </el-space>
    </template>
  </el-calendar>
</template>
