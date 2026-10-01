<script setup lang="ts">
import { ArrowDown, ArrowRight, Building2, HardHat, Warehouse } from 'lucide-vue-next'
import type { ShipmentRow } from '@/core/api/generated/model'
import { endpointKind } from '@/core/shipments/movementPresentation'

defineProps<{ row: ShipmentRow; vertical?: boolean; reverse?: boolean }>()
const iconOf = (kind: string) => kind === 'SITE' ? HardHat : kind === 'EXTERNAL' ? Building2 : Warehouse
</script>

<template>
  <div class="shipment-route" :class="{ 'shipment-route--vertical': vertical }">
    <span class="shipment-route__point">
      <component :is="iconOf(endpointKind(row, reverse ? 'to' : 'from'))" :size="17" aria-hidden="true" />
      <span>{{ (reverse ? row.toName : row.fromName) || 'Belirtilmedi' }}</span>
    </span>
    <component :is="vertical ? ArrowDown : ArrowRight" :size="15" class="shipment-route__arrow" aria-label="hedef" />
    <span class="shipment-route__point">
      <component :is="iconOf(endpointKind(row, reverse ? 'from' : 'to'))" :size="17" aria-hidden="true" />
      <span>{{ (reverse ? row.fromName : row.toName) || 'Belirtilmedi' }}</span>
    </span>
  </div>
</template>

<style scoped>
.shipment-route { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
.shipment-route__point { display: inline-flex; align-items: flex-start; gap: 7px; min-width: 0; font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-strong); }
.shipment-route__point svg { flex: none; margin-top: 1px; color: var(--text-muted); }
.shipment-route__point span { overflow-wrap: anywhere; }
.shipment-route__arrow { flex: none; color: var(--text-subtle); }
.shipment-route--vertical { flex-direction: column; align-items: flex-start; gap: var(--space-2); }
.shipment-route--vertical .shipment-route__arrow { margin-left: 1px; }
</style>
