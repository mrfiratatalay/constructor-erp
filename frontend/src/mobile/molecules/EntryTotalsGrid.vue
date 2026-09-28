<script setup lang="ts">
import { computed } from 'vue'
import type { RowTotals } from '@/core/puantaj/puantajBook'
import { hoursText } from '@/core/puantaj/puantajLabels'

/** Kişinin ya da ekibin ayının toplamları. Çalıştığı gün yarım günleri yarım sayar; mesai saat olarak. */
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
</script>

<template>
  <van-grid :column-num="items.length" :border="false">
    <van-grid-item v-for="item in items" :key="item.title" :text="item.title">
      <template #icon><b>{{ hoursText(item.value) }}</b></template>
    </van-grid-item>
  </van-grid>
</template>
