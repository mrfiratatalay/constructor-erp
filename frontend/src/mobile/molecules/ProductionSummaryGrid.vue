<script setup lang="ts">
import { computed } from 'vue'
import type { BoardSummary } from '@/core/production/productionBoard'

/**
 * İmalat sekmesinin özeti, telefonda 2 × 2: aktif, tamamlanan (%), geciken, son 24 saatte güncellenen. Yalnızca
 * gösterge; süzgeç altında. Geciken varsa sayısı kırmızı.
 */
const { summary } = defineProps<{ summary: BoardSummary }>()

const cards = computed(() => [
  { title: 'Aktif iş kalemi', value: summary.active, note: `Toplam ${summary.total} kalem`, alert: false },
  { title: 'Tamamlanan', value: summary.completed, note: `%${summary.completedPercent} tamamlandı`, alert: false },
  { title: 'Geciken', value: summary.delayed, note: 'Planın gerisinde', alert: summary.delayed > 0 },
  { title: 'Bugün güncellenen', value: summary.updatedToday, note: 'Son 24 saat', alert: false },
])
</script>

<template>
  <van-grid :column-num="2" :gutter="8" :border="false" class="summary-grid">
    <van-grid-item v-for="card in cards" :key="card.title">
      <div class="summary-grid__card">
        <span class="summary-grid__title">{{ card.title }}</span>
        <strong class="summary-grid__value" :class="{ 'summary-grid__value--alert': card.alert }">
          {{ card.value }}
        </strong>
        <span class="summary-grid__note">{{ card.note }}</span>
      </div>
    </van-grid-item>
  </van-grid>
</template>

<style scoped>
/* Izgara hücreleri kart gibi: beyaz, yuvarlak köşe (Vant'ın değişkenleriyle). */
.summary-grid {
  --van-grid-item-content-background: var(--surface);
  --van-grid-item-content-padding: var(--space-3) var(--space-4);
}

.summary-grid :deep(.van-grid-item__content) {
  align-items: flex-start;
  border-radius: var(--radius-md);
}

.summary-grid__card {
  display: grid;
  gap: 2px;
}

.summary-grid__title,
.summary-grid__note {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.summary-grid__value {
  font-size: var(--text-xl);
  color: var(--text-strong);
}

.summary-grid__value--alert {
  color: var(--status-danger);
}
</style>
