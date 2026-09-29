<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import type { FieldShipmentRef } from '@/core/api/generated/model'
import { shipmentNumber } from '@/core/shipments/quantity'
import { cancelledLabel, TYPE_LABELS } from '@/core/shipments/shipmentLabels'

/**
 * Saha akışındaki malzeme gönderisinin kartı: ne oldu ve neler geldi. Gönderi yalnızca referanstır; sevkiyat
 * iptal edilirse kart onu **güncel** haliyle "İptal" der. Dokununca sevkiyat açılır.
 */
const { reference } = defineProps<{ reference: FieldShipmentRef }>()
const emit = defineEmits<{ open: [shipmentId: string] }>()
const cancelled = computed(() => cancelledLabel(reference.status))
</script>

<template>
  <button type="button" class="material-card" :class="{ 'material-card--cancelled': reference.status === 'CANCELLED' }"
    @click="emit('open', reference.shipmentId)">
    <span class="material-card__what">
      <strong>{{ reference.summary }}</strong>
      <small>
        {{ TYPE_LABELS[reference.type] }} · {{ shipmentNumber(reference.number) }}
        <span v-if="cancelled" class="material-card__cancelled">· {{ cancelled }}</span>
      </small>
    </span>
    <ChevronRight :size="16" class="material-card__chevron" aria-hidden="true" />
  </button>
</template>

<style scoped>
.material-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-2) var(--space-3);
  width: 100%;
  max-width: 440px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text-strong);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.material-card:hover {
  border-color: var(--border-strong);
}

.material-card__what {
  display: grid;
  min-width: 0;
}

.material-card__what strong {
  overflow: hidden;
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.material-card__what small {
  color: var(--text-muted);
  font-size: var(--text-xs);
}

.material-card--cancelled strong {
  color: var(--text-subtle);
  text-decoration: line-through;
}

.material-card__chevron {
  color: var(--text-subtle);
}

.material-card__cancelled {
  color: var(--status-danger);
}
</style>
