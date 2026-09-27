<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { PuantajRow } from '@/core/puantaj/puantajBook'
import { STATUS_LOOKS, statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'
import { useDailyPuantaj } from '@/core/puantaj/useDailyPuantaj'
import { usePuantajMarking } from '@/core/puantaj/usePuantajMarking'
import { useRowFilter } from '@/core/puantaj/useRowFilter'
import TodayCounts from '@/mobile/molecules/TodayCounts.vue'
import DaySheet from '@/mobile/organisms/DaySheet.vue'
import MarkSheet from '@/mobile/organisms/MarkSheet.vue'
import RollCells from '@/mobile/organisms/RollCells.vue'

/**
 * Bugün sekmesi, şefin sabahı: renkli sayılar, arama, Personel ve Taşeron ekipler. Satıra dokununca alttan durum
 * seçilir (tek dokunuş, anında kaydedilir). Seçim kipinde gelenler seçilip alttaki çubukla tek hamlede işaretlenir.
 */
const { selecting } = defineProps<{ selecting: boolean }>()
const emit = defineEmits<{ open: [entryId: string]; done: [] }>()
const { today, book, counts, canMark, isPending } = useDailyPuantaj()
const { query, filtered } = useRowFilter(book, today)
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

watch(() => selecting, () => (selected.value = []))

const toggle = (entryId: string) => {
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

const choose = (status: DayStatus) => attempt(() => marking.setStatus(pickedId.value!, today, status))
const clear = () => attempt(() => marking.clear(pickedId.value!, today))
const markSelected = (status: DayStatus) =>
  attempt(async () => {
    await marking.markAll(selected.value, today, status)
    emit('done')
  }, `${selected.value.length} satır işaretlendi`)
const barType = (status: DayStatus) => STATUS_LOOKS[status].tone as 'success' | 'warning' | 'danger' | 'primary'
</script>

<template>
  <van-skeleton v-if="isPending" :row="6" />
  <template v-else>
    <TodayCounts :counts="counts" />
    <van-search v-model="query" placeholder="Ad, görev ya da ekip ara" shape="round" />
    <RollCells title="Personel" :rows="filtered.people" :day="today" :selecting="selecting" :selected="selected"
      @pick="pick" @toggle="toggle" />
    <RollCells title="Taşeron ekipler" :rows="filtered.crews" :day="today" :selecting="selecting"
      :selected="selected" @pick="pick" @toggle="toggle" />
  </template>
  <MarkSheet v-model:show="sheetOpen" :row="picked" :day="today" @choose="choose" @details="detailsOpen = true"
    @clear="clear" @calendar="picked && emit('open', picked.entry.id)" />
  <DaySheet v-model:show="detailsOpen" :entry="picked?.entry ?? null" :day="today"
    :mark="picked?.marks[today]" :can-edit="canMark(today)" />
  <van-action-bar v-if="selecting" safe-area-inset-bottom>
    <van-action-bar-button v-for="status in bulkChoices" :key="status" :type="barType(status)"
      :text="STATUS_LOOKS[status].label" :disabled="!selected.length" @click="markSelected(status)" />
  </van-action-bar>
</template>
