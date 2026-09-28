<script setup lang="ts">
import { computed } from 'vue'
import { CHIP_TYPES, TYPE_LOOKS, type MovementType } from '@/core/materials/materialLabels'

/**
 * Tür çipleri yan yana, parmakla kayar: Tümü ve türler, sayılarıyla. Seçili çip dolu lacivert. Sayım çipi yalnızca
 * sayım düzeltmesi varsa görünür.
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
  <div class="type-chips">
    <van-button v-for="chip in chips" :key="chip.key ?? 'all'" size="small" round
      :type="type === chip.key ? 'primary' : 'default'" :aria-pressed="type === chip.key" @click="type = chip.key">
      {{ chip.label }} · {{ countOf(chip.key) }}
    </van-button>
  </div>
</template>

<style scoped>
/* Çipler tek satırda kalır ve yatay kayar; sayfanın kenarına kadar uzanır ki kaydırılabildiği görünsün. */
.type-chips {
  display: flex;
  gap: var(--space-2);
  margin-inline: calc(-1 * var(--space-4));
  padding-inline: var(--space-4);
  overflow-x: auto;
  scrollbar-width: none;
}

.type-chips > * {
  flex: none;
}
</style>
