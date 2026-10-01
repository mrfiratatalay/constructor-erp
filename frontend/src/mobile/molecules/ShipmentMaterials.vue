<script setup lang="ts">
import type { ShipmentLineView } from '@/core/api/generated/model'
import { withUnit } from '@/core/shipments/quantity'

defineProps<{ lines: ShipmentLineView[] }>()
</script>

<template>
  <section class="movement-materials">
    <h3>MALZEMELER <span>{{ lines.length }} kalem</span></h3>
    <van-cell-group :border="false">
      <van-cell v-for="line in lines" :key="line.materialId" :title="line.materialName">
        <template #value><strong>{{ withUnit(line.quantity, line.unit) }}</strong></template>
      </van-cell>
    </van-cell-group>
  </section>
</template>

<style scoped>
.movement-materials h3 { display: flex; justify-content: space-between; gap: var(--space-3); margin: 0 0 var(--space-2); color: var(--text-muted); font-size: var(--text-xs); letter-spacing: .05em; }
.movement-materials h3 span { color: var(--text-subtle); font-weight: var(--weight-medium); letter-spacing: 0; }
.movement-materials .van-cell { padding-inline: 0; font-size: var(--text-sm); gap: var(--space-3); }
.movement-materials .van-cell::after { left: 0; right: 0; }
.movement-materials strong { color: var(--text-strong); font-weight: var(--weight-semibold); }
</style>
