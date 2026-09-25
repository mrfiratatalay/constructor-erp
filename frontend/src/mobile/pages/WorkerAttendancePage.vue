<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { CalendarDays } from 'lucide-vue-next'
import { useGetWorkerAttendanceMonth } from '@/core/api/generated/attendance/attendance'
import { ATTENDANCE_STATUS, markLabel } from '@/core/attendance/attendanceLabels'
import { useMonthParam } from '@/core/attendance/useMonthParam'
import { dayTitle } from '@/core/format/dates'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import MonthSwitcher from '@/mobile/molecules/MonthSwitcher.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Bir personelin ayı: kaç gün geldi, gelmedi, izinliydi; altında gün gün durum, neden ve not (en yeni üstte).
 * Gün detayından kişiye dokununca açılır; geri oku şantiyenin geçmişine döner.
 */
const route = useRoute()
const workerId = computed(() => String(route.params.workerId))
const { month, setMonth, isCurrentMonth } = useMonthParam()
const { data: history, isLoading } = useGetWorkerAttendanceMonth(workerId, () => ({ month: month.value }))
</script>

<template>
  <MobilePage :title="history?.worker.fullName ?? 'Personel'" :subtitle="history?.worker.trade ?? ''" back>
    <MonthSwitcher :month="month" :can-go-forward="!isCurrentMonth" @change="setMonth" />
    <van-skeleton v-if="isLoading" :row="4" />
    <template v-else-if="history">
      <p class="worker-attendance__counts">
        <StatusTag tone="success">{{ history.counts.present }} gün geldi</StatusTag>
        <StatusTag tone="danger">{{ history.counts.absent }} gün gelmedi</StatusTag>
        <StatusTag tone="warning">{{ history.counts.excused }} gün izinli</StatusTag>
      </p>
      <van-cell-group v-if="history.days.length" inset>
        <van-cell v-for="item in history.days" :key="item.day" :title="dayTitle(item.day)"
          :label="item.note ?? undefined" center>
          <template #value>
            <StatusTag :tone="ATTENDANCE_STATUS[item.status].tone">{{ markLabel(item.status, item.reason) }}</StatusTag>
          </template>
        </van-cell>
      </van-cell-group>
      <van-empty v-else description="Bu ay yoklamada adı geçmiyor.">
        <template #image><CalendarDays :size="48" class="worker-attendance__empty-icon" /></template>
      </van-empty>
    </template>
  </MobilePage>
</template>

<style scoped>
.worker-attendance__counts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin: 0;
}

.worker-attendance__empty-icon {
  color: var(--text-subtle);
}
</style>
