<script setup lang="ts">
import type { DayCounts } from '@/core/puantaj/puantajBook'
import { STATUS_LOOKS, UNMARKED, type DayStatus, type StatusLook } from '@/core/puantaj/puantajLabels'
import type { StatusKey } from '@/core/puantaj/useRowFilter'

/**
 * Renklerin açıklaması, aynı zamanda süzgeç: çipe tıklayınca liste yalnızca o durumdakileri gösterir (ör. kalan
 * "İşaretlenmedi"ler). Her çipte bugünün sayısı yazar.
 */
const { counts, selected } = defineProps<{ counts: DayCounts; selected: StatusKey[] }>()
const emit = defineEmits<{ toggle: [key: StatusKey] }>()

const CHIPS: { key: StatusKey; look: StatusLook }[] = [
  ...(Object.keys(STATUS_LOOKS) as DayStatus[]).map((key) => ({ key, look: STATUS_LOOKS[key] })),
  { key: 'UNMARKED', look: UNMARKED },
]
const countOf = (key: StatusKey) => (key === 'UNMARKED' ? counts.unmarked : counts[key])
</script>

<template>
  <el-space wrap :size="8">
    <el-check-tag v-for="chip in CHIPS" :key="chip.key" :type="chip.look.tone" :checked="selected.includes(chip.key)"
      @change="emit('toggle', chip.key)">
      {{ chip.look.label }} · {{ countOf(chip.key) }}
    </el-check-tag>
  </el-space>
</template>
