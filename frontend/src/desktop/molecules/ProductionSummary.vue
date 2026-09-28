<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ChartColumn, CircleCheck, Clock, Layers } from 'lucide-vue-next'
import type { BoardSummary } from '@/core/production/productionBoard'

/**
 * İmalat sekmesinin üstü, birkaç saniyede şantiyenin durumu: aktif imalat, tamamlanan (ve oranı), geciken, son 24
 * saatte güncellenen. Yalnızca gösterge (tıklanmaz; süzgeç altında, kendi kontrolüyle durur). Renk Element Plus'ın
 * anlam renklerinden gelir; geciken varsa kırmızı, yoksa sessiz.
 */
const { summary } = defineProps<{ summary: BoardSummary }>()

interface Card {
  title: string
  value: number
  unit: string
  note: string
  icon: Component
  color: 'primary' | 'success' | 'danger' | 'info'
}

const cards = computed<Card[]>(() => [
  { title: 'Aktif imalat', value: summary.active, unit: 'iş kalemi', note: `Toplam ${summary.total} kalem`,
    icon: Layers, color: 'primary' },
  { title: 'Tamamlanan', value: summary.completed, unit: 'iş kalemi', note: `%${summary.completedPercent} tamamlandı`,
    icon: CircleCheck, color: 'success' },
  { title: 'Geciken', value: summary.delayed, unit: 'kayıt', note: 'Planın gerisinde', icon: Clock,
    color: summary.delayed ? 'danger' : 'info' },
  { title: 'Bugün güncellenen', value: summary.updatedToday, unit: 'imalat', note: 'Son 24 saat', icon: ChartColumn,
    color: 'primary' },
])
</script>

<template>
  <div class="production-summary">
    <el-card v-for="card in cards" :key="card.title" shadow="never">
      <el-statistic :value="card.value">
        <template #title>
          <el-space :size="6" :style="{ color: `var(--el-color-${card.color})` }">
            <component :is="card.icon" :size="16" />
            <el-text>{{ card.title }}</el-text>
          </el-space>
        </template>
        <template #suffix><el-text type="info">{{ card.unit }}</el-text></template>
      </el-statistic>
      <el-text size="small" :type="card.color === 'danger' ? 'danger' : 'info'">{{ card.note }}</el-text>
    </el-card>
  </div>
</template>

<style scoped>
/*
 * Panelin genişliğine göre (ekranın değil; şantiye listesi açıkken panel dar): dar panelde 2 × 2, genişte yan yana
 * dört kart. Üç + bir kalan yarım satır olmaz. Kap sınırı ProductionPanel'de (container-type).
 */
.production-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

@container production (min-width: 760px) {
  .production-summary {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
