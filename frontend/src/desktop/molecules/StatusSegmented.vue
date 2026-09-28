<script setup lang="ts">
import { computed } from 'vue'
import { dayProgress, type DayCounts } from '@/core/puantaj/puantajBook'
import { STATUS_LOOKS, type DayStatus, type MarkLike } from '@/core/puantaj/puantajLabels'
import type { FilterKey } from '@/core/puantaj/useRowFilter'
import MarkDot from '@/desktop/atoms/MarkDot.vue'

/**
 * Listenin süzgeci, sekme gibi görünen tek kontrol: Tümü · Bekleyen · Geldi · Yarım gün · Gelmedi · İzinli, her birinde
 * sayısı. Süzgeç olduğu görünüşünden belli; özet kartlarının tıklanabildiğini kimse fark etmiyordu. Sabahın asıl
 * süzgeci "Bekleyen": yalnızca işaretlenmeyenler kalır.
 */
interface FilterOption {
  value: FilterKey
  label: string
  count: number
  /** Başındaki daire; "Tümü"nde yok (undefined), "Bekleyen"de gri halka (null). */
  mark?: MarkLike | null
}

const filter = defineModel<FilterKey>({ required: true })
const { counts } = defineProps<{ counts: DayCounts }>()
const STATUSES = Object.keys(STATUS_LOOKS) as DayStatus[]
const options = computed<FilterOption[]>(() => [
  { value: 'ALL', label: 'Tümü', count: dayProgress(counts).total },
  { value: 'UNMARKED', label: 'Bekleyen', count: counts.unmarked, mark: null },
  ...STATUSES.map((status) => ({ value: status, label: STATUS_LOOKS[status].label, count: counts[status],
    mark: { status } })),
])
const optionOf = (item: unknown) => item as FilterOption
</script>

<template>
  <el-segmented v-model="filter" :options="options" size="large">
    <template #default="{ item }">
      <el-space :size="8">
        <MarkDot v-if="optionOf(item).mark !== undefined" :mark="optionOf(item).mark" />
        <span>{{ optionOf(item).label }}</span>
        <b>{{ optionOf(item).count }}</b>
      </el-space>
    </template>
  </el-segmented>
</template>
