<script setup lang="ts">
import { computed } from 'vue'
import { CHIP_TYPES, TYPE_LOOKS, type MovementType } from '@/core/materials/materialLabels'

/**
 * Hızlı süzgeç çipleri: Tümü ve türler, her birinde sayısı (tür dışındaki süzgeçlerle sayılır). Seçili çip dolu
 * lacivert. Sayım çipi yalnızca sayım düzeltmesi varsa görünür: çoğu firmada yoktur, boş çip gürültüdür.
 */
const type = defineModel<MovementType | null>({ required: true })
const { countOf } = defineProps<{ countOf: (type: MovementType | null) => number }>()
const chips = computed(() => [
  { key: null, label: 'Tümü' },
  ...CHIP_TYPES.filter((item) => item !== 'ADJUSTMENT' || countOf(item) > 0).map((item) => ({
    key: item,
    label: TYPE_LOOKS[item].chip,
  })),
])
</script>

<template>
  <el-space wrap :size="10">
    <el-button v-for="chip in chips" :key="chip.key ?? 'all'" round :type="type === chip.key ? 'primary' : 'default'"
      :aria-pressed="type === chip.key" @click="type = chip.key">
      {{ chip.label }}<span class="chip-count">{{ countOf(chip.key) }}</span>
    </el-button>
  </el-space>
</template>

<style scoped>
/* Sayı düğmenin kendi renginden türer: seçiliyken beyaz üstünde yarı saydam, değilken gri zeminde. */
.chip-count {
  min-width: 26px;
  margin-left: 8px;
  padding: 1px 7px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 12%, transparent);
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
}
</style>
