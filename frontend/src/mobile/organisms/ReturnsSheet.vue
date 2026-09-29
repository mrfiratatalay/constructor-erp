<script setup lang="ts">
import { movementNumber, withUnit } from '@/core/materials/quantity'
import { dueText, overdueDays, useAwaitingReturns } from '@/core/materials/useAwaitingReturns'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'

/**
 * Beklenen iadeler, alttan: firma, malzeme, kalan miktar ve beklenen tarihe kalan gün (geçtiyse kırmızı). "İade Al"
 * formu bu kayıttan dolu açar; satıra dokununca çıkışın ayrıntısı.
 */
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ openMovement: [id: string]; takeReturn: [id: string] }>()
const { rows, overdue } = useAwaitingReturns()
const { can } = useMaterialPermissions()
</script>

<template>
  <van-popup v-model:show="open" position="bottom" round closeable teleport="body" :style="{ maxHeight: '80dvh' }">
    <div class="returns-sheet">
      <h3>Beklenen İadeler</h3>
      <p :class="{ 'returns-sheet__late': overdue }">
        {{ rows.length }} ödünç kaydı{{ overdue ? ` · ${overdue} tanesinin tarihi geçti` : '' }}
      </p>
      <van-empty v-if="!rows.length" description="İadesi beklenen ödünç malzeme yok" />
      <van-cell-group v-else inset>
        <van-cell v-for="row in rows" :key="row.movementId" center clickable @click="emit('openMovement', row.movementId)">
          <template #title>
            <strong>{{ row.partyName ?? 'Firma' }} · {{ row.materialName }}</strong>
            <div class="returns-sheet__meta">
              {{ movementNumber(row.number) }} · {{ withUnit(row.returned, row.unit) }} /
              {{ withUnit(row.quantity, row.unit) }} döndü
            </div>
            <div :class="overdueDays(row) > 0 ? 'returns-sheet__late' : 'returns-sheet__meta'">{{ dueText(row) }}</div>
          </template>
          <template #value>
            <van-space direction="vertical" align="end" :size="6">
              <strong class="returns-sheet__remaining">{{ withUnit(row.remaining, row.unit) }}</strong>
              <van-button v-if="can('CREATE_MATERIAL_MOVEMENT')" size="small" type="primary" round
                @click.stop="emit('takeReturn', row.movementId)">İade Al</van-button>
            </van-space>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </van-popup>
</template>

<style scoped>
.returns-sheet {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-5) 0 calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.returns-sheet h3,
.returns-sheet > p {
  margin: 0;
  padding: 0 var(--space-4);
}

.returns-sheet__meta {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.returns-sheet__late {
  color: var(--status-danger);
  font-size: var(--text-sm);
}

.returns-sheet__remaining {
  color: var(--status-warning);
}
</style>
