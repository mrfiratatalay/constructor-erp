<script setup lang="ts">
import { ArrowDown, ArrowRight, Building2, HardHat, Warehouse } from 'lucide-vue-next'
import type { ShipmentRow } from '@/core/api/generated/model'
import { endpointKind } from '@/core/shipments/movementPresentation'

defineProps<{ row: ShipmentRow; vertical?: boolean }>()
const iconOf = (kind: string) => kind === 'SITE' ? HardHat : kind === 'EXTERNAL' ? Building2 : Warehouse
</script>

<template>
  <div class="shipment-route" :class="{ 'shipment-route--vertical': vertical }">
    <span class="shipment-route__point" :title="row.fromName ?? undefined">
      <component :is="iconOf(endpointKind(row, 'from'))" :size="16" aria-hidden="true" />
      <span>{{ row.fromName || 'Belirtilmedi' }}</span>
    </span>
    <component :is="vertical ? ArrowDown : ArrowRight" class="shipment-route__arrow" :size="16" aria-label="hedef" />
    <span class="shipment-route__point" :title="row.toName ?? undefined">
      <component :is="iconOf(endpointKind(row, 'to'))" :size="16" aria-hidden="true" />
      <span>{{ row.toName || 'Belirtilmedi' }}</span>
    </span>
  </div>
</template>

<style scoped>
.shipment-route { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); color: var(--text-strong); }
.shipment-route__point { display: inline-flex; align-items: center; gap: 7px; min-width: 0; font-weight: var(--weight-semibold); }
.shipment-route__point svg { flex: none; color: var(--text-muted); }
.shipment-route__arrow { flex: none; color: var(--text-subtle); }
.shipment-route--vertical { align-items: flex-start; flex-direction: column; gap: var(--space-3); }
.shipment-route--vertical .shipment-route__point { gap: var(--space-3); }
.shipment-route--vertical .shipment-route__arrow { margin-left: 0; }
</style>
