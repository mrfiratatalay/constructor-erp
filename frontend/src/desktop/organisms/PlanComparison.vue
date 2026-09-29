<script setup lang="ts">
import { computed } from 'vue'
import { Check, Minus } from 'lucide-vue-next'
import { includes, limitsOf, priceOf, usePublicPlans } from '@/core/marketing/usePublicPlans'

/** Paketlerin satır satır karşılaştırması: fiyat, sınırlar ve her modül. Satırlar sunucudaki modül listesinden. */
const { plans, features } = usePublicPlans()
const rows = computed(() => [
  { key: 'price', name: 'Aylık fiyat', kind: 'text' as const, value: priceOf },
  { key: 'limits', name: 'Kişi ve şantiye', kind: 'text' as const, value: limitsOf },
  { key: 'core', name: 'Şantiye sohbeti ve saha akışı', kind: 'check' as const, value: () => true },
  ...features.value.map((feature) => ({
    key: feature.key, name: feature.name, kind: 'check' as const, value: (plan: (typeof plans.value)[number]) => includes(plan, feature.key),
  })),
])
type Row = (typeof rows.value)[number]
const asRow = (row: unknown) => row as Row
</script>

<template>
  <el-table v-if="plans.length" :data="rows" row-key="key" class="comparison" size="large">
    <el-table-column label="" min-width="220">
      <template #default="{ row }"><strong>{{ asRow(row).name }}</strong></template>
    </el-table-column>
    <el-table-column v-for="plan in plans" :key="plan.id" :label="plan.name" align="center" min-width="180">
      <template #default="{ row }">
        <template v-if="asRow(row).kind === 'text'">{{ asRow(row).value(plan) }}</template>
        <Check v-else-if="asRow(row).value(plan)" :size="18" class="comparison__yes" aria-label="Var" />
        <Minus v-else :size="18" class="comparison__no" aria-label="Yok" />
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.comparison {
  border-radius: var(--radius-lg);
  --el-table-header-text-color: var(--text-strong);
}

.comparison :deep(th) {
  font-size: var(--text-md);
}

.comparison__yes {
  color: var(--status-success);
}

.comparison__no {
  color: var(--text-subtle);
}
</style>
