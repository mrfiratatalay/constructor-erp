<script setup lang="ts">
import type { PuantajRow } from '@/core/puantaj/puantajBook'
import { rowTotals } from '@/core/puantaj/puantajBook'
import { dayOfMonth, weekdayShort } from '@/core/puantaj/puantajDays'
import { hoursText } from '@/core/puantaj/puantajLabels'
import MarkTag from '@/desktop/atoms/MarkTag.vue'
import EntryName from '@/desktop/molecules/EntryName.vue'

/**
 * Ayın cetveli (şantiyelerin kâğıt puantajı): satırda kişi ya da ekip, sütunda ayın günleri, hücrede kısa işaret
 * (✓ ½ ✕ İ, mesaiyle "✓+2"). Ad solda, toplamlar sağda sabit durur; günler arada kayar. Personelde çalıştığı gün
 * (yarım gün yarım sayılır) ve mesai; ekipte geldiği gün. En alttaki satır ayın toplamı.
 */
const { rows, days, kind } = defineProps<{ rows: PuantajRow[]; days: string[]; kind: 'PERSON' | 'CREW' }>()
const emit = defineEmits<{ open: [entryId: string] }>()

const workedText = (row: PuantajRow) => hoursText(rowTotals(row).worked)
const overtimeText = (row: PuantajRow) => {
  const overtime = rowTotals(row).overtime
  return overtime ? `${hoursText(overtime)} s` : '—'
}

/** Toplam satırı: yalnızca toplam sütunları toplanır, gün sütunları boş kalır. */
function summary({ columns }: { columns: { property?: string }[] }): string[] {
  const totals = rows.map(rowTotals)
  const sum = (pick: (total: ReturnType<typeof rowTotals>) => number) =>
    hoursText(totals.reduce((all, total) => all + pick(total), 0))
  return columns.map((column, index) => {
    if (index === 0) return 'Toplam'
    if (column.property === 'worked') return sum((total) => total.worked)
    if (column.property === 'overtime') return `${sum((total) => total.overtime)} s`
    return ''
  })
}
</script>

<template>
  <el-table :data="rows" :row-key="(row: PuantajRow) => row.entry.id" show-summary :summary-method="summary"
    empty-text="Bu bölümde kimse yok">
    <el-table-column :label="kind === 'CREW' ? 'Ekip' : 'Ad'" min-width="220" fixed>
      <template #default="{ row }">
        <EntryName :entry="row.entry" @open="emit('open', row.entry.id)" />
      </template>
    </el-table-column>
    <el-table-column v-for="day in days" :key="day" align="center" width="58"
      :label="`${dayOfMonth(day)} ${weekdayShort(day)}`">
      <template #default="{ row }">
        <MarkTag v-if="row.marks[day]" :mark="row.marks[day]" compact />
      </template>
    </el-table-column>
    <el-table-column property="worked" :label="kind === 'CREW' ? 'Geldiği gün' : 'Çalıştığı gün'" width="112"
      align="center" fixed="right">
      <template #default="{ row }"><b>{{ workedText(row) }}</b></template>
    </el-table-column>
    <el-table-column v-if="kind === 'PERSON'" property="overtime" label="Mesai" width="84" align="center"
      fixed="right">
      <template #default="{ row }">{{ overtimeText(row) }}</template>
    </el-table-column>
  </el-table>
</template>
