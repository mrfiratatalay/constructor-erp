<script setup lang="ts">
import type { HistoryEntry } from '@/core/api/generated/model'
import { clockTime, dayWithYear } from '@/core/format/dates'
import { HISTORY_LABELS } from '@/core/shipments/shipmentLabels'

defineProps<{ entries: HistoryEntry[] }>()
</script>

<template>
  <section class="movement-history">
    <h3><van-icon name="clock-o" /> HAREKET GEÇMİŞİ</h3>
    <ol>
      <li v-for="(entry, index) in entries" :key="`${entry.kind}-${entry.at}-${index}`">
        <span class="movement-history__dot" />
        <div>
          <strong>{{ HISTORY_LABELS[entry.kind] ?? entry.kind }}</strong>
          <p v-if="entry.note" class="movement-history__note">{{ entry.note }}</p>
          <p class="movement-history__actor">{{ entry.actorName }}</p>
          <time :datetime="entry.at">{{ dayWithYear(entry.at) }} · {{ clockTime(entry.at) }}</time>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.movement-history h3 { display: flex; align-items: center; gap: var(--space-2); margin: 0 0 var(--space-4); color: var(--text-muted); font-size: var(--text-xs); letter-spacing: .05em; }
.movement-history ol { list-style: none; padding: 0; margin: 0; }
.movement-history li { display: flex; position: relative; gap: var(--space-3); padding-bottom: var(--space-5); }
.movement-history li:last-child { padding-bottom: 0; }
.movement-history li:not(:last-child)::after { content: ''; position: absolute; top: 14px; bottom: 0; left: 4px; width: 1px; background: var(--border-soft); }
.movement-history__dot { width: 9px; height: 9px; flex-shrink: 0; margin-top: 5px; border-radius: 50%; background: var(--border-strong); }
.movement-history strong { color: var(--text-muted); font-size: var(--text-sm); font-weight: var(--weight-semibold); }
.movement-history p { margin: var(--space-1) 0 0; font-size: var(--text-xs); }
.movement-history__note { color: var(--text-muted); white-space: pre-wrap; overflow-wrap: anywhere; }
.movement-history__actor, .movement-history time { color: var(--text-subtle); font-size: var(--text-xs); }
</style>
