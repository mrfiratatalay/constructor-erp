<script setup lang="ts">
import { computed } from 'vue'
import type { MaterialView } from '@/core/api/generated/model'
import { withUnit } from '@/core/shipments/quantity'

/**
 * Sevkiyatın bir kalemi: malzeme ve miktar. Seçme işini üstteki form yapar (tek seçici, her satıra bir tane
 * değil); burada yalnızca seçilen gösterilir. Seçilince altında o yerdeki kalan yazar ("Depoda: 300 Torba"):
 * ayrı bir stok ekranı yoktur, sayı merak edildiği tek anda burada durur.
 */
const quantity = defineModel<number | null>('quantity', { required: true })
const { material, available } = defineProps<{ material: MaterialView | null; available: number }>()
const emit = defineEmits<{ pick: []; remove: [] }>()

const stockText = computed(() => (material ? `Depoda: ${withUnit(available, material.unit)}` : ''))

function onQuantity(value: string) {
  quantity.value = value === '' ? null : Number(value)
}
</script>

<template>
  <van-swipe-cell>
    <van-cell is-link center :title="material?.name ?? 'Malzeme seç'" :label="stockText" @click="emit('pick')" />
    <van-field :model-value="quantity ?? ''" type="number" inputmode="decimal" label="Miktar" placeholder="0"
      :suffix="material?.unit" @update:model-value="onQuantity" />
    <template #right>
      <van-button square type="danger" text="Sil" class="line__remove" @click="emit('remove')" />
    </template>
  </van-swipe-cell>
</template>

<style scoped>
.line__remove {
  height: 100%;
}
</style>
