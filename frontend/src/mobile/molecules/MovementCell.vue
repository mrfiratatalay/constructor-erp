<script setup lang="ts">
import { computed } from 'vue'
import type { MovementRow } from '@/core/api/generated/model'
import { shortDay } from '@/core/format/dates'
import { movementFrom, movementTo } from '@/core/materials/movementEnds'
import { withUnit } from '@/core/materials/quantity'
import MovementStatusTag from '@/mobile/atoms/MovementStatusTag.vue'
import MaterialGlyph from '@/shared/atoms/MaterialGlyph.vue'
import MovementTypeBadge from '@/shared/atoms/MovementTypeBadge.vue'

/**
 * Telefondaki hareket satırı: solda malzemenin simgesi, ortada ad ve yolu ("Ana Depo → Çamburnu Plaza"), sağda
 * miktar ve gün; altında tür rozeti ve durum etiketi. Dokununca ayrıntı açılır. İptal edilen satır soluk durur.
 */
const { row } = defineProps<{ row: MovementRow }>()
const emit = defineEmits<{ open: [] }>()
const route = computed(() => `${movementFrom(row)} → ${movementTo(row)}`)
</script>

<template>
  <van-cell clickable :class="{ 'movement-cell--cancelled': row.status === 'CANCELLED' }" @click="emit('open')">
    <template #icon><MaterialGlyph :name="row.materialName" :size="38" /></template>
    <template #title>
      <div class="movement-cell__body">
        <strong>{{ row.materialName }}</strong>
        <span class="movement-cell__route">{{ route }}</span>
        <van-space :size="6" wrap>
          <MovementTypeBadge :type="row.type" size="small" />
          <MovementStatusTag :status="row.status" />
        </van-space>
      </div>
    </template>
    <template #value>
      <div class="movement-cell__side">
        <strong>{{ withUnit(row.quantity, row.unit) }}</strong>
        <small>{{ shortDay(row.day) }}</small>
      </div>
    </template>
  </van-cell>
</template>

<style scoped>
.movement-cell__body {
  display: grid;
  gap: 4px;
  min-width: 0;
  margin-left: var(--space-3);
}

.movement-cell__route {
  overflow: hidden;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movement-cell__side {
  display: grid;
  justify-items: end;
  color: var(--text-strong);
  white-space: nowrap;
}

.movement-cell__side small {
  color: var(--text-subtle);
}

.movement-cell--cancelled {
  opacity: 0.55;
}
</style>
