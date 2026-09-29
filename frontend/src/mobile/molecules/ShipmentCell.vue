<script setup lang="ts">
import { computed } from 'vue'
import type { ShipmentRow } from '@/core/api/generated/model'
import { cancelledLabel, linesText, routeText, waitingText } from '@/core/shipments/shipmentLabels'

/**
 * Listedeki bir sevkiyat: nereden nereye ve ne götürdüğü. WhatsApp'ın sohbet satırı gibi tek satırda okunur;
 * kaç kalem taşıdığı "+2 kalem" diye özetlenir. Normal sevkiyat rozet almaz — yalnızca iptal ve geciken iade.
 */
const { row } = defineProps<{ row: ShipmentRow }>()
defineEmits<{ open: [shipmentId: string] }>()

const cancelled = computed(() => cancelledLabel(row.status))
const waiting = computed(() => waitingText(row))
const label = computed(() => {
  const waits = waiting.value
  return waits ? `${linesText(row.lines)} · ${waits}` : linesText(row.lines)
})
</script>

<template>
  <van-cell is-link center :title="routeText(row)" :label="label" @click="$emit('open', row.id)">
    <template v-if="cancelled || waiting" #value>
      <van-tag v-if="cancelled" type="danger" round size="medium">{{ cancelled }}</van-tag>
      <van-tag v-else type="warning" plain round size="medium">Dışarıda</van-tag>
    </template>
  </van-cell>
</template>
