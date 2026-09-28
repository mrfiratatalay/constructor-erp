<script setup lang="ts">
import { computed } from 'vue'
import type { RowTotals } from '@/core/puantaj/puantajBook'
import type { MarkLike } from '@/core/puantaj/puantajLabels'
import MarkDot from '@/desktop/atoms/MarkDot.vue'

/**
 * Kişinin ya da ekibin ayının toplamları. Çalıştığı gün yarım günleri yarım sayar (yevmiye buna göre); mesai
 * saat olarak. Ekipte yalnızca geldiği ve gelmediği gün. Başlıktaki daire takvimdeki işaretin aynısıdır: toplamlar
 * aynı zamanda takvimin açıklamasıdır.
 */
const { totals, kind } = defineProps<{ totals: RowTotals; kind: 'PERSON' | 'CREW' }>()

interface TotalItem {
  title: string
  value: number
  unit: string
  mark: MarkLike
}

/** Başlıklar kısa, birim sayının yanında: dar panelde "Çalıştığı gün" iki satıra kırılıp kartları eşitsiz yapıyordu. */
const items = computed<TotalItem[]>(() =>
  kind === 'CREW'
    ? [
        { title: 'Geldi', value: totals.worked, unit: 'gün', mark: { status: 'PRESENT' } },
        { title: 'Gelmedi', value: totals.absent, unit: 'gün', mark: { status: 'ABSENT' } },
      ]
    : [
        { title: 'Çalıştı', value: totals.worked, unit: 'gün', mark: { status: 'PRESENT' } },
        { title: 'Mesai', value: totals.overtime, unit: 'saat', mark: { status: 'PRESENT', overtimeHours: 1 } },
        { title: 'Gelmedi', value: totals.absent, unit: 'gün', mark: { status: 'ABSENT' } },
        { title: 'İzinli', value: totals.leave, unit: 'gün', mark: { status: 'LEAVE' } },
      ],
)
const precisionOf = (value: number) => (Number.isInteger(value) ? 0 : 1)
</script>

<template>
  <el-row :gutter="12">
    <el-col v-for="item in items" :key="item.title" :span="24 / items.length">
      <el-card shadow="never">
        <el-statistic :value="item.value" :precision="precisionOf(item.value)" decimal-separator=",">
          <template #title>
            <el-space :size="8"><MarkDot :mark="item.mark" />{{ item.title }}</el-space>
          </template>
          <template #suffix><el-text type="info" size="small"> {{ item.unit }}</el-text></template>
        </el-statistic>
      </el-card>
    </el-col>
  </el-row>
</template>
