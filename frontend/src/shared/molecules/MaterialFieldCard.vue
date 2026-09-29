<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import type { FieldMaterialRef } from '@/core/api/generated/model'
import { STATUS_LOOKS } from '@/core/materials/materialLabels'
import { movementNumber, withUnit } from '@/core/materials/quantity'
import MovementTypeBadge from '@/shared/atoms/MovementTypeBadge.vue'

/**
 * Saha akışındaki malzeme gönderisinin kartı: türü, hareket numarası, malzeme ve miktar, hareketin **güncel** durumu.
 * Gönderi yalnızca referanstır; hareket iptal edilirse kart "İptal" der. Dokununca hareketin ayrıntısı açılır.
 */
const { reference } = defineProps<{ reference: FieldMaterialRef }>()
const emit = defineEmits<{ open: [movementId: string] }>()
const status = computed(() => STATUS_LOOKS[reference.status])
</script>

<template>
  <button type="button" class="material-card" :class="{ 'material-card--cancelled': reference.status === 'CANCELLED' }"
    @click="emit('open', reference.movementId)">
    <MovementTypeBadge :type="reference.type" size="small" />
    <span class="material-card__what">
      <strong>{{ reference.materialName }}, {{ withUnit(reference.quantity, reference.unit) }}</strong>
      <small>{{ movementNumber(reference.number) }} · <span :class="`material-card__status--${status.tone}`">{{ status.label }}</span></small>
    </span>
    <ChevronRight :size="16" class="material-card__chevron" aria-hidden="true" />
  </button>
</template>

<style scoped>
.material-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
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

.material-card__status--success { color: var(--status-success); }
.material-card__status--warning { color: var(--status-warning); }
.material-card__status--danger { color: var(--status-danger); }
.material-card__status--primary { color: var(--brand-primary); }
.material-card__status--info { color: var(--status-neutral); }
</style>
