<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { TableInstance } from 'element-plus'
import { rowTotals, type PuantajRow, type RowTotals } from '@/core/puantaj/puantajBook'
import { isSunday } from '@/core/puantaj/puantajDays'
import { hoursText } from '@/core/puantaj/puantajLabels'
import DayColumnTitle from '@/desktop/atoms/DayColumnTitle.vue'
import MarkDot from '@/desktop/atoms/MarkDot.vue'
import EntryName from '@/desktop/molecules/EntryName.vue'

/**
 * Ayın cetveli (şantiyelerin kâğıt puantajı): satırda kişi ya da ekip, sütunda ayın günleri, hücrede daire (mesai
 * köşesinde nokta). Izgara çizgili, rahat boyda (dizüstünde küçük yazı okunmuyordu); gün sütunları esnek: geniş ekranda
 * kartın tamamına yayılır, dar ekranda cetvel açılınca bugüne kayar. Pazar sütunu soluk. Sağda sabit toplamlar:
 * çalıştığı gün, mesai, gelmedi, izinli (ekipte geldiği ve gelmediği gün); en altta ayın toplamı. Bir hücreye
 * tıklayınca kişinin ayı o gün seçili açılır.
 */
const { rows, days, kind, focusDay = null } = defineProps<{
  rows: PuantajRow[]
  days: string[]
  kind: 'PERSON' | 'CREW'
  focusDay?: string | null
}>()
const emit = defineEmits<{ open: [entryId: string, day?: string] }>()
const table = ref<TableInstance>()
const NAME_WIDTH = 220
/**
 * Gün sütununun en dar hali: hücrenin iç boşluğu 12+12 px, daire çerçevesiyle 22 px; daha darda "…" ile kesilir.
 * Yer varsa sütunlar genişler (min-width); kaydırma yalnızca en dar halde gerekir, hesap bu genişlikle yapılır.
 */
const DAY_WIDTH = 46
const totalsWidth = () => (kind === 'PERSON' ? 96 + 76 + 56 + 56 : 96 + 56)

const countText = (count: number) => (count ? hoursText(count) : '—')
const overtimeText = (totals: RowTotals) => (totals.overtime ? `${hoursText(totals.overtime)} s` : '—')
const SUNDAY = { background: 'var(--el-fill-color-light)' }
const sundayStyle = ({ column }: { column: { property?: string } }) =>
  column.property && isSunday(column.property) ? SUNDAY : {}

function onCellClick(row: PuantajRow, column: { property?: string }) {
  const day = column.property && days.includes(column.property) ? column.property : undefined
  emit('open', row.entry.id, day)
}

/** Sığmayan ekranda bugünün sütunu (ve ardından iki gün) görünür olsun: ayın en çok bakılan yeri son günlerdir. */
function scrollToFocus() {
  const index = focusDay ? days.indexOf(focusDay) : -1
  const width = (table.value?.$el as HTMLElement | undefined)?.clientWidth ?? 0
  if (index < 0 || !width) return
  table.value?.setScrollLeft(Math.max(0, NAME_WIDTH + (index + 3) * DAY_WIDTH - (width - totalsWidth())))
}
/** Element Plus sütun genişliklerini bir sonraki karede hesaplar; kaydırma ondan sonra yapılır, yoksa etkisiz kalır. */
const scrollWhenLaidOut = () => nextTick(() => requestAnimationFrame(() => requestAnimationFrame(scrollToFocus)))
onMounted(scrollWhenLaidOut)
watch([() => focusDay, () => rows.length], scrollWhenLaidOut)

/** Toplam satırı: yalnızca toplam sütunları toplanır, gün sütunları boş kalır. */
function summary({ columns }: { columns: { property?: string }[] }): string[] {
  const totals = rows.map(rowTotals)
  const sum = (key: keyof RowTotals) => totals.reduce((all, total) => all + total[key], 0)
  return columns.map((column, index) => {
    if (index === 0) return 'Toplam'
    if (column.property === 'overtime') return `${hoursText(sum('overtime'))} s`
    const key = column.property as keyof RowTotals | undefined
    return key && ['worked', 'absent', 'leave'].includes(key) ? hoursText(sum(key)) : ''
  })
}
</script>

<template>
  <el-table ref="table" :data="rows" :row-key="(row: PuantajRow) => row.entry.id" border show-summary
    :summary-method="summary" :cell-style="sundayStyle" empty-text="Bu bölümde kimse yok" @cell-click="onCellClick">
    <el-table-column :label="kind === 'CREW' ? 'Ekip' : 'Ad'" :width="NAME_WIDTH" fixed>
      <template #default="{ row }"><EntryName :entry="row.entry" /></template>
    </el-table-column>
    <el-table-column v-for="day in days" :key="day" :property="day" align="center" :min-width="DAY_WIDTH">
      <template #header><DayColumnTitle :day="day" /></template>
      <template #default="{ row }"><MarkDot v-if="row.marks[day]" :mark="row.marks[day]" /></template>
    </el-table-column>
    <el-table-column property="worked" :label="kind === 'CREW' ? 'Geldiği gün' : 'Çalıştığı gün'" width="96"
      align="center" fixed="right">
      <template #default="{ row }">
        <el-text tag="b" size="large">{{ hoursText(rowTotals(row as PuantajRow).worked) }}</el-text>
      </template>
    </el-table-column>
    <el-table-column v-if="kind === 'PERSON'" property="overtime" label="Mesai" width="76" align="center"
      fixed="right">
      <template #default="{ row }">
        <el-text type="primary">{{ overtimeText(rowTotals(row as PuantajRow)) }}</el-text>
      </template>
    </el-table-column>
    <el-table-column property="absent" width="56" align="center" fixed="right">
      <template #header><MarkDot :mark="{ status: 'ABSENT' }" /></template>
      <template #default="{ row }">{{ countText(rowTotals(row as PuantajRow).absent) }}</template>
    </el-table-column>
    <el-table-column v-if="kind === 'PERSON'" property="leave" width="56" align="center" fixed="right">
      <template #header><MarkDot :mark="{ status: 'LEAVE' }" /></template>
      <template #default="{ row }">{{ countText(rowTotals(row as PuantajRow).leave) }}</template>
    </el-table-column>
  </el-table>
</template>
