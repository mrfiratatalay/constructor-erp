<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { showFailToast, type CalendarDayItem, type CalendarInstance } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { isoDayOf, monthBounds } from '@/core/format/dates'
import { calendarClass, canMarkDay, daySymbol } from '@/core/rollcall/memberCalendar'
import type { MarkChoice } from '@/core/rollcall/rollCallLabels'
import { useMemberMonth } from '@/core/rollcall/useMemberMonth'
import MonthSwitcher from '@/mobile/molecules/MonthSwitcher.vue'
import RollDaySheet from '@/mobile/organisms/RollDaySheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import RollLegend from '@/shared/molecules/RollLegend.vue'

/**
 * Bir kişinin takvimi (Yoklama'da kişiye dokununca): başlıkta adı, altında ayın özeti; ‹ ay › seçici (adreste
 * ?ay=). Geldiği günler yeşil, gelmediği kırmızı, izinli sarı, katılmadığı gri; dar hücrede kısa işaret, anlamı
 * altındaki açıklamada. Güne dokununca alttan detay; ileri günler seçilmez.
 */
const route = useRoute()
const userId = computed(() => String(route.params.userId))
const calendar = useMemberMonth(userId)
const { month, setMonth, isCurrentMonth, member, days, summary, isPending, isMarking } = calendar
const calendarRef = useTemplateRef<CalendarInstance>('calendar')
const bounds = computed(() => monthBounds(month.value))
const openDay = ref<string | null>(null)
const sheetOpen = computed({
  get: () => openDay.value !== null,
  set: (open) => (openDay.value = open ? openDay.value : null),
})

function colorDay(item: CalendarDayItem): CalendarDayItem {
  if (!item.date) return item
  const day = isoDayOf(item.date)
  const entry = days.value.get(day)
  const type = canMarkDay(day) ? item.type : 'disabled'
  return { ...item, type, className: calendarClass(entry), bottomInfo: daySymbol(entry) }
}

/** Kütüphanenin seçim rengi günün yoklama rengini örtmesin: detay açılınca seçim bırakılır. */
function onSelect(date: Date) {
  openDay.value = isoDayOf(date)
  calendarRef.value?.reset()
}

async function mark(choice: MarkChoice) {
  if (!openDay.value) return
  try {
    await calendar.markDay(openDay.value, choice)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <MobilePage :title="member?.fullName ?? 'Yoklama'" :subtitle="summary" back>
    <MonthSwitcher :month="month" :can-go-forward="!isCurrentMonth" @change="setMonth" />
    <van-skeleton v-if="isPending" :row="6" />
    <template v-else>
      <van-calendar ref="calendar" :key="month" class="member-calendar" :poppable="false" :show-title="false"
        :show-subtitle="false" :show-confirm="false" :show-mark="false" :min-date="bounds.first"
        :max-date="bounds.last" :default-date="null" :first-day-of-week="1" :row-height="56" :formatter="colorDay"
        @select="onSelect" />
      <RollLegend class="member-calendar__legend" />
    </template>
    <RollDaySheet v-if="openDay" v-model:show="sheetOpen" :day="openDay" :member-name="member?.fullName ?? ''"
      :entry="days.get(openDay)" :busy="isMarking" @choose="mark" />
  </MobilePage>
</template>

<style scoped>
.member-calendar {
  height: auto;
  margin: 0 var(--space-4);
  overflow: hidden;
  border-radius: var(--radius-lg);
}

/* Ay seçici ayı zaten yazar; kütüphanenin ay başlığı ikinci kez yazmasın. */
.member-calendar :deep(.van-calendar__month-title) {
  display: none;
}

/* Hücre yoklamanın rengiyle boyanır (.roll-day--* sınıfı rengi değişken olarak verir); aradaki beyaz çizgi
   günleri ayırır. */
.member-calendar :deep(.van-calendar__day) {
  border-radius: 12px;
  background: var(--roll-bg, transparent);
  box-shadow: inset 0 0 0 3px var(--surface);
  color: var(--roll-fg, inherit);
  font-weight: var(--weight-semibold);
}

.member-calendar :deep(.van-calendar__day--disabled) {
  color: var(--text-subtle);
}

.member-calendar :deep(.van-calendar__bottom-info) {
  font-size: 12px;
  font-weight: var(--weight-bold);
}

.member-calendar__legend {
  margin: var(--space-4);
}
</style>
