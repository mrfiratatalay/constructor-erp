<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import { CalendarDays } from 'lucide-vue-next'
import { useGetSiteAttendanceMonth } from '@/core/api/generated/attendance/attendance'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { countsLine, monthSummary } from '@/core/attendance/attendanceSummary'
import { useMonthParam } from '@/core/attendance/useMonthParam'
import { dayTitle, monthKey, todayIsoDate } from '@/core/format/dates'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import MonthSwitcher from '@/mobile/molecules/MonthSwitcher.vue'
import AttendanceDaySheet from '@/mobile/organisms/AttendanceDaySheet.vue'
import AttendanceSheet from '@/mobile/organisms/AttendanceSheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Bir şantiyenin yoklama geçmişi: ay seçici, tek satır ay özeti, yoklama alınan günler (en yeni üstte).
 * Güne dokununca gün detayı alttan açılır; oradan kişiye geçilir ya da gün düzenlenir. "Bugünün yoklaması"
 * sohbete gitmeden buradan da alınır.
 */
const route = useRoute()
const router = useRouter()
const siteId = computed(() => String(route.params.siteId))
const { data: site } = useGetSite(siteId)
const { month, setMonth, isCurrentMonth } = useMonthParam()
const { data: history, isLoading } = useGetSiteAttendanceMonth(siteId, () => ({ month: month.value }))
const openDay = ref<string | null>(null)
const editingDay = ref<string | null>(null)
const summary = computed(() => monthSummary(history.value))

function edit(day: string) {
  openDay.value = null
  editingDay.value = day
}

/** Kişinin geçmişi, dokunulan günün ayıyla açılır. */
function openWorker(workerId: string) {
  const ay = monthKey(openDay.value ?? undefined)
  openDay.value = null
  void router.push({ name: 'workerAttendance', params: { siteId: siteId.value, workerId }, query: { ay } })
}
</script>

<template>
  <MobilePage title="Yoklama" :subtitle="site?.name ?? ''" back>
    <template #action>
      <van-button size="small" type="primary" round @click="edit(todayIsoDate())">Yoklama al</van-button>
    </template>
    <MonthSwitcher :month="month" :can-go-forward="!isCurrentMonth" @change="setMonth" />
    <p v-if="summary" class="site-attendance__summary">{{ summary }}</p>
    <van-skeleton v-if="isLoading" :row="4" />
    <van-cell-group v-else-if="history?.days.length" inset>
      <van-cell v-for="item in history.days" :key="item.day" :title="dayTitle(item.day)"
        :label="countsLine(item.counts)" center is-link @click="openDay = item.day">
        <template #value>
          <StatusTag v-if="item.counts.absent" tone="danger">{{ item.counts.absent }} gelmedi</StatusTag>
        </template>
      </van-cell>
    </van-cell-group>
    <van-empty v-else description="Bu ay yoklama alınmamış.">
      <template #image><CalendarDays :size="48" class="site-attendance__empty-icon" /></template>
    </van-empty>
    <AttendanceDaySheet :site-id="siteId" :day="openDay" @close="openDay = null" @edit="edit"
      @open-worker="openWorker" />
    <AttendanceSheet :show="editingDay !== null" :site-id="siteId" :site-name="site?.name ?? ''"
      :day="editingDay ?? todayIsoDate()" @update:show="(open: boolean) => !open && (editingDay = null)"
      @saved="showSuccessToast('Kaydedildi')" />
  </MobilePage>
</template>

<style scoped>
.site-attendance__summary {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-align: center;
}

.site-attendance__empty-icon {
  color: var(--text-subtle);
}
</style>
