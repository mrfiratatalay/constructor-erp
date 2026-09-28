<script setup lang="ts">
import { ref } from 'vue'
import { monthTitle } from '@/core/format/dates'
import { useMyPuantaj } from '@/core/puantaj/useMyPuantaj'
import MarkTag from '@/mobile/atoms/MarkTag.vue'
import EntryTotalsGrid from '@/mobile/molecules/EntryTotalsGrid.vue'
import MarkLegend from '@/mobile/molecules/MarkLegend.vue'
import MonthGridCalendar from '@/mobile/molecules/MonthGridCalendar.vue'
import MonthStepper from '@/mobile/molecules/MonthStepper.vue'
import MyDaySheet from '@/mobile/organisms/MyDaySheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Puantajım (çalışanın sekmesi): bugünkü kaydı, ayın toplamları ve takvimi. Kaydını her gün görür; yanlış bir gün
 * varsa güne dokunur, işaretleyeni arar. Yalnızca kendi kaydı; başkasınınki, şefin notu ve tutar görünmez.
 */
const { month, setMonth, isCurrentMonth, today, days, totals, todayMark, counted, isPending } = useMyPuantaj()
const pickedDay = ref(today)
const dayOpen = ref(false)

function pickDay(day: string) {
  pickedDay.value = day
  dayOpen.value = true
}
</script>

<template>
  <MobilePage title="Puantajım" :subtitle="monthTitle(`${month}-01`)">
    <MonthStepper :month="month" :is-current-month="isCurrentMonth" @change="setMonth" />
    <van-skeleton v-if="isPending" :row="6" />
    <van-empty v-else-if="!counted" image-size="72" description="Patron ve şef yoklamada sayılmaz." />
    <template v-else>
      <van-cell-group v-if="isCurrentMonth" inset title="Kaydını her gün buradan görürsün">
        <van-cell title="Bugün" center clickable @click="pickDay(today)">
          <template #value>
            <MarkTag v-if="todayMark" :mark="todayMark" />
            <span v-else>Henüz işaretlenmedi</span>
          </template>
        </van-cell>
      </van-cell-group>
      <EntryTotalsGrid :totals="totals" kind="PERSON" />
      <MonthGridCalendar :month="month" :marks="days" :today="today" @pick="pickDay" />
      <MarkLegend />
    </template>
    <MyDaySheet v-model:show="dayOpen" :day="pickedDay" :mark="days[pickedDay]" />
  </MobilePage>
</template>
