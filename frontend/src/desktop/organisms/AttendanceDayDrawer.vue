<script setup lang="ts">
import { computed } from 'vue'
import { useGetAttendanceDay } from '@/core/api/generated/attendance/attendance'
import { ATTENDANCE_STATUS, markLabel } from '@/core/attendance/attendanceLabels'
import { clockTime, fullDate } from '@/core/format/dates'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'

/**
 * Geçmişte bir güne tıklayınca sağdan açılan gün detayı; şantiye bilgi paneliyle aynı yerde, aynı kalıpta.
 * Üstte günün sayıları, altında kişi kişi durum; kişiye tıklayınca o kişinin geçmişi, Düzenle ile o günün
 * yoklaması açılır (yanlış işaret düzeltilir).
 */
const { siteId, day } = defineProps<{ siteId: string; day: string | null }>()
const emit = defineEmits<{ close: []; edit: [day: string]; openWorker: [workerId: string] }>()

const { data: detail, isLoading } = useGetAttendanceDay(() => siteId, () => day ?? '', {
  query: { enabled: computed(() => day !== null) },
})
const takenBy = computed(() => {
  const value = detail.value
  return value?.recordedAt ? `${value.recordedByName ?? ''} · ${clockTime(value.recordedAt)}` : ''
})
</script>

<template>
  <el-drawer :model-value="day !== null" size="400px" :with-header="false"
    @update:model-value="(open: boolean) => !open && emit('close')">
    <div v-if="day" class="day-detail">
      <header class="day-detail__head">
        <span class="day-detail__title">
          <strong>{{ fullDate(day) }}</strong>
          <span v-if="takenBy">Yoklamayı alan: {{ takenBy }}</span>
        </span>
        <el-button @click="emit('edit', day)">Düzenle</el-button>
      </header>
      <el-skeleton v-if="isLoading" :rows="5" animated />
      <template v-else-if="detail">
        <p class="day-detail__counts">
          <StatusTag tone="success">{{ detail.counts.present }} geldi</StatusTag>
          <StatusTag tone="danger">{{ detail.counts.absent }} gelmedi</StatusTag>
          <StatusTag tone="warning">{{ detail.counts.excused }} izinli</StatusTag>
        </p>
        <div class="day-detail__list">
          <ListRow v-for="entry in detail.entries" :key="entry.worker.id" @select="emit('openWorker', entry.worker.id)">
            <template #title>{{ entry.worker.fullName }}</template>
            <template #meta>
              <StatusTag :tone="ATTENDANCE_STATUS[entry.status].tone">{{ markLabel(entry.status, entry.reason) }}</StatusTag>
            </template>
            <template v-if="entry.note">{{ entry.note }}</template>
          </ListRow>
        </div>
      </template>
    </div>
  </el-drawer>
</template>

<style scoped>
.day-detail {
  display: grid;
  gap: var(--space-4);
}

.day-detail__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.day-detail__title {
  display: grid;
}

.day-detail__title strong {
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.day-detail__title span {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.day-detail__counts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
}

.day-detail__list {
  overflow: hidden;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}
</style>
