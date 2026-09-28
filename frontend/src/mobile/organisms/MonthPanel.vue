<script setup lang="ts">
import { computed } from 'vue'
import { rowTotals, type PuantajRow } from '@/core/puantaj/puantajBook'
import { entrySubtitle, entryTitle, hoursText } from '@/core/puantaj/puantajLabels'
import { useMonthPuantaj } from '@/core/puantaj/useMonthPuantaj'
import MonthStepper from '@/mobile/molecules/MonthStepper.vue'

/**
 * Puantaj sekmesi, ay sonunun özeti: her kişinin çalıştığı gün (yarım gün yarım sayılır) ve altında mesaisi,
 * yarım günleri, gelmediği ve izinli günleri; ekibin geldiği gün. Dokununca ayın takvimi açılır. Patrona Excel.
 */
const emit = defineEmits<{ open: [entryId: string] }>()
const { month, setMonth, isCurrentMonth, book, isPending, canExport, exportUrl } = useMonthPuantaj()
const sections = computed(() => [
  { key: 'people', title: 'Personel', rows: book.value.people },
  { key: 'crews', title: 'Taşeron ekipler', rows: book.value.crews },
])

const valueOf = (row: PuantajRow) => `${hoursText(rowTotals(row).worked)} gün`

function labelOf(row: PuantajRow): string {
  const totals = rowTotals(row)
  const parts = [
    totals.overtime ? `${hoursText(totals.overtime)} s mesai` : '',
    totals.half ? `${totals.half} yarım gün` : '',
    totals.absent ? `${totals.absent} gelmedi` : '',
    totals.leave ? `${totals.leave} izinli` : '',
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : entrySubtitle(row.entry)
}
</script>

<template>
  <van-cell-group inset title="Ay">
    <van-cell>
      <template #title>
        <MonthStepper :month="month" :is-current-month="isCurrentMonth" @change="setMonth" />
      </template>
    </van-cell>
  </van-cell-group>
  <van-skeleton v-if="isPending" :row="6" />
  <template v-else>
    <van-cell-group v-for="section in sections" :key="section.key" inset
      :title="`${section.title} · ${section.rows.length}`">
      <van-cell v-for="row in section.rows" :key="row.entry.id" center is-link
        :icon="row.entry.kind === 'CREW' ? 'friends-o' : 'user-o'" :title="entryTitle(row.entry)"
        :label="labelOf(row) || undefined" :value="valueOf(row)" @click="emit('open', row.entry.id)" />
      <van-cell v-if="!section.rows.length" title="Bu bölümde kimse yok" />
    </van-cell-group>
    <van-cell-group v-if="canExport" inset title="Ayın dosyası">
      <van-cell>
        <template #title>
          <van-button type="primary" icon="down" block round :url="exportUrl">Excel indir</van-button>
        </template>
      </van-cell>
    </van-cell-group>
  </template>
</template>
