<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import type { AttendanceDaySummary } from '@/core/api/generated/model'
import { dayCountsLine } from '@/core/attendance/attendanceSummary'
import type { RollRow } from '@/core/attendance/dailyRoll'
import { dayTitle } from '@/core/format/dates'
import AttendanceRollRow from '@/desktop/molecules/AttendanceRollRow.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'

/**
 * Yoklama ekranının "Geçmiş"i: son günler, "24 Eylül Perşembe · 3 geldi · 1 gelmedi". Güne tıklayınca o günün
 * listesi aynı ekranda, satırın hemen altında açılır; tekrar tıklayınca kapanır. Yeni sayfa açılmaz; liste okunur.
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
  <section v-if="days.length" class="recent-days">
    <h2 class="recent-days__title">Geçmiş</h2>
    <div class="recent-days__list">
      <template v-for="item in days" :key="item.day">
        <ListRow :aria-expanded="item.day === openDay" @select="emit('toggle', item.day)">
          <template #title>{{ dayTitle(item.day) }}</template>
          <template #meta>
            <span class="recent-days__meta">
              {{ dayCountsLine(item.counts) }}
              <ChevronUp v-if="item.day === openDay" :size="16" />
              <ChevronDown v-else :size="16" />
            </span>
          </template>
        </ListRow>
        <div v-if="item.day === openDay" class="recent-days__detail">
          <el-skeleton v-if="opening" :rows="3" animated class="recent-days__loading" />
          <AttendanceRollRow v-for="row in openRows" v-else :key="row.worker.id" :row="row" :show-site="showSite" />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.recent-days {
  display: grid;
  gap: var(--space-2);
}

.recent-days__title {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
}

/* Bugün listesiyle aynı beyaz blok. */
.recent-days__list {
  overflow: hidden;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}

.recent-days__meta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

/* Açılan günün listesi satırın altında, hafif zeminle ve içeriden: hangi güne ait olduğu belli olsun. */
.recent-days__detail {
  padding-left: var(--space-6);
  background: var(--surface-muted);
}

.recent-days__detail :deep(.list-row) {
  background: transparent;
  cursor: default;
}

.recent-days__loading {
  padding: var(--space-3) var(--space-4);
}
</style>
