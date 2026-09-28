<script setup lang="ts">
import { computed } from 'vue'
import type { RowTotals } from '@/core/puantaj/puantajBook'
import { hoursText, type MarkLike } from '@/core/puantaj/puantajLabels'
import MarkDot from '@/mobile/atoms/MarkDot.vue'
import { ICON_TITLE_GAP } from '@/mobile/cellLayout'

/**
 * Kişinin ya da ekibin ayının toplamları, satır satır; başlarında takvimdeki dairenin aynısı: toplamlar aynı zamanda
 * takvimin açıklamasıdır (ayrı bir renk açıklaması gerekmez). Çalıştığı gün yarım günleri yarım sayar (yevmiye buna
 * göre); mesai saat olarak. Ekipte yalnızca geldiği ve gelmediği gün.
 */
const { totals, kind } = defineProps<{ totals: RowTotals; kind: 'PERSON' | 'CREW' }>()

interface TotalLine {
  title: string
  value: string
  mark: MarkLike
}

const days = (count: number) => `${hoursText(count)} gün`

const lines = computed<TotalLine[]>(() =>
  kind === 'CREW'
    ? [
        { title: 'Geldiği gün', value: days(totals.worked), mark: { status: 'PRESENT' } },
        { title: 'Gelmediği gün', value: days(totals.absent), mark: { status: 'ABSENT' } },
      ]
    : [
        { title: 'Çalıştığı gün', value: days(totals.worked), mark: { status: 'PRESENT' } },
        { title: 'Mesai', value: `${hoursText(totals.overtime)} saat`, mark: { status: 'PRESENT', overtimeHours: 1 } },
        { title: 'Yarım gün', value: days(totals.half), mark: { status: 'HALF_DAY' } },
        { title: 'Gelmedi', value: days(totals.absent), mark: { status: 'ABSENT' } },
        { title: 'İzinli', value: days(totals.leave), mark: { status: 'LEAVE' } },
      ],
)
</script>

<template>
  <van-cell-group inset title="Ayın özeti">
    <!-- Daire hücrenin ikon yerinde: dikey ortalı durur (başlığın içinde yazının taban çizgisine oturup kayıyordu). -->
    <van-cell v-for="line in lines" :key="line.title" center :title="line.title" :title-style="ICON_TITLE_GAP"
      :value="line.value">
      <template #icon><MarkDot :mark="line.mark" /></template>
    </van-cell>
  </van-cell-group>
</template>
