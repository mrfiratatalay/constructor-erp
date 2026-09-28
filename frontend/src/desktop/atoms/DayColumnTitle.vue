<script setup lang="ts">
import { computed } from 'vue'
import { todayIsoDate } from '@/core/format/dates'
import { dayOfMonth, isSunday, weekdayShort } from '@/core/puantaj/puantajDays'

/**
 * Cetvelde bir günün sütun başlığı, iki satır: üstte gün adı, altında kalın gün numarası. Dar sütunda "Çar 23" satır
 * ortasından kırılıyordu; iki satır her genişlikte aynı durur. Bugün lacivert (cetvelde nerede olduğun belli olur),
 * gelecek günler ve Pazar soluk.
 */
const { day } = defineProps<{ day: string }>()
const today = todayIsoDate()
const tone = computed(() => {
  if (day === today) return 'primary'
  return day > today || isSunday(day) ? 'info' : undefined
})
</script>

<template>
  <el-space direction="vertical" :size="0">
    <el-text size="small" :type="day === today ? 'primary' : 'info'">{{ weekdayShort(day) }}</el-text>
    <el-text :type="tone" tag="b">{{ dayOfMonth(day) }}</el-text>
  </el-space>
</template>
