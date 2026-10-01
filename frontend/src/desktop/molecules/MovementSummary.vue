<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Building2, CalendarDays, RotateCcw } from 'lucide-vue-next'
import { monthTitle, todayIsoDate } from '@/core/format/dates'
import type { MovementScope } from '@/core/shipments/movementFilters'
import type { MovementSummary } from '@/core/shipments/movementSummary'

defineProps<{ summary: MovementSummary; loading: boolean; unavailable: boolean }>()
defineEmits<{ focus: [scope: MovementScope] }>()
</script>

<template>
  <div class="movement-summary" aria-label="Hareket özeti" :aria-busy="loading">
    <article class="movement-summary__card">
      <div class="movement-summary__head"><span>Bugün</span><CalendarDays :size="16" aria-hidden="true" /></div>
      <strong data-numeric>{{ loading || unavailable ? '—' : summary.todayCount }} <small>hareket</small></strong>
      <span class="movement-summary__note">{{ loading || unavailable ? '—' : summary.todayPoints }} farklı noktaya</span>
    </article>
    <article class="movement-summary__card">
      <div class="movement-summary__head"><span>Bu ay</span><ArrowUpRight :size="16" aria-hidden="true" /></div>
      <strong data-numeric>{{ loading || unavailable ? '—' : summary.monthCount }} <small>hareket</small></strong>
      <span class="movement-summary__note">{{ monthTitle(todayIsoDate()) }}</span>
    </article>
    <button class="movement-summary__card movement-summary__card--waiting" type="button" @click="$emit('focus', 'returns')">
      <div class="movement-summary__head"><span>Geri beklenen</span><RotateCcw :size="16" aria-hidden="true" /></div>
      <strong data-numeric>{{ loading || unavailable ? '—' : summary.waitingCount }} <small>hareket</small></strong>
      <span class="movement-summary__note">İncele <ArrowRight :size="13" aria-hidden="true" /></span>
    </button>
    <button class="movement-summary__card" type="button" @click="$emit('focus', 'external')">
      <div class="movement-summary__head"><span>Harici hareketler</span><Building2 :size="16" aria-hidden="true" /></div>
      <strong data-numeric>{{ loading || unavailable ? '—' : summary.externalCount }} <small>hareket</small></strong>
      <span class="movement-summary__note">{{ loading || unavailable ? '—' : summary.externalParties }} farklı firma <ArrowRight :size="13" aria-hidden="true" /></span>
    </button>
  </div>
</template>

<style scoped>
.movement-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(195px, 1fr)); gap: var(--space-4); }
.movement-summary__card {
  display: grid;
  align-content: center;
  gap: 6px;
  height: 116px;
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text-strong);
  font: inherit;
  text-align: left;
}
button.movement-summary__card { cursor: pointer; transition: border-color .15s, box-shadow .15s; }
button.movement-summary__card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
.movement-summary__head { display: flex; align-items: center; justify-content: space-between; color: var(--text-muted); font-size: 11px; font-weight: var(--weight-bold); text-transform: uppercase; letter-spacing: .06em; }
.movement-summary__head svg { color: var(--text-subtle); }
.movement-summary__card strong { font-size: var(--text-xl); line-height: 1.3; font-weight: var(--weight-bold); }
.movement-summary__card small { font-size: var(--text-sm); font-weight: var(--weight-medium); }
.movement-summary__note { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: var(--text-xs); }
.movement-summary__card--waiting { background: color-mix(in srgb, var(--status-warning-bg), white 45%); border-color: color-mix(in srgb, var(--status-warning), white 80%); }
.movement-summary__card--waiting .movement-summary__head, .movement-summary__card--waiting .movement-summary__note, .movement-summary__card--waiting svg { color: var(--status-warning); }
</style>
