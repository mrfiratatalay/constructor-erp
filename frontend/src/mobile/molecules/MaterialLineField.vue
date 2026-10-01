<script setup lang="ts">
import type { MaterialView } from '@/core/api/generated/model'
const quantity = defineModel<number | null>('quantity', { required: true })
const { material } = defineProps<{ material: MaterialView | null }>()
const emit = defineEmits<{ pick: []; remove: [] }>()

function onQuantity(value: string) {
  quantity.value = value === '' ? null : Number(value)
}
</script>

<template>
  <div class="material-line">
    <van-cell is-link center :title="material?.name ?? 'Malzeme seçin'" @click="emit('pick')" />
    <van-field :model-value="quantity ?? ''" type="number" inputmode="decimal" label="Miktar"
      placeholder="0" @update:model-value="onQuantity">
      <template #button>
        <div class="material-line__actions">
          <span v-if="material" class="material-line__unit">{{ material.unit }}</span>
          <van-button size="mini" plain type="danger" icon="delete-o" aria-label="Malzeme satırını sil"
            @click="emit('remove')" />
        </div>
      </template>
    </van-field>
  </div>
</template>

<style scoped>
.material-line__actions { display: flex; align-items: center; gap: var(--space-3); }
.material-line__unit { color: var(--text-muted); font-size: var(--text-sm); }
</style>
