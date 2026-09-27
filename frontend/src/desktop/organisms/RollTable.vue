<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableInstance } from 'element-plus'
import type { PuantajRow } from '@/core/puantaj/puantajBook'
import { dayOfMonth, weekdayShort } from '@/core/puantaj/puantajDays'
import type { DayStatus } from '@/core/puantaj/puantajLabels'
import MarkTag from '@/desktop/atoms/MarkTag.vue'
import EntryName from '@/desktop/molecules/EntryName.vue'
import TodayMarkCell from '@/desktop/molecules/TodayMarkCell.vue'

/**
 * Bugünün cetveli (haftalık görünüm): satırda kişi ya da ekip, sütunlarda son günler (yalnızca okunur, şef dünü
 * görerek işaretler) ve en sağda işaretlenen bugün. Soldaki kutularla birkaç satır seçilip tek hamlede işaretlenir.
 */
const { rows, days, today, canMark } = defineProps<{
  rows: PuantajRow[]
  days: string[]
  today: string
  canMark: boolean
}>()
const emit = defineEmits<{
  select: [entryIds: string[]]
  open: [entryId: string]
  choose: [entryId: string, status: DayStatus]
  details: [entryId: string]
  clear: [entryId: string]
}>()
const table = ref<TableInstance>()
const pastDays = computed(() => days.filter((day) => day !== today))
const rowKey = (row: PuantajRow) => row.entry.id
const onSelect = (selected: PuantajRow[]) => emit('select', selected.map(rowKey))

defineExpose({ clearSelection: () => table.value?.clearSelection() })
</script>

<template>
  <el-table ref="table" :data="rows" :row-key="rowKey" empty-text="Bu bölümde kimse yok" @selection-change="onSelect">
    <el-table-column v-if="canMark" type="selection" width="44" fixed
      :selectable="(row: PuantajRow) => !row.entry.archived" />
    <el-table-column label="Ad" min-width="230" fixed>
      <template #default="{ row }">
        <EntryName :entry="row.entry" @open="emit('open', row.entry.id)" />
      </template>
    </el-table-column>
    <el-table-column v-for="day in pastDays" :key="day" align="center" min-width="112"
      :label="`${weekdayShort(day)} ${dayOfMonth(day)}`">
      <template #default="{ row }">
        <MarkTag v-if="row.marks[day]" :mark="row.marks[day]" />
        <el-text v-else type="info">—</el-text>
      </template>
    </el-table-column>
    <el-table-column min-width="340" :label="`Bugün · ${weekdayShort(today)} ${dayOfMonth(today)}`">
      <template #default="{ row }">
        <TodayMarkCell :entry="row.entry" :mark="row.marks[today]" :disabled="!canMark || row.entry.archived"
          @choose="(status) => emit('choose', row.entry.id, status)" @details="emit('details', row.entry.id)"
          @clear="emit('clear', row.entry.id)" />
      </template>
    </el-table-column>
  </el-table>
</template>
