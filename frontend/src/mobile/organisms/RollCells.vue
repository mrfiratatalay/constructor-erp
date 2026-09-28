<script setup lang="ts">
import type { PuantajRow } from '@/core/puantaj/puantajBook'
import { entrySubtitle, entryTitle, hoursText } from '@/core/puantaj/puantajLabels'
import MarkTag from '@/mobile/atoms/MarkTag.vue'

/**
 * Bir bölümün satırları (Personel ya da Taşeron ekipler): ad, altında görev ve varsa mesai ile not, sağda bugünün
 * işareti ya da "İşaretle". Satıra dokununca durum seçilir. Seçim kipinde sağda kutu çıkar, dokunmak seçer.
 */
const { title, rows, day, selecting, selected } = defineProps<{
  title: string
  rows: PuantajRow[]
  day: string
  selecting: boolean
  selected: string[]
}>()
const emit = defineEmits<{ pick: [row: PuantajRow]; toggle: [entryId: string] }>()

function detail(row: PuantajRow): string {
  const mark = row.marks[day]
  const parts = [row.entry.archived ? 'Listeden çıktı' : entrySubtitle(row.entry)]
  if (mark?.overtimeHours) parts.push(`+${hoursText(mark.overtimeHours)} s mesai`)
  if (mark?.note) parts.push(mark.note)
  return parts.filter(Boolean).join(' · ')
}

function onTap(row: PuantajRow) {
  if (row.entry.archived) return
  if (selecting) emit('toggle', row.entry.id)
  else emit('pick', row)
}
</script>

<template>
  <van-cell-group inset :title="`${title} · ${rows.length}`">
    <van-cell v-for="row in rows" :key="row.entry.id" center :icon="row.entry.kind === 'CREW' ? 'friends-o' : 'user-o'"
      :title="entryTitle(row.entry)" :label="detail(row) || undefined" :clickable="!row.entry.archived"
      @click="onTap(row)">
      <template #value>
        <MarkTag v-if="row.marks[day]" :mark="row.marks[day]!" />
        <van-button v-else-if="!selecting && !row.entry.archived" size="mini" round plain type="primary">
          İşaretle
        </van-button>
      </template>
      <template v-if="selecting" #right-icon>
        <van-checkbox :model-value="selected.includes(row.entry.id)" :disabled="row.entry.archived" />
      </template>
    </van-cell>
    <van-cell v-if="!rows.length" title="Bu bölümde kimse yok" />
  </van-cell-group>
</template>
