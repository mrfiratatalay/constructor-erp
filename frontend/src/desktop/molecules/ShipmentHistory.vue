<script setup lang="ts">
import { History } from 'lucide-vue-next'
import type { HistoryEntry } from '@/core/api/generated/model'
import { clockTime, dayWithYear } from '@/core/format/dates'
import { HISTORY_LABELS } from '@/core/shipments/shipmentLabels'

defineProps<{ entries: HistoryEntry[] }>()
</script>

<template>
  <section class="movement-history">
    <h3><History :size="14" /> HAREKET GEÇMİŞİ</h3>
    <ol>
      <li v-for="entry in entries" :key="`${entry.kind}-${entry.at}`">
        <span class="movement-history__dot" />
        <div>
          <strong>{{ HISTORY_LABELS[entry.kind] ?? entry.kind }}</strong>
          <p v-if="entry.note" class="movement-history__note">{{ entry.note }}</p>
          <p class="movement-history__meta">
            {{ entry.actorName }} · {{ dayWithYear(entry.at) }} · {{ clockTime(entry.at) }}
          </p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.movement-history { padding-top: 24px; border-top: 1px solid var(--border-soft); }
.movement-history h3 {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 18px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: .08em;
}
.movement-history ol { list-style: none; margin: 0; padding: 0; }
.movement-history li { display: flex; gap: 13px; position: relative; padding-bottom: 20px; }
.movement-history li:last-child { padding-bottom: 0; }
.movement-history li:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 14px;
  bottom: 0;
  width: 1px;
  background: var(--border-soft);
}
.movement-history__dot {
  flex: 0 0 9px;
  height: 9px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--border-strong);
}
.movement-history strong { font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-semibold); }
.movement-history p { margin: 4px 0 0; font-size: 11px; }
.movement-history__meta { color: var(--text-subtle); }
.movement-history__note { color: var(--text-muted); white-space: pre-wrap; overflow-wrap: anywhere; }
</style>
