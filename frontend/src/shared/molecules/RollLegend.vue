<script setup lang="ts">
import { CALENDAR_LEGEND } from '@/core/rollcall/memberCalendar'

/** Takvimin altındaki açıklama: her rengin işareti ve adı (renk tek başına anlam taşımaz, TASARIM.md İlke 2). */
</script>

<template>
  <ul class="roll-legend">
    <li v-for="item in CALENDAR_LEGEND" :key="item.kind" class="roll-legend__item">
      <span class="roll-legend__swatch" :class="item.className" aria-hidden="true">{{ item.symbol }}</span>
      {{ item.label }}
    </li>
  </ul>
</template>

<style scoped>
.roll-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  margin: 0;
  padding: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  list-style: none;
}

.roll-legend__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.roll-legend__swatch {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: var(--roll-bg);
  color: var(--roll-fg);
  font-size: 12px;
  font-weight: var(--weight-bold);
}
</style>
