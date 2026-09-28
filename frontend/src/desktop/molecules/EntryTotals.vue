<script setup lang="ts">
import { computed } from 'vue'
import type { RowTotals } from '@/core/puantaj/puantajBook'

/**
 * Kişinin ya da ekibin ayının toplamları. Çalıştığı gün yarım günleri yarım sayar (yevmiye buna göre); mesai
 * saat olarak. Ekipte yalnızca geldiği ve gelmediği gün.
 */
const { totals, kind } = defineProps<{ totals: RowTotals; kind: 'PERSON' | 'CREW' }>()

const items = computed(() =>
  kind === 'CREW'
    ? [
        { title: 'Geldiği gün', value: totals.worked },
        { title: 'Gelmediği gün', value: totals.absent },
      ]
    : [
        { title: 'Çalıştığı gün', value: totals.worked },
        { title: 'Mesai (saat)', value: totals.overtime },
        { title: 'Gelmedi', value: totals.absent },
        { title: 'İzinli', value: totals.leave },
      ],
)
const precisionOf = (value: number) => (Number.isInteger(value) ? 0 : 1)
</script>

<template>
  <el-row :gutter="12">
    <el-col v-for="item in items" :key="item.title" :span="24 / items.length">
      <el-card shadow="never">
        <el-statistic :title="item.title" :value="item.value" :precision="precisionOf(item.value)"
          decimal-separator="," />
      </el-card>
    </el-col>
  </el-row>
</template>
