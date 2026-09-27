<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { isoDayOf, monthBounds } from '@/core/format/dates'
import { calendarClass, canMarkDay } from '@/core/rollcall/memberCalendar'
import { recordLabel, type MarkChoice } from '@/core/rollcall/rollCallLabels'
import { useMemberMonth } from '@/core/rollcall/useMemberMonth'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import MonthSwitcher from '@/desktop/molecules/MonthSwitcher.vue'
import RollDayDialog from '@/desktop/organisms/RollDayDialog.vue'
import RollLegend from '@/shared/molecules/RollLegend.vue'

/**
 * Sağ panelde bir kişinin takvimi: başlıkta adı ve ayın özeti ("20 gün geldi · ..."), ‹ ay › seçici (adreste
 * ?ay=); geldiği günler yeşil, gelmediği kırmızı, izinli sarı, katılmadığı gri, hücrede adı da yazar. Güne
 * tıklayınca detay; ileri günler soluk ve tıklanmaz. Önceki ayın bir gününe tıklamak o aya geçer.
 */
const { userId } = defineProps<{ userId: string }>()
const calendar = useMemberMonth(() => userId)
const { month, setMonth, isCurrentMonth, member, days, summary, isPending, isMarking } = calendar
const openDay = ref<string | null>(null)
const dialogOpen = computed({
  get: () => openDay.value !== null,
  set: (open) => (openDay.value = open ? openDay.value : null),
})
const shownMonth = computed(() => monthBounds(month.value).first)

function onPick(date: Date) {
  const day = isoDayOf(date)
  if (!canMarkDay(day)) return
  if (day.startsWith(month.value)) openDay.value = day
  else setMonth(day.slice(0, 7))
}

async function mark(choice: MarkChoice) {
  if (!openDay.value) return
  try {
    await calendar.markDay(openDay.value, choice)
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <DetailPane>
    <template #header>
      <div class="member-calendar__head">
        <span class="member-calendar__title">
          <strong>{{ member?.fullName }}</strong>
          <span v-if="summary">{{ summary }}</span>
        </span>
        <MonthSwitcher :month="month" :can-go-forward="!isCurrentMonth" @change="setMonth" />
      </div>
    </template>
    <el-skeleton v-if="isPending" :rows="8" animated />
    <template v-else>
      <el-calendar :model-value="shownMonth" class="member-calendar" @update:model-value="onPick">
        <template #header><span /></template>
        <template #date-cell="{ data }">
          <div class="member-calendar__day" :data-day="data.day" :class="[
            data.type === 'current-month' ? calendarClass(days.get(data.day)) : 'member-calendar__day--other',
            { 'member-calendar__day--future': !canMarkDay(data.day) },
          ]">
            <span class="member-calendar__number">{{ Number(data.day.slice(8)) }}</span>
            <small v-if="data.type === 'current-month' && days.get(data.day)" class="member-calendar__label">
              {{ recordLabel(days.get(data.day)?.record) }}
            </small>
          </div>
        </template>
      </el-calendar>
      <RollLegend class="member-calendar__legend" />
    </template>
    <RollDayDialog v-if="openDay" v-model:show="dialogOpen" :day="openDay" :member-name="member?.fullName ?? ''"
      :entry="days.get(openDay)" :busy="isMarking" @choose="mark" />
  </DetailPane>
</template>

<style scoped>
.member-calendar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
}

.member-calendar__title {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.member-calendar__title span {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.member-calendar :deep(.el-calendar__header) {
  display: none;
}

.member-calendar :deep(.el-calendar__body) {
  padding: 0;
}

.member-calendar :deep(.el-calendar-table .el-calendar-day) {
  height: 76px;
  padding: 3px;
}

/* Kütüphanenin "seçili gün" zemini ayın ilk gününe düşer; anlamı yok, renkler bizim hücremizden gelir. */
.member-calendar :deep(.el-calendar-table td.is-selected) {
  background: none;
}

.member-calendar__day {
  display: grid;
  align-content: space-between;
  height: 100%;
  padding: 6px 8px;
  border-radius: var(--radius-md);
  background: var(--roll-bg, transparent);
  color: var(--roll-fg, var(--text-strong));
}

.member-calendar__day--other {
  opacity: 0.35;
}

.member-calendar__day--future {
  opacity: 0.45;
  cursor: default;
}

.member-calendar__number {
  font-weight: var(--weight-bold);
}

.member-calendar__label {
  font-size: var(--text-xs);
  line-height: 1.2;
}

.member-calendar__legend {
  margin-top: var(--space-4);
}
</style>
