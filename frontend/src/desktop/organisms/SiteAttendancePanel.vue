<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGetSiteAttendanceMonth } from '@/core/api/generated/attendance/attendance'
import { countsLine, monthSummary } from '@/core/attendance/attendanceSummary'
import { useMonthParam } from '@/core/attendance/useMonthParam'
import { dayTitle, fullDate, monthKey, todayIsoDate } from '@/core/format/dates'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'
import MonthSwitcher from '@/desktop/molecules/MonthSwitcher.vue'
import AttendanceDayDrawer from '@/desktop/organisms/AttendanceDayDrawer.vue'
import AttendanceDialog from '@/desktop/organisms/AttendanceDialog.vue'

/**
 * Sağ panelde bir şantiyenin yoklama geçmişi: ay seçici, tek satır ay özeti, yoklama alınan günler (en yeni
 * üstte). Güne tıklayınca gün detayı, oradan kişiye tıklayınca kişinin geçmişi açılır. "Bugünün yoklaması"
 * sohbete gitmeden buradan da alınır ya da düzenlenir.
 */
const { siteId, siteName } = defineProps<{ siteId: string; siteName: string }>()
const router = useRouter()
const { month, setMonth, isCurrentMonth } = useMonthParam()
const { data: history, isLoading } = useGetSiteAttendanceMonth(() => siteId, () => ({ month: month.value }))
const openDay = ref<string | null>(null)
const editingDay = ref<string | null>(null)

/** "Eylül 2026 · 25 yoklama günü · %92 geldi": ayrı rapor ekranı yerine tek satır özet. */
const summary = computed(() => monthSummary(history.value))

function edit(day: string) {
  openDay.value = null
  editingDay.value = day
}

/** Kişinin geçmişi, tıklanan günün ayıyla açılır. */
function openWorker(workerId: string) {
  const ay = monthKey(openDay.value ?? undefined)
  openDay.value = null
  void router.push({ name: 'workerAttendance', params: { siteId, workerId }, query: { ay } })
}
</script>

<template>
  <DetailPane>
    <template #header>
      <div class="site-attendance__head">
        <span class="site-attendance__title"><strong>{{ siteName }}</strong><span>Yoklama geçmişi</span></span>
        <MonthSwitcher :month="month" :can-go-forward="!isCurrentMonth" @change="setMonth" />
        <el-button type="primary" @click="edit(todayIsoDate())">Bugünün yoklaması</el-button>
      </div>
    </template>
    <p v-if="summary" class="site-attendance__summary">{{ summary }}</p>
    <el-skeleton v-if="isLoading" :rows="5" animated />
    <div v-else-if="history?.days.length" class="site-attendance__list">
      <ListRow v-for="item in history.days" :key="item.day" @select="openDay = item.day">
        <template #title>{{ dayTitle(item.day) }}</template>
        <template #meta>
          <StatusTag v-if="item.counts.absent" tone="danger">{{ item.counts.absent }} gelmedi</StatusTag>
        </template>
        {{ countsLine(item.counts) }}
      </ListRow>
    </div>
    <el-empty v-else :image-size="72" description="Bu ay yoklama alınmamış." />
  </DetailPane>
  <AttendanceDayDrawer :site-id="siteId" :day="openDay" @close="openDay = null" @edit="edit" @open-worker="openWorker" />
  <AttendanceDialog :show="editingDay !== null" :site-id="siteId" :site-name="siteName"
    :day="editingDay ?? todayIsoDate()" @update:show="(open: boolean) => !open && (editingDay = null)"
    @saved="(day: string) => ElMessage.success(`${fullDate(day)} yoklaması kaydedildi.`)" />
</template>

<style scoped>
.site-attendance__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.site-attendance__title {
  display: grid;
  flex: 1;
  min-width: 0;
}

.site-attendance__title strong {
  overflow: hidden;
  font-size: var(--text-md);
  font-weight: var(--weight-black);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-attendance__title span,
.site-attendance__summary {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

/* Satırlar tek bir beyaz blokta: şantiye listesindeki satırların aynısı, panelin gri zemininde. */
.site-attendance__list {
  overflow: hidden;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}
</style>
