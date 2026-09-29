<script setup lang="ts">
import { computed } from 'vue'
import type { ProductionItemView } from '@/core/api/generated/model'
import {
  barPercent,
  lastUpdateLabel,
  percentLabel,
  PRODUCTION_STATUS,
  progressLine,
  remainingLine,
  todayLine,
} from '@/core/production/productionFormat'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import { tagColor } from '@/mobile/markTones'
import TradeIcon from '@/shared/atoms/TradeIcon.vue'

/**
 * Bir imalat, telefonda tek kart: simge, ad, taşeron ve durum (dokununca detay); "58,5 / 120 ton · %48,8" ve
 * durumun renginde çubuk; "↑ Bugün +3,5 ton · 61,5 ton kaldı" ve son güncelleme. Şefte büyük "Güncelle" (biten
 * işte yok): sahanın en sık işi tek dokunuşta.
 */
const { item, canEnter } = defineProps<{ item: ProductionItemView; canEnter: boolean }>()
const emit = defineEmits<{ detail: []; update: [] }>()
const status = computed(() => PRODUCTION_STATUS[item.status])
</script>

<template>
  <van-cell-group inset class="item-card" data-testid="production-item">
    <van-cell center clickable is-link :title="item.name" :label="item.crew?.name ?? 'Taşeron atanmadı'"
      @click="emit('detail')">
      <template #icon><TradeIcon :trade="item.trade" :size="40" class="item-card__icon" /></template>
      <template #value><StatusTag :tone="status.tone">{{ status.label }}</StatusTag></template>
    </van-cell>
    <van-cell>
      <template #title>
        <div class="item-card__figures">
          <strong>{{ progressLine(item) }}</strong>
          <strong>{{ percentLabel(item.percent) }}</strong>
        </div>
        <van-progress :percentage="barPercent(item.percent)" :show-pivot="false" stroke-width="8"
          :color="tagColor(status.tone)" />
        <div class="item-card__foot">
          <span :class="{ 'item-card__today': item.todayQuantity > 0 }">↑ {{ todayLine(item) }}</span>
          <span>{{ remainingLine(item) }}</span>
        </div>
        <div class="item-card__foot">Son güncelleme: {{ lastUpdateLabel(item.lastEntryAt) }}</div>
        <van-button v-if="canEnter && item.status !== 'COMPLETED'" type="primary" plain block round
          icon="edit" class="item-card__update" @click="emit('update')">
          Güncelle
        </van-button>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
.item-card__icon {
  margin-right: var(--space-3);
}

.item-card__figures,
.item-card__foot {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

.item-card__figures {
  margin-bottom: var(--space-2);
  color: var(--text-strong);
}

.item-card__foot {
  margin-top: var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.item-card__today {
  color: var(--status-success);
}

.item-card__update {
  margin-top: var(--space-3);
}
</style>
