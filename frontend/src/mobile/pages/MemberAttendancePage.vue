<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showConfirmDialog, showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { entrySubtitle, entryTitle } from '@/core/puantaj/puantajLabels'
import { useEntryMonth } from '@/core/puantaj/useEntryMonth'
import { useRoster } from '@/core/puantaj/useRoster'
import EntryTotalsGrid from '@/mobile/molecules/EntryTotalsGrid.vue'
import MarkLegend from '@/mobile/molecules/MarkLegend.vue'
import MonthGridCalendar from '@/mobile/molecules/MonthGridCalendar.vue'
import MonthStepper from '@/mobile/molecules/MonthStepper.vue'
import DaySheet from '@/mobile/organisms/DaySheet.vue'
import RosterEntrySheet from '@/mobile/organisms/RosterEntrySheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Bir kişinin ya da ekibin ayı: ay seçici, toplamlar, takvim (her günde işareti). Güne dokununca ayrıntısı alttan
 * açılır; patron geçmiş günü de düzeltir. Uygulaması olmayan kişi ya da ekip buradan düzeltilir, listeden çıkarılır.
 */
const route = useRoute()
const router = useRouter()
const entryId = computed(() => String(route.params.entryId))
const { month, setMonth, isCurrentMonth, today, row, totals, canMark, isPending } = useEntryMonth(entryId)
const roster = useRoster()
const pickedDay = ref(today)
const dayOpen = ref(false)
const formOpen = ref(false)

function pickDay(day: string) {
  pickedDay.value = day
  dayOpen.value = true
}

async function archive() {
  const name = row.value ? entryTitle(row.value.entry) : ''
  const message = 'Bugünden sonra listede görünmez; geçmiş günleri puantajda kalır.'
  const confirmed = await showConfirmDialog({ title: `${name} listeden çıkarılsın mı?`, message,
    confirmButtonText: 'Çıkar', cancelButtonText: 'Vazgeç' }).then(() => true, () => false)
  if (!confirmed) return
  await roster.archive(entryId.value).then(() => router.back(), (error) => showFailToast(errorMessage(error)))
}
</script>

<template>
  <MobilePage :title="row ? entryTitle(row.entry) : 'Yoklama'" :subtitle="row ? entrySubtitle(row.entry) : ''" back
    :tabbar="false">
    <MonthStepper :month="month" :is-current-month="isCurrentMonth" @change="setMonth" />
    <van-skeleton v-if="isPending" :row="6" />
    <template v-else-if="row && totals">
      <EntryTotalsGrid :totals="totals" :kind="row.entry.kind" />
      <MonthGridCalendar :month="month" :marks="row.marks" :today="today" @pick="pickDay" />
      <MarkLegend />
      <van-cell-group v-if="!row.entry.archived" inset>
        <van-cell :title="row.entry.linked ? 'Görevini düzenle' : 'Düzenle'" is-link @click="formOpen = true" />
        <van-cell v-if="!row.entry.linked" title="Listeden çıkar" is-link @click="archive" />
      </van-cell-group>
      <DaySheet v-model:show="dayOpen" :entry="row.entry" :day="pickedDay" :mark="row.marks[pickedDay]"
        :can-edit="canMark(pickedDay) && !row.entry.archived" />
      <RosterEntrySheet v-model:show="formOpen" :entry="row.entry" />
    </template>
    <van-empty v-else image-size="72" description="Bu ay listede yok." />
  </MobilePage>
</template>
