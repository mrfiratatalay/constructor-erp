<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import { useGetWorkerAttendanceMonth } from '@/core/api/generated/attendance/attendance'
import { ATTENDANCE_STATUS, markLabel } from '@/core/attendance/attendanceLabels'
import { useMonthParam } from '@/core/attendance/useMonthParam'
import { dayTitle } from '@/core/format/dates'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'
import MonthSwitcher from '@/desktop/molecules/MonthSwitcher.vue'

/**
 * Sağ panelde bir personelin ayı: kaç gün geldi, gelmedi, izinliydi; altında gün gün durum, neden ve not
 * (en yeni üstte). "‹" şantiyenin yoklama geçmişine döner, aynı ayda.
 */
const { siteId, workerId } = defineProps<{ siteId: string; workerId: string }>()
const router = useRouter()
const { month, setMonth, isCurrentMonth } = useMonthParam()
const { data: history, isLoading } = useGetWorkerAttendanceMonth(() => workerId, () => ({ month: month.value }))

const back = () => router.push({ name: 'siteAttendance', params: { siteId }, query: { ay: month.value } })
</script>

<template>
  <DetailPane>
    <template #header>
      <div class="worker-attendance__head">
        <el-button circle aria-label="Şantiyenin yoklamasına dön" @click="back"><ChevronLeft :size="18" /></el-button>
        <span class="worker-attendance__title">
          <strong>{{ history?.worker.fullName }}</strong>
          <span v-if="history?.worker.trade">{{ history.worker.trade }}</span>
        </span>
        <MonthSwitcher :month="month" :can-go-forward="!isCurrentMonth" @change="setMonth" />
      </div>
    </template>
    <el-skeleton v-if="isLoading" :rows="5" animated />
    <template v-else-if="history">
      <p class="worker-attendance__counts">
        <StatusTag tone="success">{{ history.counts.present }} gün geldi</StatusTag>
        <StatusTag tone="danger">{{ history.counts.absent }} gün gelmedi</StatusTag>
        <StatusTag tone="warning">{{ history.counts.excused }} gün izinli</StatusTag>
      </p>
      <div v-if="history.days.length" class="worker-attendance__list">
        <ListRow v-for="item in history.days" :key="item.day">
          <template #title>{{ dayTitle(item.day) }}</template>
          <template #meta>
            <StatusTag :tone="ATTENDANCE_STATUS[item.status].tone">{{ markLabel(item.status, item.reason) }}</StatusTag>
          </template>
          <template v-if="item.note">{{ item.note }}</template>
        </ListRow>
      </div>
      <el-empty v-else :image-size="72" description="Bu ay yoklamada adı geçmiyor." />
    </template>
  </DetailPane>
</template>

<style scoped>
.worker-attendance__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.worker-attendance__title {
  display: grid;
  flex: 1;
  min-width: 0;
}

.worker-attendance__title strong {
  font-size: var(--text-md);
  font-weight: var(--weight-black);
}

.worker-attendance__title span {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.worker-attendance__counts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
}

.worker-attendance__list {
  overflow: hidden;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}
</style>
