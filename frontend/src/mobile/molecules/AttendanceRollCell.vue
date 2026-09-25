<script setup lang="ts">
import { computed } from 'vue'
import { CircleCheck, CircleX } from 'lucide-vue-next'
import { ATTENDANCE_STATUS, markLabel } from '@/core/attendance/attendanceLabels'
import type { RollRow } from '@/core/attendance/dailyRoll'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

/**
 * Yoklamada bir kişinin tek satırı (Vant hücresi): ✓ ya da ✕, ad, altında görevi (birden çok şantiye varsa şantiyesi
 * de), sağda durumu ("Geldi", "Gelmedi · Hasta", "İzinli"). Bugünün listesinde dokunulur, Geçmiş'te yalnızca okunur.
 */
const { row, showSite, clickable = false } = defineProps<{ row: RollRow; showSite: boolean; clickable?: boolean }>()
const emit = defineEmits<{ select: [] }>()

const tone = computed(() => ATTENDANCE_STATUS[row.mark.status].tone)
const detail = computed(() => [row.worker.trade, showSite ? row.siteName : null].filter(Boolean).join(' · '))
</script>

<template>
  <van-cell :title="row.worker.fullName" :label="detail || undefined" center :clickable="clickable"
    @click="clickable && emit('select')">
    <template #icon>
      <CircleCheck v-if="row.mark.status === 'PRESENT'" :size="22" :class="['roll-cell__icon', `roll-cell__icon--${tone}`]" />
      <CircleX v-else :size="22" :class="['roll-cell__icon', `roll-cell__icon--${tone}`]" />
    </template>
    <template #value>
      <StatusTag :tone="tone">{{ markLabel(row.mark.status, row.mark.reason) }}</StatusTag>
    </template>
  </van-cell>
</template>

<style scoped>
.roll-cell__icon {
  flex: none;
  margin-right: var(--space-3);
}

.roll-cell__icon--success {
  color: var(--status-success);
}

.roll-cell__icon--danger {
  color: var(--status-danger);
}

.roll-cell__icon--warning {
  color: var(--status-warning);
}
</style>
