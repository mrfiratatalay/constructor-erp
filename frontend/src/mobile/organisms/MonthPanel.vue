<script setup lang="ts">
import { computed } from 'vue'
import { rowTotals, type PuantajRow } from '@/core/puantaj/puantajBook'
import { workingDaysSoFar } from '@/core/puantaj/puantajDays'
import { entrySubtitle, entryTitle, hoursText } from '@/core/puantaj/puantajLabels'
import { useMonthPuantaj } from '@/core/puantaj/useMonthPuantaj'
import EntryAvatar from '@/mobile/atoms/EntryAvatar.vue'
import { ICON_TITLE_GAP } from '@/mobile/cellLayout'
import MonthStepper from '@/mobile/molecules/MonthStepper.vue'

/**
 * Puantaj sekmesi, ay sonunun özeti: her kişinin çalıştığı gün (yarım gün yarım sayılır; sağda yeşil "19 gün"),
 * altında mesaisi, yarım günleri, gelmediği ve izinli günleri ve ince bir ay çubuğu: çalıştığı günün ayın bugüne
 * kadarki iş günlerine oranı (Pazar hariç); kimin ayı dolu, kimin eksik tek bakışta. Dokununca ayın takvimi açılır.
 * Patrona Excel.
 */
const emit = defineEmits<{ open: [entryId: string] }>()
const { month, setMonth, isCurrentMonth, today, book, isEmpty, isPending, canExport, exportUrl } = useMonthPuantaj()
const sections = computed(() => [
  { key: 'people', title: 'Personel', rows: book.value.people },
  { key: 'crews', title: 'Taşeron ekipler', rows: book.value.crews },
])
const workingDays = computed(() => workingDaysSoFar(month.value, today))

const valueOf = (row: PuantajRow) => `${hoursText(rowTotals(row).worked)} gün`
const shareOf = (row: PuantajRow) =>
  workingDays.value ? Math.min(100, Math.round((rowTotals(row).worked / workingDays.value) * 100)) : 0

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
  <van-cell-group inset>
    <van-cell>
      <template #title>
        <MonthStepper :month="month" :is-current-month="isCurrentMonth" @change="setMonth" />
      </template>
    </van-cell>
  </van-cell-group>
  <van-skeleton v-if="isPending" :row="6" />
  <van-empty v-else-if="isEmpty" description="Bu ay listede kimse yok.">
    <template #image><van-icon name="friends-o" size="72" color="var(--van-gray-5)" /></template>
  </van-empty>
  <template v-else>
    <template v-for="section in sections" :key="section.key">
      <van-cell-group v-if="section.rows.length" inset :title="`${section.title} · ${section.rows.length}`">
        <van-cell v-for="row in section.rows" :key="row.entry.id" center is-link :title="entryTitle(row.entry)"
          :title-style="ICON_TITLE_GAP" @click="emit('open', row.entry.id)">
          <template #icon><EntryAvatar :entry="row.entry" /></template>
          <template #label>
            <van-space direction="vertical" fill :size="6">
              <span v-if="labelOf(row)">{{ labelOf(row) }}</span>
              <van-progress :percentage="shareOf(row)" :show-pivot="false" stroke-width="4"
                color="var(--van-success-color)" track-color="var(--van-gray-2)" />
            </van-space>
          </template>
          <template #value><van-tag type="success" round size="medium">{{ valueOf(row) }}</van-tag></template>
        </van-cell>
      </van-cell-group>
    </template>
    <van-cell-group v-if="canExport" inset title="Ayın dosyası">
      <van-cell>
        <template #title>
          <van-button type="primary" icon="down" block round :url="exportUrl">Excel indir</van-button>
        </template>
      </van-cell>
    </van-cell-group>
  </template>
</template>
