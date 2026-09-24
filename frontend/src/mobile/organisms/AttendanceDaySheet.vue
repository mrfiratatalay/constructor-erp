<script setup lang="ts">
import { computed } from 'vue'
import { useGetAttendanceDay } from '@/core/api/generated/attendance/attendance'
import { ATTENDANCE_STATUS, markLabel } from '@/core/attendance/attendanceLabels'
import { clockTime, fullDate } from '@/core/format/dates'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

/**
 * Geçmişte bir güne dokununca alttan açılan gün detayı: günün sayıları ve kişi kişi durum. Kişiye dokununca
 * o kişinin geçmişi, "Düzenle" ile o günün yoklaması açılır (yanlış işaret düzeltilir).
 */
const { siteId, day } = defineProps<{ siteId: string; day: string | null }>()
const emit = defineEmits<{ close: []; edit: [day: string]; openWorker: [workerId: string] }>()

const { data: detail, isLoading } = useGetAttendanceDay(() => siteId, () => day ?? '', {
  query: { enabled: computed(() => day !== null) },
})
const takenBy = computed(() => {
  const value = detail.value
  return value?.recordedAt ? `Yoklamayı alan: ${value.recordedByName ?? ''} · ${clockTime(value.recordedAt)}` : ''
})
</script>

<template>
  <van-popup :show="day !== null" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @update:show="(open: boolean) => !open && emit('close')">
    <section v-if="day" class="day-sheet">
      <header class="day-sheet__head">
        <h2>{{ fullDate(day) }}</h2>
        <p v-if="takenBy">{{ takenBy }}</p>
      </header>
      <van-skeleton v-if="isLoading" :row="5" />
      <template v-else-if="detail">
        <p class="day-sheet__counts">
          <StatusTag tone="success">{{ detail.counts.present }} geldi</StatusTag>
          <StatusTag tone="danger">{{ detail.counts.absent }} gelmedi</StatusTag>
          <StatusTag tone="warning">{{ detail.counts.excused }} izinli</StatusTag>
        </p>
        <van-cell-group inset class="day-sheet__group">
          <van-cell v-for="entry in detail.entries" :key="entry.worker.id" :title="entry.worker.fullName"
            :label="entry.note ?? undefined" center is-link @click="emit('openWorker', entry.worker.id)">
            <template #value>
              <StatusTag :tone="ATTENDANCE_STATUS[entry.status].tone">{{ markLabel(entry.status, entry.reason) }}</StatusTag>
            </template>
          </van-cell>
        </van-cell-group>
      </template>
      <van-button round block @click="emit('edit', day)">Düzenle</van-button>
    </section>
  </van-popup>
</template>

<style scoped>
.day-sheet {
  display: grid;
  gap: var(--space-3);
  max-height: 86dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) var(--space-4);
}

.day-sheet__head {
  padding-right: var(--space-8);
}

.day-sheet__head h2 {
  margin: 0;
  font-size: var(--text-lg);
}

.day-sheet__head p {
  margin: 2px 0 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.day-sheet__counts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
}

/* Beyaz pencerede beyaz grup kaybolmasın: liste hafif zeminli bir blok (kişi paneli gibi). */
.day-sheet__group {
  --van-cell-background: var(--surface-muted);
}
</style>
