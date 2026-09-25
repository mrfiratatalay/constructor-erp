<script setup lang="ts">
import { CircleCheck, CircleX } from 'lucide-vue-next'
import { ATTENDANCE_STATUS } from '@/core/attendance/attendanceLabels'
import { reasonLabel, type RollRow } from '@/core/attendance/dailyRoll'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

/**
 * Yoklama ekranında bir bölüm ("Gelenler" ya da "Gelmeyenler"), Vant hücre grubu olarak: başlığında sayısı,
 * satırlarda ✓ ya da ✕, ad, görevi ve (gelmediyse) nedeni. Kişiye dokununca sayfa küçük seçimi açar.
 * showSite: birden çok şantiyenin personeli listedeyse kişinin şantiyesi görevinin yanında küçük yazar.
 */
const { title, rows, showSite } = defineProps<{ title: string; rows: RollRow[]; showSite: boolean }>()
const emit = defineEmits<{ choose: [row: RollRow] }>()

const detailOf = (row: RollRow) => [row.worker.trade, showSite ? row.siteName : null].filter(Boolean).join(' · ')
const toneOf = (row: RollRow) => ATTENDANCE_STATUS[row.mark.status].tone
</script>

<template>
  <van-cell-group inset :title="`${title} ${rows.length}`" class="roll-group">
    <van-cell v-for="row in rows" :key="row.worker.id" :title="row.worker.fullName" :label="detailOf(row) || undefined"
      center clickable @click="emit('choose', row)">
      <template #icon>
        <CircleCheck v-if="row.mark.status === 'PRESENT'" :size="22" :class="['roll-group__icon', `roll-group__icon--${toneOf(row)}`]" />
        <CircleX v-else :size="22" :class="['roll-group__icon', `roll-group__icon--${toneOf(row)}`]" />
      </template>
      <template v-if="row.mark.status !== 'PRESENT'" #value>
        <StatusTag :tone="toneOf(row)">{{ reasonLabel(row.mark) }}</StatusTag>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
.roll-group__icon {
  flex: none;
  margin-right: var(--space-3);
}

.roll-group__icon--success {
  color: var(--status-success);
}

.roll-group__icon--danger {
  color: var(--status-danger);
}

.roll-group__icon--warning {
  color: var(--status-warning);
}
</style>
