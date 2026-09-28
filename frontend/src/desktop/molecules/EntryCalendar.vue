<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CalendarInstance } from 'element-plus'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { isoDayOf, monthKey, monthTitle } from '@/core/format/dates'
import { dayOfMonth } from '@/core/puantaj/puantajDays'
import type { MarkLike } from '@/core/puantaj/puantajLabels'
import MarkDot from '@/desktop/atoms/MarkDot.vue'

/**
 * Ayın takvimi: her günde o günün işareti, cetveldeki dairenin aynısı (mesai köşesinde nokta, saati üstüne gelince).
 * Başlık takvimin kendi yuvasıyla: solda "Eylül 2026", sağda ‹ Bugün ›; gelecek aya gidilmez. Güne tıklayınca yanında
 * ayrıntısı açılır. Hücreler sıkı (tema: 64 px), ayrıntı kaydırmadan görünür.
 */
const date = defineModel<Date>({ required: true })
const { marks } = defineProps<{ marks: Record<string, MarkLike> }>()
const calendar = ref<CalendarInstance>()
const isCurrentMonth = computed(() => monthKey(isoDayOf(date.value)) >= monthKey())
</script>

<template>
  <el-calendar ref="calendar" v-model="date">
    <template #header>
      <el-text tag="b" size="large">{{ monthTitle(isoDayOf(date)) }}</el-text>
      <el-button-group size="small">
        <el-button :icon="ChevronLeft" aria-label="Önceki ay" @click="calendar?.selectDate('prev-month')" />
        <el-button @click="calendar?.selectDate('today')">Bugün</el-button>
        <el-button :icon="ChevronRight" aria-label="Sonraki ay" :disabled="isCurrentMonth"
          @click="calendar?.selectDate('next-month')" />
      </el-button-group>
    </template>
    <template #date-cell="{ data }">
      <el-space direction="vertical" alignment="flex-start" :size="6">
        <el-text :type="data.type === 'current-month' ? undefined : 'info'">{{ dayOfMonth(data.day) }}</el-text>
        <MarkDot v-if="data.type === 'current-month' && marks[data.day]" :mark="marks[data.day]" />
      </el-space>
    </template>
  </el-calendar>
</template>
