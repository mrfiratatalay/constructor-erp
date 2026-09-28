<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { TableInstance } from 'element-plus'
import type { PuantajRow } from '@/core/puantaj/puantajBook'
import type { DayStatus } from '@/core/puantaj/puantajLabels'
import type { MarkDraft } from '@/core/puantaj/markDraft'
import EntryName from '@/desktop/molecules/EntryName.vue'
import MarkPicker from '@/desktop/molecules/MarkPicker.vue'
import NoteCell from '@/desktop/molecules/NoteCell.vue'
import OvertimeCell from '@/desktop/molecules/OvertimeCell.vue'
import RecentDays from '@/desktop/molecules/RecentDays.vue'
import RowActions from '@/desktop/molecules/RowActions.vue'

/**
 * Bugünün cetveli; her satır kâğıt puantajın bir satırı gibi bir form satırıdır ve işaretlenince şekil değiştirmez:
 * ad, son günler şeridi, bugünün durumu (düğmeler hep açık, seçili olan kendi renginde dolu), mesai (Geldi gününde) ve
 * not (satırda yazılır), en sağda ⋯. Ad solda, ⋯ sağda sabit. İşaretlenmemiş satırlar kutularıyla seçilip alttaki
 * şeritten tek hamlede işaretlenir: işaretli satır seçilemez, seçili satırın zemini hafif lacivert.
 */
const { rows, days, today, canMark } = defineProps<{
  rows: PuantajRow[]
  days: string[]
  today: string
  canMark: boolean
}>()
const emit = defineEmits<{
  select: [entryIds: string[]]
  open: [entryId: string, day?: string]
  update: [entryId: string, change: Partial<MarkDraft>]
  clear: [entryId: string]
}>()
const table = ref<TableInstance>()
const selectedIds = ref<string[]>([])
const pastDays = computed(() => days.filter((day) => day !== today))
/**
 * Şerit sütunu: her daire çerçeve ve tıklama payıyla 26 px, aralarında 4 px, iç boşluk 24 px; başlık "Son günler"
 * sığsın. Sütun genişlikleri 1470 px dizüstünde satırın tamamı kaydırmadan sığacak biçimde hesaplıdır.
 */
const recentWidth = computed(() => Math.max(112, pastDays.value.length * 30 + 20))
const rowKey = (row: PuantajRow) => row.entry.id
const selectable = (row: PuantajRow) => !row.entry.archived && !row.marks[today]
/** Tablo yuvasının satırı genel tiptedir (Element Plus satır tipini yuvaya taşımaz); bizim satırımızdır. */
const locked = (row: unknown) => !canMark || (row as PuantajRow).entry.archived

function onSelect(selected: PuantajRow[]) {
  selectedIds.value = selected.map(rowKey)
  emit('select', selectedIds.value)
}

const SELECTED_ROW = { background: 'var(--el-color-primary-light-9)' }
const rowCellStyle = ({ row }: { row: PuantajRow }) => (selectedIds.value.includes(row.entry.id) ? SELECTED_ROW : {})

/** Seçiliyken tek başına işaretlenen satır seçimden düşer: toplu işaretleme onu ezmesin. */
watch(
  () => rows,
  (next) => next.filter((row) => row.marks[today] && selectedIds.value.includes(row.entry.id))
    .forEach((row) => table.value?.toggleRowSelection(row, false)),
)

/** Seçim şeridindeki adın ×'i: o satır seçimden çıkar. */
function deselect(entryId: string) {
  const row = rows.find((candidate) => candidate.entry.id === entryId)
  if (row) table.value?.toggleRowSelection(row, false)
}

defineExpose({ clearSelection: () => table.value?.clearSelection(), deselect })
</script>

<template>
  <el-table ref="table" :data="rows" :row-key="rowKey" empty-text="Bu süzgeçte kimse yok" :cell-style="rowCellStyle"
    @selection-change="onSelect">
    <el-table-column v-if="canMark" type="selection" width="44" fixed :selectable="selectable" />
    <el-table-column label="Ad" width="200" fixed>
      <template #default="{ row }"><EntryName :entry="row.entry" @open="emit('open', row.entry.id)" /></template>
    </el-table-column>
    <el-table-column v-if="pastDays.length" label="Son günler" :width="recentWidth">
      <template #default="{ row }">
        <RecentDays :days="pastDays" :marks="row.marks" @open="(day) => emit('open', row.entry.id, day)" />
      </template>
    </el-table-column>
    <!-- Düğme grubu 336 px: daha darda "İzinli" alt satıra düşüyordu. -->
    <el-table-column label="Bugün" width="360">
      <template #default="{ row }">
        <MarkPicker :kind="row.entry.kind" :current="row.marks[today]?.status" size="default"
          :disabled="locked(row)" @choose="(status: DayStatus) => emit('update', row.entry.id, { status })" />
      </template>
    </el-table-column>
    <el-table-column label="Mesai" width="148">
      <template #default="{ row }">
        <OvertimeCell :mark="row.marks[today]" :disabled="locked(row)"
          @change="(hours) => emit('update', row.entry.id, { overtimeHours: hours })" />
      </template>
    </el-table-column>
    <el-table-column label="Not" min-width="170">
      <template #default="{ row }">
        <NoteCell :mark="row.marks[today]" :disabled="locked(row)"
          @change="(note) => emit('update', row.entry.id, { note })" />
      </template>
    </el-table-column>
    <el-table-column width="56" align="center" fixed="right">
      <template #default="{ row }">
        <RowActions :mark="row.marks[today]" :can-mark="!locked(row)" @details="emit('open', row.entry.id)"
          @clear="emit('clear', row.entry.id)" />
      </template>
    </el-table-column>
  </el-table>
</template>
