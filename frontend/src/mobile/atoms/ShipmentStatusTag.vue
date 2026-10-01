<script setup lang="ts">
import { computed } from 'vue'
import type { ShipmentRow } from '@/core/api/generated/model'
import { movementStatus } from '@/core/shipments/movementPresentation'

const { row } = defineProps<{ row: ShipmentRow }>()
const status = computed(() => movementStatus(row))
const tagType = computed(() => status.value.tone === 'info' ? 'primary' : status.value.tone)
</script>

<template>
  <van-tag :type="tagType" class="shipment-status">
    <span class="shipment-status__dot" aria-hidden="true" />{{ status.label }}
  </van-tag>
</template>

<style scoped>
.shipment-status { gap: 5px; flex: none; border-radius: 6px; font-size: 11px; font-weight: var(--weight-semibold); padding: 3px 7px; }
.shipment-status__dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
</style>
