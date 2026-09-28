<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'
import { useDailyPuantaj } from '@/core/puantaj/useDailyPuantaj'
import { usePuantajMarking } from '@/core/puantaj/usePuantajMarking'
import { useRowFilter } from '@/core/puantaj/useRowFilter'
import BulkBar from '@/desktop/molecules/BulkBar.vue'
import StatusFilter from '@/desktop/molecules/StatusFilter.vue'
import TodayStats from '@/desktop/molecules/TodayStats.vue'
import RollTable from '@/desktop/organisms/RollTable.vue'

/**
 * Bugün sekmesi, şefin sabahı: üstte özet, altında renk açıklaması ile arama, sonra Personel ve Taşeron ekipler.
 * Satır seçilince süzgecin yerine toplu işaretleme gelir. Her seçim anında kaydedilir.
 */
const emit = defineEmits<{ open: [entryId: string] }>()
const { today, days, book, counts, isComplete, canMark, isPending } = useDailyPuantaj()
const { query, statuses, toggle, filtered } = useRowFilter(book, today)
const marking = usePuantajMarking()
const peopleTable = ref<InstanceType<typeof RollTable>>()
const crewTable = ref<InstanceType<typeof RollTable>>()
const selectedPeople = ref<string[]>([])
const selectedCrews = ref<string[]>([])
const selected = computed(() => [...selectedPeople.value, ...selectedCrews.value])
const bulkChoices = computed(() => statusChoices(selectedCrews.value.length ? 'CREW' : 'PERSON'))

async function attempt(work: () => Promise<unknown>, done?: string) {
  await work().then(() => done && ElMessage.success(done), (error) => ElMessage.error(errorMessage(error)))
}

function clearSelection() {
  peopleTable.value?.clearSelection()
  crewTable.value?.clearSelection()
}

const markSelected = (status: DayStatus) =>
  attempt(async () => {
    await marking.markAll(selected.value, today, status)
    clearSelection()
  }, `${selected.value.length} satır işaretlendi`)
const choose = (entryId: string, status: DayStatus) => attempt(() => marking.setStatus(entryId, today, status))
const clear = (entryId: string) => attempt(() => marking.clear(entryId, today))
</script>

<template>
  <el-skeleton v-if="isPending" :rows="8" animated />
  <template v-else>
    <TodayStats :counts="counts" :complete="isComplete" />
    <el-divider />
    <BulkBar v-if="selected.length" :count="selected.length" :choices="bulkChoices" @choose="markSelected"
      @cancel="clearSelection" />
    <el-row v-else :gutter="16" align="middle">
      <el-col :span="16"><StatusFilter :counts="counts" :selected="statuses" @toggle="toggle" /></el-col>
      <el-col :span="8">
        <el-input v-model="query" placeholder="Ad, görev ya da ekip ara" clearable :prefix-icon="Search" />
      </el-col>
    </el-row>
    <el-divider content-position="left">Personel · {{ filtered.people.length }}</el-divider>
    <RollTable ref="peopleTable" :rows="filtered.people" :days="days" :today="today" :can-mark="canMark(today)"
      @select="(ids) => (selectedPeople = ids)" @open="emit('open', $event)" @choose="choose"
      @details="emit('open', $event)" @clear="clear" />
    <el-divider content-position="left">Taşeron ekipler · {{ filtered.crews.length }}</el-divider>
    <RollTable ref="crewTable" :rows="filtered.crews" :days="days" :today="today" :can-mark="canMark(today)"
      @select="(ids) => (selectedCrews = ids)" @open="emit('open', $event)" @choose="choose"
      @details="emit('open', $event)" @clear="clear" />
  </template>
</template>
