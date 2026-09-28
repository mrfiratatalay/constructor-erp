<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { PuantajRow } from '@/core/puantaj/puantajBook'
import { statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'
import { useDailyPuantaj } from '@/core/puantaj/useDailyPuantaj'
import { usePuantajMarking } from '@/core/puantaj/usePuantajMarking'
import { useRowFilter } from '@/core/puantaj/useRowFilter'
import BulkMarkBar from '@/mobile/molecules/BulkMarkBar.vue'
import TodaySummary from '@/mobile/molecules/TodaySummary.vue'
import DaySheet from '@/mobile/organisms/DaySheet.vue'
import MarkSheet from '@/mobile/organisms/MarkSheet.vue'
import RollCells from '@/mobile/organisms/RollCells.vue'

/**
 * Bugün sekmesi, şefin sabahı: halkalı özet (sayılar aynı zamanda süzgeç), arama, Personel ve Taşeron ekipler.
 * Satıra dokununca alttan durum seçilir (tek dokunuş, anında kaydedilir). Başlıktaki "Seç" toplu işaretlemeyi açar:
 * gelenler seçilir, alttaki çubukla tek hamlede işaretlenir.
 */
const { selecting } = defineProps<{ selecting: boolean }>()
const emit = defineEmits<{ open: [entryId: string]; done: [] }>()
const { today, book, counts, canMark, isEmpty, isPending } = useDailyPuantaj()
const { query, statuses, toggle, filtered } = useRowFilter(book, today)
const marking = usePuantajMarking()
const selected = ref<string[]>([])
const pickedId = ref<string | null>(null)
const sheetOpen = ref(false)
const detailsOpen = ref(false)
const picked = computed(() =>
  [...book.value.people, ...book.value.crews].find((row) => row.entry.id === pickedId.value) ?? null,
)
const hasCrew = computed(() => selected.value.some((id) => book.value.crews.some((row) => row.entry.id === id)))
const bulkChoices = computed(() => statusChoices(hasCrew.value ? 'CREW' : 'PERSON'))

watch(
  () => selecting,
  () => (selected.value = []),
)

const toggleRow = (entryId: string) => {
  selected.value = selected.value.includes(entryId)
    ? selected.value.filter((id) => id !== entryId)
    : [...selected.value, entryId]
}

function pick(row: PuantajRow) {
  pickedId.value = row.entry.id
  if (canMark(today)) sheetOpen.value = true
  else emit('open', row.entry.id)
}

async function attempt(work: () => Promise<unknown>, done?: string) {
  await work().then(() => done && showSuccessToast(done), (error) => showFailToast(errorMessage(error)))
}

/** Durum değişir, o günün notu ve (Geldi'de kalırsa) mesaisi yerinde kalır. */
const choose = (status: DayStatus) =>
  attempt(() => marking.update(pickedId.value!, today, picked.value?.marks[today], { status }))
const clear = () => attempt(() => marking.clear(pickedId.value!, today))
const markSelected = (status: DayStatus) =>
  attempt(async () => {
    await marking.markAll(selected.value, today, status)
    emit('done')
  }, `${selected.value.length} satır işaretlendi`)
</script>

<template>
  <van-skeleton v-if="isPending" :row="6" />
  <van-empty v-else-if="isEmpty" description="Listede henüz kimse yok. Sağ üstteki ＋ ile kişi ya da taşeron ekip ekle.">
    <template #image><van-icon name="friends-o" size="72" color="var(--van-gray-5)" /></template>
  </van-empty>
  <template v-else>
    <TodaySummary :counts="counts" :selected="statuses" @toggle="toggle" />
    <van-cell-group inset>
      <van-search v-model="query" placeholder="Ad, görev ya da ekip ara" shape="round" />
    </van-cell-group>
    <RollCells v-if="book.people.length" title="Personel" :rows="filtered.people" :day="today" :selecting="selecting"
      :selected="selected" @pick="pick" @toggle="toggleRow" />
    <RollCells v-if="book.crews.length" title="Taşeron ekipler" :rows="filtered.crews" :day="today"
      :selecting="selecting" :selected="selected" @pick="pick" @toggle="toggleRow" />
  </template>
  <MarkSheet v-model:show="sheetOpen" :row="picked" :day="today" @choose="choose" @details="detailsOpen = true"
    @clear="clear" @calendar="picked && emit('open', picked.entry.id)" />
  <DaySheet v-model:show="detailsOpen" :entry="picked?.entry ?? null" :day="today"
    :mark="picked?.marks[today]" :can-edit="canMark(today)" />
  <BulkMarkBar :show="selecting" :count="selected.length" :choices="bulkChoices" @choose="markSelected" />
</template>
