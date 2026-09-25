<script setup lang="ts">
import type { FieldKind } from '@/core/field/fieldKind'
import { clockTime } from '@/core/format/dates'
import FieldKindIcon from '@/shared/atoms/FieldKindIcon.vue'

/**
 * Saha akışının bir satırı: solda saat, ortada dikey eksen ve simge, sağda içerik, en sağda ⋯. Satırlar kart
 * değildir; eksen çizgisi günün ilk satırından sonuncusuna kesintisiz akar. Sorun satırı hafif sarı zemin alır.
 */
const { at, kind } = defineProps<{ at: string; kind: FieldKind | 'pending' }>()
</script>

<template>
  <article class="field-row" :class="{ 'field-row--issue': kind === 'issue', 'field-row--pending': kind === 'pending' }">
    <time class="field-row__time" :datetime="at">{{ clockTime(at) }}</time>
    <span class="field-row__axis"><FieldKindIcon :kind="kind" /></span>
    <div class="field-row__content"><slot /></div>
    <div v-if="$slots.menu" class="field-row__menu"><slot name="menu" /></div>
  </article>
</template>

<style scoped>
.field-row {
  --axis-center: 14px;
  display: grid;
  grid-template-columns: 40px 28px minmax(0, 1fr) auto;
  align-items: start;
  column-gap: clamp(8px, 2vw, 14px);
  padding: var(--space-3) var(--space-2);
  border-radius: var(--radius-md);
}

.field-row--issue {
  background: var(--field-issue-bg);
}

.field-row--pending {
  opacity: 0.7;
}

.field-row__time {
  padding-top: 6px;
  color: var(--text-subtle);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
}

.field-row__axis {
  position: relative;
  display: flex;
  align-self: stretch;
  justify-content: center;
}

/* Eksen satırın dolgusunu da aşar ki komşu satırın çizgisine değsin; günün ucunda simgenin ortasında biter. */
.field-row__axis::before {
  content: '';
  position: absolute;
  top: calc(-1 * var(--space-3));
  bottom: calc(-1 * var(--space-3));
  left: calc(50% - 0.5px);
  width: 1px;
  background: var(--border-strong);
}

.field-row:first-of-type .field-row__axis::before {
  top: var(--axis-center);
}

.field-row:last-of-type .field-row__axis::before {
  bottom: calc(100% - var(--axis-center));
}

.field-row__axis > * {
  position: relative;
}

.field-row__content {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  padding-top: 3px;
}

.field-row__menu {
  margin: -2px -4px 0 0;
}
</style>
