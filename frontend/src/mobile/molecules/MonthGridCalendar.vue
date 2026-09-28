<script setup lang="ts">
import { computed } from 'vue'
import { monthGrid, WEEKDAY_HEADERS } from '@/core/puantaj/monthGrid'
import { dayOfMonth } from '@/core/puantaj/puantajDays'
import type { MarkLike } from '@/core/puantaj/puantajLabels'
import MarkTag from '@/mobile/atoms/MarkTag.vue'

/**
 * Ayın takvimi, yedi sütunlu ızgara (Pazartesi başta): her günde numarası ve işareti. Güne dokununca ayrıntısı
 * açılır; ileri günler seçilmez.
 */
const { month, marks, today } = defineProps<{ month: string; marks: Record<string, MarkLike>; today: string }>()
const emit = defineEmits<{ pick: [day: string] }>()
const cells = computed(() => monthGrid(month))
</script>

<template>
  <van-grid :column-num="7" :border="false">
    <van-grid-item v-for="weekday in WEEKDAY_HEADERS" :key="weekday" :text="weekday" />
    <van-grid-item v-for="cell in cells" :key="cell.key" :clickable="!!cell.day && cell.day <= today"
      @click="cell.day && cell.day <= today && emit('pick', cell.day)">
      <template v-if="cell.day">
        <b v-if="cell.day === today">{{ dayOfMonth(cell.day) }}</b>
        <span v-else>{{ dayOfMonth(cell.day) }}</span>
        <MarkTag v-if="marks[cell.day]" :mark="marks[cell.day]!" compact />
      </template>
    </van-grid-item>
  </van-grid>
</template>
