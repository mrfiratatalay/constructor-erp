<script setup lang="ts">
import type { ShipmentLineView } from '@/core/api/generated/model'
import { withUnit } from '@/core/shipments/quantity'

defineProps<{ lines: ShipmentLineView[] }>()
</script>

<template>
  <section class="movement-materials">
    <h3>MALZEMELER <span>{{ lines.length }} kalem</span></h3>
    <ul>
      <li v-for="line in lines" :key="line.materialId">
        <span>{{ line.materialName }}</span><strong>{{ withUnit(line.quantity, line.unit) }}</strong>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.movement-materials h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 12px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: .08em;
  font-weight: var(--weight-bold);
}
.movement-materials h3 span { font-weight: var(--weight-medium); letter-spacing: 0; color: var(--text-subtle); }
.movement-materials ul { list-style: none; margin: 0; padding: 0; }
.movement-materials li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-soft);
  font-size: var(--text-sm);
}
.movement-materials li:last-child { border-bottom: 0; padding-bottom: 0; }
.movement-materials li:first-child { padding-top: 0; }
.movement-materials strong { color: var(--text-strong); white-space: nowrap; font-weight: var(--weight-semibold); }
</style>
