<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MonthlyAmount } from '@/core/api/generated/model'
import { niceCeiling, shortMonth, ticksOf } from '@/core/admin/chartScale'
import { formatMoney } from '@/core/format/money'

/**
 * Son ayların tahsilatı: tek seri, sütun grafik. Başlık neyin çizildiğini söyler (lejant yok); yalnızca son ayın değeri
 * sütunun tepesinde yazar, diğerleri eksenden ve üstüne gelince çıkan ipucundan okunur. Ekran okuyucular için aynı
 * veri tablo olarak da durur.
 */
const { months } = defineProps<{ months: MonthlyAmount[] }>()
const ceiling = computed(() => niceCeiling(Math.max(...months.map((month) => month.amount), 0)))
const ticks = computed(() => ticksOf(ceiling.value).reverse())
const hovered = ref<number | null>(null)
const heightOf = (amount: number) => `${(amount / ceiling.value) * 100}%`
</script>

<template>
  <figure class="chart">
    <div class="chart__plot" role="img" :aria-label="`Aylık tahsilat, son ${months.length} ay`">
      <div class="chart__grid" aria-hidden="true">
        <span v-for="tick in ticks" :key="tick">{{ formatMoney(tick) }}</span>
      </div>
      <div class="chart__columns">
        <div v-for="(month, index) in months" :key="month.month" class="chart__slot" tabindex="0"
          @mouseenter="hovered = index" @mouseleave="hovered = null" @focus="hovered = index" @blur="hovered = null">
          <span v-if="index === months.length - 1 && month.amount > 0" class="chart__label"
            :style="{ bottom: heightOf(month.amount) }">{{ formatMoney(month.amount) }}</span>
          <span class="chart__bar" :style="{ height: heightOf(month.amount) }" />
          <span v-if="hovered === index" class="chart__tip" role="tooltip">
            <b>{{ shortMonth(month.month) }}</b> {{ formatMoney(month.amount) }}
          </span>
        </div>
      </div>
      <div class="chart__months" aria-hidden="true">
        <span v-for="month in months" :key="month.month">{{ shortMonth(month.month) }}</span>
      </div>
    </div>
    <table class="chart__table">
      <caption>Aylık tahsilat</caption>
      <tr v-for="month in months" :key="month.month"><th>{{ month.month }}</th><td>{{ formatMoney(month.amount) }}</td></tr>
    </table>
  </figure>
</template>

<style scoped>
.chart {
  margin: 0;
  /* Son ayın tepesindeki tutar etiketi en yüksek sütunda çizim alanının üstüne taşar. */
  padding-top: var(--space-5);
}

.chart__plot {
  position: relative;
  display: grid;
  grid-template-columns: 72px 1fr;
  grid-template-rows: 180px auto;
}

.chart__grid {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart__grid span {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 0;
  color: var(--text-subtle);
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
}

.chart__grid span::after {
  content: '';
  flex: 1;
  border-top: 1px solid var(--chart-grid);
}

.chart__columns {
  grid-column: 2;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-items: end;
}

.chart__slot {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: end;
  height: 100%;
  outline: none;
}

.chart__bar {
  width: 24px;
  min-height: 2px;
  border-radius: 4px 4px 0 0;
  background: var(--chart-series);
  transition: opacity 0.12s;
}

.chart__slot:hover .chart__bar,
.chart__slot:focus-visible .chart__bar {
  opacity: 0.8;
}

.chart__label {
  position: absolute;
  margin-bottom: var(--space-1);
  color: var(--text-strong);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  white-space: nowrap;
}

.chart__tip {
  position: absolute;
  top: -8px;
  z-index: 2;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--text-strong);
  color: var(--surface);
  font-size: var(--text-xs);
  white-space: nowrap;
  pointer-events: none;
}

.chart__months {
  grid-column: 2;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding-top: var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-xs);
  text-align: center;
}

.chart__table {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
