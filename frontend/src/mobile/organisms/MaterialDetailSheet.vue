<script setup lang="ts">
import type { MaterialView } from '@/core/api/generated/model'
import { fileSize } from '@/core/format/fileSize'
import { movementNumber, withUnit } from '@/core/materials/quantity'
import { dueText } from '@/core/materials/useAwaitingReturns'
import { useMaterialOverview } from '@/core/materials/useMaterialOverview'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import StockStatusTag from '@/mobile/atoms/StockStatusTag.vue'
import MovementCell from '@/mobile/molecules/MovementCell.vue'
import StockItem from '@/mobile/molecules/StockItem.vue'

/**
 * Telefonda malzeme detayı, alttan (adres: ?kart=…): özet sayılar, lokasyon dağılımı, son hareketler, iadesi
 * beklenen ödünçler ve belgeler. "Tüm hareketleri gör" listeyi bu malzemeyle süzer.
 */
const { materialId } = defineProps<{ materialId: string | null }>()
const emit = defineEmits<{
  close: []
  openMovement: [id: string]
  showMovements: [materialId: string]
  edit: [material: MaterialView]
  adjust: [materialId: string, locationId: string | null]
  takeReturn: [loanId: string]
}>()
const { overview, recent, totals } = useMaterialOverview(() => materialId)
const { can } = useMaterialPermissions()
</script>

<template>
  <van-popup :show="!!materialId" position="bottom" round closeable teleport="body" :style="{ height: '88dvh' }"
    @update:show="(value: boolean) => !value && emit('close')">
    <div v-if="overview" class="material-detail">
      <div class="material-detail__head">
        <strong>{{ overview.material.name }}</strong>
        <van-space :size="6">
          <span>{{ overview.material.category }} · {{ overview.material.unit }}</span>
          <StockStatusTag :status="overview.stock.status" />
        </van-space>
      </div>
      <van-grid :column-num="2" :border="false" class="material-detail__stats">
        <van-grid-item>
          <template #text><small>Toplam kullanılabilir</small><strong>{{ withUnit(overview.stock.available, overview.stock.unit) }}</strong></template>
        </van-grid-item>
        <van-grid-item><template #text><small>Depolarda</small><strong>{{ withUnit(totals.depots, overview.stock.unit) }}</strong></template></van-grid-item>
        <van-grid-item><template #text><small>Şantiyelerde</small><strong>{{ withUnit(totals.sites, overview.stock.unit) }}</strong></template></van-grid-item>
        <van-grid-item><template #text><small>Dışarıda (ödünç)</small><strong>{{ withUnit(overview.stock.outside, overview.stock.unit) }}</strong></template></van-grid-item>
      </van-grid>
      <van-collapse :model-value="[overview.material.id]" :border="false">
        <StockItem :row="overview.stock" :can-adjust="can('STOCK_ADJUSTMENT')" :openable="false"
          @adjust="(locationId) => emit('adjust', overview!.material.id, locationId)" />
      </van-collapse>
      <van-cell-group inset title="Son hareketler">
        <MovementCell v-for="row in recent" :key="row.id" :row="row" @open="emit('openMovement', row.id)" />
        <van-cell title="Tüm hareketleri gör" is-link @click="emit('showMovements', overview.material.id)" />
      </van-cell-group>
      <van-cell-group v-if="overview.awaitingReturns.length" inset title="Beklenen iadeler">
        <van-cell v-for="loan in overview.awaitingReturns" :key="loan.movementId" center
          :title="`${loan.partyName ?? 'Firma'} · ${withUnit(loan.remaining, loan.unit)} bekliyor`"
          :label="`${movementNumber(loan.number)} · ${dueText(loan)}`">
          <template v-if="can('CREATE_MATERIAL_MOVEMENT')" #right-icon>
            <van-button size="small" type="primary" round @click="emit('takeReturn', loan.movementId)">İade Al</van-button>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-if="overview.documents.length" inset title="Belgeler">
        <van-cell v-for="line in overview.documents" :key="line.document.id" :title="line.document.fileName"
          :label="movementNumber(line.movementNumber)" :value="fileSize(line.document.sizeBytes)" :url="line.document.url"
          is-link />
      </van-cell-group>
      <van-space class="material-detail__actions" :size="8" fill>
        <van-button v-if="can('STOCK_ADJUSTMENT')" round block @click="emit('adjust', overview.material.id, null)">
          Sayım düzeltmesi
        </van-button>
        <van-button v-if="can('MANAGE_MATERIAL_CATALOG')" type="primary" plain round block
          @click="emit('edit', overview.material)">Kartı düzenle</van-button>
      </van-space>
    </div>
    <van-skeleton v-else :row="8" style="padding-top: 48px" />
  </van-popup>
</template>

<style scoped>
.material-detail {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5) 0 calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.material-detail__head {
  display: grid;
  gap: var(--space-1);
  padding: 0 var(--space-10) 0 var(--space-4);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.material-detail__head strong {
  color: var(--text-strong);
  font-size: var(--text-lg);
}

.material-detail__stats :deep(.van-grid-item__content) {
  display: grid;
  gap: 2px;
  justify-items: start;
  margin: 0 var(--space-2);
  border-radius: var(--radius-md);
}

.material-detail__stats small {
  color: var(--text-muted);
}

.material-detail__stats strong {
  font-size: var(--text-md);
}

.material-detail__actions {
  padding: 0 var(--space-4);
}
</style>
