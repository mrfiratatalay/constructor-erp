<script setup lang="ts">
import type { Tone } from '@/core/billing/billingLabels'

/** Özet ekranındaki tek sayı: etiket, değer ve kısa açıklama; soldaki ince şerit anlamın rengidir. */
const { label, value, hint, tone = 'primary' } = defineProps<{ label: string; value: string; hint?: string; tone?: Tone }>()
</script>

<template>
  <div class="stat-tile" :class="`stat-tile--${tone}`">
    <span class="stat-tile__label">{{ label }}</span>
    <strong class="stat-tile__value">{{ value }}</strong>
    <small v-if="hint">{{ hint }}</small>
  </div>
</template>

<style scoped>
.stat-tile {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--border-soft);
  border-left-width: 4px;
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.stat-tile__label {
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.stat-tile__value {
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;
}

.stat-tile small {
  color: var(--text-subtle);
  font-size: var(--text-xs);
}

.stat-tile--primary { border-left-color: var(--brand-primary); }
.stat-tile--success { border-left-color: var(--status-success); }
.stat-tile--warning { border-left-color: var(--status-warning); }
.stat-tile--danger { border-left-color: var(--status-danger); }
.stat-tile--info { border-left-color: var(--border-strong); }
</style>
