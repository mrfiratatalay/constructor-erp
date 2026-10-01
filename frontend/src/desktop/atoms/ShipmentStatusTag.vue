<script setup lang="ts">
import type { ShipmentRow } from '@/core/api/generated/model'
import { movementStatus } from '@/core/shipments/movementPresentation'

defineProps<{ row: ShipmentRow }>()
</script>

<template>
  <el-tag :type="movementStatus(row).tone" size="small" effect="light" disable-transitions class="movement-status">
    <span class="movement-status__dot" aria-hidden="true" />{{ movementStatus(row).label }}
  </el-tag>
</template>

<style scoped>
.movement-status {
  height: 26px;
  padding: 0 var(--space-2);
  border: 0;
  border-radius: 6px;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}
.movement-status :deep(.el-tag__content) { display: flex; align-items: center; gap: 6px; }
.movement-status__dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
</style>
