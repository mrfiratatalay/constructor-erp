<script setup lang="ts">
import { ref } from 'vue'
import { monthTitle } from '@/core/format/dates'
import { useMyPuantaj } from '@/core/puantaj/useMyPuantaj'
import MarkTag from '@/mobile/atoms/MarkTag.vue'
import EntryTotalsList from '@/mobile/molecules/EntryTotalsList.vue'
import MarkCalendar from '@/mobile/molecules/MarkCalendar.vue'
import MyDaySheet from '@/mobile/organisms/MyDaySheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Puantajım (çalışanın sekmesi): bugünkü kaydı, ayın takvimi (‹ › ile ay değişir) ve özeti. Kaydını her gün görür;
 * yanlış bir gün varsa güne dokunur, işaretleyeni arar. Yalnızca kendi kaydı; başkasınınki, şefin notu ve tutar
 * görünmez.
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
    <van-skeleton v-if="isPending" :row="6" />
    <van-empty v-else-if="!counted" image-size="72" description="Patron ve şef yoklamada sayılmaz." />
    <template v-else>
      <van-cell-group v-if="isCurrentMonth" inset title="Kaydını her gün buradan görürsün">
        <van-cell title="Bugün" center clickable @click="pickDay(today)">
          <template #value><MarkTag :mark="todayMark" /></template>
        </van-cell>
      </van-cell-group>
      <MarkCalendar :month="month" :marks="days" :today="today" @pick="pickDay" @change="setMonth" />
      <EntryTotalsList :totals="totals" kind="PERSON" />
    </template>
    <MyDaySheet v-model:show="dayOpen" :day="pickedDay" :mark="days[pickedDay]" />
  </MobilePage>
</template>
