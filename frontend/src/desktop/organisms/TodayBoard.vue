<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { MarkDraft } from '@/core/puantaj/markDraft'
import { markedDays, type PuantajRow } from '@/core/puantaj/puantajBook'
import { entryTitle, statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'
import { useDailyPuantaj } from '@/core/puantaj/useDailyPuantaj'
import { usePuantajMarking } from '@/core/puantaj/usePuantajMarking'
import { useRowFilter, type FilterKey } from '@/core/puantaj/useRowFilter'
import RosterEmpty from '@/desktop/molecules/RosterEmpty.vue'
import RosterSection from '@/desktop/molecules/RosterSection.vue'
import SelectionBar from '@/desktop/molecules/SelectionBar.vue'
import StatusSegmented from '@/desktop/molecules/StatusSegmented.vue'
import TodayStats from '@/desktop/molecules/TodayStats.vue'
import RollTable from '@/desktop/organisms/RollTable.vue'

/**
 * Bugün sekmesi, şefin sabahı: üstte özet (yalnızca gösterge), altında sekme görünüşlü süzgeç (Tümü · Bekleyen ·
 * durumlar), sonra kartlar içinde Personel ve Taşeron ekipler. Her satır bir form satırıdır: durum, mesai ve not
 * satırda yazılır, anında kaydedilir; bir alan değişince öbürleri yerinde kalır. Seçilenler alttan açılan şeritten
 * tek hamlede işaretlenir (sayfa kaymaz). Arama sayfa başlığındadır.
 */
const { query } = defineProps<{ query: string }>()
const emit = defineEmits<{ open: [entryId: string, day?: string] }>()
const open = (entryId: string, day?: string) => emit('open', entryId, day)
const { today, days, book, counts, isEmpty, canMark, isPending } = useDailyPuantaj()
const { statuses, filtered } = useRowFilter(book, today, toRef(() => query))
const filter = computed<FilterKey>({
  get: () => statuses.value[0] ?? 'ALL',
  set: (key) => (statuses.value = key === 'ALL' ? [] : [key]),
})
const marking = usePuantajMarking()
const shownDays = computed(() => [...markedDays(book.value, days.filter((day) => day !== today)), today])
const peopleTable = ref<InstanceType<typeof RollTable>>()
const crewTable = ref<InstanceType<typeof RollTable>>()
const selectedPeople = ref<string[]>([])
const selectedCrews = ref<string[]>([])
const allRows = computed(() => [...book.value.people, ...book.value.crews])
/** Şeritteki adlar: şef kimi seçtiğini görür. Seçimde ekip varsa yalnızca Geldi · Gelmedi önerilir. */
const picked = computed(() => pickedOf(allRows.value, [...selectedPeople.value, ...selectedCrews.value]))
const choices = computed(() => statusChoices(selectedCrews.value.length ? 'CREW' : 'PERSON'))

function pickedOf(rows: PuantajRow[], ids: string[]) {
  return rows
    .filter((row) => ids.includes(row.entry.id))
    .map((row) => ({ id: row.entry.id, name: entryTitle(row.entry) }))
}

async function attempt(work: () => Promise<unknown>, done?: string) {
  await work().then(() => done && ElMessage.success(done), (error) => ElMessage.error(errorMessage(error)))
}

function clearSelection() {
  peopleTable.value?.clearSelection()
  crewTable.value?.clearSelection()
}

function deselect(entryId: string) {
  peopleTable.value?.deselect(entryId)
  crewTable.value?.deselect(entryId)
}

const markSelected = (status: DayStatus) => {
  const ids = picked.value.map((item) => item.id)
  return attempt(async () => {
    await marking.markAll(ids, today, status)
    clearSelection()
  }, `${ids.length} satır işaretlendi`)
}
const markOf = (entryId: string) => allRows.value.find((row) => row.entry.id === entryId)?.marks[today]
const update = (entryId: string, change: Partial<MarkDraft>) =>
  attempt(() => marking.update(entryId, today, markOf(entryId), change))
const clear = (entryId: string) => attempt(() => marking.clear(entryId, today))
</script>

<template>
  <el-skeleton v-if="isPending" :rows="8" animated />
  <RosterEmpty v-else-if="isEmpty" />
  <!-- el-space satır içi bir kutudur: genişlik verilmezse içeriği kadar kalıp sağda boşluk bırakıyordu. -->
  <el-space v-else direction="vertical" alignment="stretch" :size="20" style="width: 100%">
    <TodayStats :counts="counts" />
    <StatusSegmented v-model="filter" :counts="counts" />
    <RosterSection v-if="book.people.length" title="Personel" :count="filtered.people.length">
      <RollTable ref="peopleTable" :rows="filtered.people" :days="shownDays" :today="today"
        :can-mark="canMark(today)" @select="(ids) => (selectedPeople = ids)" @open="open" @update="update"
        @clear="clear" />
    </RosterSection>
    <RosterSection v-if="book.crews.length" title="Taşeron ekipler" :count="filtered.crews.length">
      <RollTable ref="crewTable" :rows="filtered.crews" :days="shownDays" :today="today" :can-mark="canMark(today)"
        @select="(ids) => (selectedCrews = ids)" @open="open" @update="update" @clear="clear" />
    </RosterSection>
    <SelectionBar :items="picked" :choices="choices" @choose="markSelected" @deselect="deselect"
      @cancel="clearSelection" />
  </el-space>
</template>
