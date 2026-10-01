<script setup lang="ts">
import { ArrowRight, Building2, CalendarDays, RotateCcw } from 'lucide-vue-next'
import { monthTitle, todayIsoDate } from '@/core/format/dates'
import type { MovementScope } from '@/core/shipments/movementFilters'
import type { MovementSummary } from '@/core/shipments/movementSummary'

defineProps<{ summary: MovementSummary; loading: boolean; unavailable: boolean }>()
defineEmits<{ focus: [scope: MovementScope] }>()
</script>

<template>
  <div class="movement-summary" aria-label="Hareket özeti" :aria-busy="loading">
    <article class="movement-summary__card">
      <div class="movement-summary__label">Bugün <CalendarDays :size="14" aria-hidden="true" /></div>
      <strong data-numeric>{{ loading || unavailable ? '—' : summary.todayCount }} <small>hareket</small></strong>
      <span>{{ loading || unavailable ? '—' : summary.todayPoints }} farklı noktaya</span>
    </article>
    <article class="movement-summary__card">
      <div class="movement-summary__label">Bu ay <CalendarDays :size="14" aria-hidden="true" /></div>
      <strong data-numeric>{{ loading || unavailable ? '—' : summary.monthCount }} <small>hareket</small></strong>
      <span>{{ monthTitle(todayIsoDate()) }}</span>
    </article>
    <button type="button" class="movement-summary__card movement-summary__card--waiting" @click="$emit('focus', 'returns')">
      <div class="movement-summary__label">Geri beklenen <RotateCcw :size="14" aria-hidden="true" /></div>
      <strong data-numeric>{{ loading || unavailable ? '—' : summary.waitingCount }} <small>hareket</small></strong>
      <span>İncele <ArrowRight :size="12" aria-hidden="true" /></span>
    </button>
    <button type="button" class="movement-summary__card" @click="$emit('focus', 'external')">
      <div class="movement-summary__label">Harici <Building2 :size="14" aria-hidden="true" /></div>
      <strong data-numeric>{{ loading || unavailable ? '—' : summary.externalCount }} <small>hareket</small></strong>
      <span>{{ loading || unavailable ? '—' : summary.externalParties }} farklı firma <ArrowRight :size="12" aria-hidden="true" /></span>
    </button>
  </div>
</template>

<style scoped>
.movement-summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
.movement-summary__card { display: grid; align-content: center; gap: 5px; min-width: 0; min-height: 100px; padding: var(--space-3) var(--space-4); border: 1px solid var(--border-soft); border-radius: var(--radius-md); background: var(--surface); color: var(--text-strong); font: inherit; text-align: left; }
button.movement-summary__card { cursor: pointer; }
button.movement-summary__card:active { background: var(--surface-muted); }
.movement-summary__label { display: flex; align-items: center; justify-content: space-between; gap: var(--space-1); color: var(--text-muted); font-size: 10px; font-weight: var(--weight-bold); letter-spacing: .05em; text-transform: uppercase; }
.movement-summary__label svg { flex: none; color: var(--text-subtle); }
.movement-summary strong { font-size: var(--text-xl); line-height: 1.25; }
.movement-summary small { font-size: var(--text-xs); font-weight: var(--weight-medium); }
.movement-summary__card > span { display: flex; align-items: center; gap: 5px; color: var(--text-muted); font-size: 11px; }
.movement-summary__card--waiting { background: color-mix(in srgb, var(--status-warning-bg), white 40%); border-color: color-mix(in srgb, var(--status-warning), white 80%); }
.movement-summary__card--waiting .movement-summary__label, .movement-summary__card--waiting > span, .movement-summary__card--waiting svg { color: var(--status-warning); }
</style>
