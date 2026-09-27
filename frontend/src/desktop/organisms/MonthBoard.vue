<script setup lang="ts">
import { computed } from 'vue'
import { Download } from 'lucide-vue-next'
import { isoDayOf, monthKey } from '@/core/format/dates'
import { STATUS_LOOKS, type DayStatus } from '@/core/puantaj/puantajLabels'
import { useMonthPuantaj } from '@/core/puantaj/useMonthPuantaj'
import MonthTable from '@/desktop/organisms/MonthTable.vue'

/**
 * Puantaj sekmesi, ay sonunun ekranı: ay seçici, işaretlerin açıklaması, patrona Excel; altında Personel ve
 * Taşeron ekipler cetveli. Gelecek aya gidilmez. Bir ada tıklayınca o kişinin ya da ekibin ayı sağdan açılır.
 */
const emit = defineEmits<{ open: [entryId: string] }>()
const { month, setMonth, days, book, isPending, canExport, exportUrl } = useMonthPuantaj()
const LEGEND = (Object.keys(STATUS_LOOKS) as DayStatus[]).map((status) => STATUS_LOOKS[status])
const picked = computed({ get: () => month.value, set: (next: string) => void setMonth(next) })
const isFutureMonth = (date: Date) => isoDayOf(date).slice(0, 7) > monthKey()
</script>

<template>
  <el-row justify="space-between" align="middle">
    <el-space :size="16" wrap>
      <el-date-picker v-model="picked" type="month" value-format="YYYY-MM" format="MMMM YYYY" :clearable="false"
        :disabled-date="isFutureMonth" />
      <el-space :size="6" wrap>
        <el-tag v-for="look in LEGEND" :key="look.label" :type="look.tone" size="small" round disable-transitions>
          {{ look.short }} {{ look.label }}
        </el-tag>
        <el-text type="info" size="small">✓+2: 2 saat mesai</el-text>
      </el-space>
    </el-space>
    <el-button v-if="canExport" tag="a" :href="exportUrl" type="primary" :icon="Download">Excel indir</el-button>
  </el-row>
  <el-skeleton v-if="isPending" :rows="8" animated />
  <template v-else>
    <el-divider content-position="left">Personel · {{ book.people.length }}</el-divider>
    <MonthTable :rows="book.people" :days="days" kind="PERSON" @open="emit('open', $event)" />
    <el-divider content-position="left">Taşeron ekipler · {{ book.crews.length }}</el-divider>
    <MonthTable :rows="book.crews" :days="days" kind="CREW" @open="emit('open', $event)" />
  </template>
</template>
