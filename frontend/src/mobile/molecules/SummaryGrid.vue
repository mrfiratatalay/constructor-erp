<script setup lang="ts">
import { ArrowUpRight, Boxes, Clock3, Truck } from 'lucide-vue-next'
import type { MaterialSummary } from '@/core/api/generated/model'

type SummaryKey = 'materials' | 'toSite' | 'outbound' | 'returns'

/**
 * Telefonda özet kartları 2 × 2: simge, büyük sayı ve birimi, ne saydığı. Dokununca listeyi o konuya süzer ya da
 * ilgili paneli açar (masaüstündekiyle aynı davranış).
 */
const { summary } = defineProps<{ summary: MaterialSummary | undefined }>()
const emit = defineEmits<{ open: [key: SummaryKey] }>()
const cards = [
  { key: 'materials', title: 'Toplam Malzeme', unit: 'kalem', icon: Boxes, tone: 'site', value: (s: MaterialSummary) => s.activeMaterials },
  { key: 'toSite', title: 'Bu Ay Şantiyelere', unit: 'hareket', icon: Truck, tone: 'used', value: (s: MaterialSummary) => s.sentToSitesThisMonth },
  { key: 'outbound', title: 'Dışarı Verilen', unit: 'hareket', icon: ArrowUpRight, tone: 'out', value: (s: MaterialSummary) => s.outboundThisMonth },
  { key: 'returns', title: 'Beklenen İadeler', unit: 'kayıt', icon: Clock3, tone: 'return', value: (s: MaterialSummary) => s.awaitingReturns },
] as const
</script>

<template>
  <div class="summary-grid">
    <button v-for="card in cards" :key="card.key" type="button" class="summary-grid__card"
      :class="`summary-grid__card--${card.tone}`" @click="emit('open', card.key)">
      <span class="summary-grid__icon" aria-hidden="true"><component :is="card.icon" :size="18" /></span>
      <span class="summary-grid__title">{{ card.title }}</span>
      <van-skeleton v-if="!summary" :row="1" row-width="60%" />
      <span v-else class="summary-grid__value"><strong>{{ card.value(summary) }}</strong> {{ card.unit }}</span>
      <span v-if="card.key === 'returns' && summary?.overdueReturns" class="summary-grid__alert">
        {{ summary.overdueReturns }} tanesinin tarihi geçti
      </span>
    </button>
  </div>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.summary-grid__card {
  display: grid;
  gap: 6px;
  justify-items: start;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text-strong);
  font: inherit;
  text-align: left;
}

.summary-grid__icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--tone-bg);
  color: var(--tone-fg);
}

.summary-grid__title {
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.summary-grid__value strong {
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
}

.summary-grid__alert {
  color: var(--status-danger);
  font-size: var(--text-xs);
}

.summary-grid__card--site { --tone-fg: var(--move-site); --tone-bg: var(--move-site-bg); }
.summary-grid__card--used { --tone-fg: var(--move-used); --tone-bg: var(--move-used-bg); }
.summary-grid__card--out { --tone-fg: var(--move-out); --tone-bg: var(--move-out-bg); }
.summary-grid__card--return { --tone-fg: var(--move-return); --tone-bg: var(--move-return-bg); }
</style>
