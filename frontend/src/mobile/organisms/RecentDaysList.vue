<script setup lang="ts">
import { computed } from 'vue'
import type { AttendanceDaySummary } from '@/core/api/generated/model'
import { dayCountsLine } from '@/core/attendance/attendanceSummary'
import type { RollRow } from '@/core/attendance/dailyRoll'
import { dayTitle } from '@/core/format/dates'
import AttendanceRollCell from '@/mobile/molecules/AttendanceRollCell.vue'

/**
 * Yoklama ekranının "Geçmiş"i (Vant hücre grubu): son günler, "24 Eylül Perşembe · 3 geldi · 1 gelmedi". Güne
 * dokununca o günün listesi aynı ekranda, günün hemen altında açılır; tekrar dokununca kapanır. Liste okunur.
 */
const { days, openDay, openRows, opening } = defineProps<{
  days: AttendanceDaySummary[]
  openDay: string | null
  openRows: RollRow[]
  opening: boolean
}>()
const emit = defineEmits<{ toggle: [day: string] }>()

const showSite = computed(() => new Set(openRows.map((row) => row.siteId)).size > 1)
</script>

<template>
  <van-cell-group v-if="days.length" inset title="Geçmiş" class="recent-days">
    <template v-for="item in days" :key="item.day">
      <van-cell :title="dayTitle(item.day)" :value="dayCountsLine(item.counts)" center is-link
        :arrow-direction="item.day === openDay ? 'up' : 'down'" @click="emit('toggle', item.day)" />
      <template v-if="item.day === openDay">
        <van-skeleton v-if="opening" :row="3" class="recent-days__loading" />
        <AttendanceRollCell v-for="row in openRows" v-else :key="row.worker.id" :row="row" :show-site="showSite"
          class="recent-days__person" />
      </template>
    </template>
  </van-cell-group>
</template>

<style scoped>
/* Açılan günün kişileri hafif zeminde ve içeriden: hangi güne ait oldukları belli olsun. */
.recent-days__person {
  --van-cell-background: var(--surface-muted);
  padding-left: var(--space-8);
}

.recent-days__loading {
  padding: var(--space-3) var(--space-4);
  background: var(--surface-muted);
}

/* Gün satırının sayıları okunaklı kalsın: Vant'ın değer sütunu varsayılan olarak dar. */
.recent-days :deep(.van-cell__value) {
  flex: none;
}
</style>
