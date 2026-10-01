<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { ShipmentRow } from '@/core/api/generated/model'
import { clockTime, dayWithYear } from '@/core/format/dates'
import { shipmentNumber, withUnit } from '@/core/shipments/quantity'
import { movementTypeLabel } from '@/core/shipments/movementPresentation'
import ShipmentStatusTag from '@/mobile/atoms/ShipmentStatusTag.vue'
import ShipmentRoute from '@/mobile/molecules/ShipmentRoute.vue'

defineProps<{ row: ShipmentRow }>()
defineEmits<{ open: [shipmentId: string] }>()
</script>

<template>
  <button type="button" class="shipment-card" :class="{ 'shipment-card--cancelled': row.status === 'CANCELLED' }"
    :aria-label="`${shipmentNumber(row.number)} hareketinin ayrıntısını aç`" @click="$emit('open', row.id)">
    <div class="shipment-card__head">
      <span class="shipment-card__number">{{ shipmentNumber(row.number) }}</span><ShipmentStatusTag :row="row" />
    </div>
    <div class="shipment-card__route"><ShipmentRoute :row="row" /></div>
    <span class="shipment-card__type">{{ movementTypeLabel(row.type) }}</span>
    <div v-if="row.lines[0]" class="shipment-card__material">
      <span>{{ row.lines[0].materialName }}</span><strong>{{ withUnit(row.lines[0].quantity, row.lines[0].unit) }}</strong>
    </div>
    <span v-if="row.lines.length > 1" class="shipment-card__more">+{{ row.lines.length - 1 }} malzeme daha</span>
    <div class="shipment-card__footer">
      <span>{{ dayWithYear(row.day) }} · {{ clockTime(row.createdAt) }}<small>{{ row.createdByName }}</small></span>
      <ChevronRight :size="17" aria-hidden="true" />
    </div>
  </button>
</template>

<style scoped>
.shipment-card { display: block; width: 100%; padding: var(--space-4); border: 1px solid var(--border-soft); border-radius: var(--radius-md); background: var(--surface); box-shadow: var(--shadow-sm); color: var(--text-strong); font: inherit; text-align: left; cursor: pointer; }
.shipment-card:active { background: var(--surface-muted); }
.shipment-card__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-2); }
.shipment-card__number { color: var(--text-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
.shipment-card__route { margin-top: var(--space-3); }
.shipment-card__type { display: block; margin-top: 5px; color: var(--text-muted); font-size: 11px; }
.shipment-card__material { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-3); margin-top: var(--space-4); font-size: var(--text-sm); }
.shipment-card__material strong { flex: none; font-size: var(--text-xs); font-weight: var(--weight-semibold); }
.shipment-card__more { display: inline-block; margin-top: 5px; color: var(--text-muted); font-size: 11px; }
.shipment-card__footer { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--border-soft); color: var(--text-muted); font-size: 11px; }
.shipment-card__footer small { display: block; margin-top: 3px; color: var(--text-subtle); font-size: 11px; }
.shipment-card__footer svg { color: var(--text-subtle); }
.shipment-card--cancelled .shipment-card__route { opacity: .6; }
</style>
