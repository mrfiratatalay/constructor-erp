<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { CalendarDayItem, CalendarInstance } from 'vant'
import { isoDayOf, monthKey, monthTitle, shiftMonth } from '@/core/format/dates'
import type { MarkLike } from '@/core/puantaj/puantajLabels'
import MarkDot from '@/mobile/atoms/MarkDot.vue'

/**
 * Bir kişinin ya da ekibin ayı, Vant'ın takvimiyle: Pazartesi başta, her günün altında işareti (masaüstü cetvelindeki
 * dairenin aynısı), bugünün numarası kalın. Ay, takvimin kendi ‹ › düğmeleriyle değişir; ileri günler ve gelecek ay
 * kapalıdır. Eskiden elle kurulan ızgarada geniş etiketli günler satırı erken kırıp günleri yanlış sütuna atıyordu.
 */
const { month, marks, today } = defineProps<{ month: string; marks: Record<string, MarkLike>; today: string }>()
const emit = defineEmits<{ pick: [day: string]; change: [month: string] }>()
const calendar = ref<CalendarInstance>()
const dateOf = (isoDate: string) => new Date(`${isoDate}T00:00:00`)
const MIN_DATE = dateOf(`${shiftMonth(monthKey(today), -24)}-01`)
const MAX_DATE = dateOf(today)

/** Adresteki ay (ör. puantajdan gelinen ay) takvimde açılır; takvim kendiliğinden bugünün ayında başlar. */
const showMonth = () => calendar.value?.scrollToDate(dateOf(`${month}-01`))
onMounted(showMonth)
watch(() => month, showMonth)

function markOf(day: CalendarDayItem): MarkLike | undefined {
  return day.date ? marks[isoDayOf(day.date)] : undefined
}

const isToday = (day: CalendarDayItem) => !!day.date && isoDayOf(day.date) === today

function onSelect(value: Date | Date[]) {
  if (!Array.isArray(value)) emit('pick', isoDayOf(value))
}
</script>

<template>
  <van-cell-group inset>
    <van-calendar ref="calendar" :poppable="false" :show-confirm="false" :show-title="false" :show-mark="false"
      switch-mode="month" :first-day-of-week="1" :min-date="MIN_DATE" :max-date="MAX_DATE" :default-date="null"
      @select="onSelect" @panel-change="({ date }: { date: Date }) => emit('change', monthKey(isoDayOf(date)))">
      <template #subtitle="{ date }">{{ date ? monthTitle(isoDayOf(date)) : '' }}</template>
      <!-- Numara ve işaret alt alta, ortada (Vant'ın alt bilgisi hücrenin dibine sabit, numaraya biniyordu). İşaretsiz
           günde görünmez bir rozet yer tutar: her satırdaki numaralar aynı hizada durur. -->
      <template #text="day">
        <van-space direction="vertical" align="center" :size="4">
          <b v-if="isToday(day)">{{ day.text }}</b>
          <span v-else>{{ day.text }}</span>
          <MarkDot v-if="markOf(day)" :mark="markOf(day)" />
          <van-badge v-else content=" " color="transparent" aria-hidden="true" />
        </van-space>
      </template>
    </van-calendar>
  </van-cell-group>
</template>
