<script setup lang="ts">
import { computed } from 'vue'
import { CircleCheck, CircleX } from 'lucide-vue-next'
import { ATTENDANCE_STATUS, markLabel } from '@/core/attendance/attendanceLabels'
import type { RollRow } from '@/core/attendance/dailyRoll'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'

/**
 * Yoklamada bir kişinin tek satırı: ✓ ya da ✕, ad, altında görevi (birden çok şantiye varsa şantiyesi de), sağda
 * durumu ("Geldi", "Gelmedi · Hasta", "İzinli"). Bugünün listesinde de Geçmiş'te açılan günde de aynı satır.
 */
const { row, showSite } = defineProps<{ row: RollRow; showSite: boolean }>()

const tone = computed(() => ATTENDANCE_STATUS[row.mark.status].tone)
const detail = computed(() => [row.worker.trade, showSite ? row.siteName : null].filter(Boolean).join(' · '))
</script>

<template>
  <ListRow>
    <template #leading>
      <CircleCheck v-if="row.mark.status === 'PRESENT'" :size="22" :class="`roll-row__icon--${tone}`" />
      <CircleX v-else :size="22" :class="`roll-row__icon--${tone}`" />
    </template>
    <template #title>{{ row.worker.fullName }}</template>
    <template #meta>
      <StatusTag :tone="tone">{{ markLabel(row.mark.status, row.mark.reason) }}</StatusTag>
    </template>
    <template v-if="detail">{{ detail }}</template>
  </ListRow>
</template>

<style scoped>
.roll-row__icon--success {
  color: var(--status-success);
}

.roll-row__icon--danger {
  color: var(--status-danger);
}

.roll-row__icon--warning {
  color: var(--status-warning);
}
</style>
