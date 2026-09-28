<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUp, EllipsisVertical, Pencil, UserRound } from 'lucide-vue-next'
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
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import TradeIcon from '@/shared/atoms/TradeIcon.vue'

/**
 * Bir imalat, tek kartta: simge, ad ve taşeron, durum, düğmeler; altında "58,5 / 120 ton · %48,8" ve çubuk; en
 * altta "↑ Bugün +3,5 ton · 61,5 ton kaldı" ve son güncelleme. Güncelle ve ⋮ (Düzenle, Sil) yalnızca şefte;
 * biten işte Güncelle çıkmaz.
 */
const { item, canEnter } = defineProps<{ item: ProductionItemView; canEnter: boolean }>()
const emit = defineEmits<{ detail: []; update: []; edit: []; remove: [] }>()

/** Çubuk durumun renginde: Element Plus'ın anlam renkleri (süren iş mavi). */
const BAR_COLOR = { progress: 'primary', warning: 'warning', danger: 'danger', success: 'success', neutral: 'info' }
const status = computed(() => PRODUCTION_STATUS[item.status])
const onMenu = (command: 'edit' | 'remove') => (command === 'edit' ? emit('edit') : emit('remove'))
</script>

<template>
  <el-card shadow="hover" class="item-row" data-testid="production-item">
    <div class="item-row__head">
      <TradeIcon :trade="item.trade" />
      <div class="item-row__title">
        <el-text tag="b" size="large" truncated>{{ item.name }}</el-text>
        <el-text size="small" type="info">
          <el-space :size="4"><UserRound :size="13" />{{ item.crew?.name ?? 'Taşeron atanmadı' }}</el-space>
        </el-text>
      </div>
      <StatusTag :tone="status.tone">{{ status.label }}</StatusTag>
      <el-button @click="emit('detail')">Detay</el-button>
      <el-button v-if="canEnter && item.status !== 'COMPLETED'" type="primary" plain :icon="Pencil"
        @click="emit('update')">Güncelle</el-button>
      <el-dropdown v-if="canEnter" trigger="click" @command="onMenu">
        <el-button text circle :icon="EllipsisVertical" aria-label="Diğer" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="edit">Düzenle</el-dropdown-item>
            <el-dropdown-item command="remove" divided>Sil</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="item-row__figures">
      <el-text tag="b">{{ progressLine(item) }}</el-text>
      <el-text tag="b">{{ percentLabel(item.percent) }}</el-text>
    </div>
    <el-progress :percentage="barPercent(item.percent)" :show-text="false" :stroke-width="8"
      :color="`var(--el-color-${BAR_COLOR[status.tone]})`" />
    <div class="item-row__foot">
      <el-text size="small" :type="item.todayQuantity > 0 ? 'success' : 'info'">
        <el-space :size="2"><ArrowUp :size="13" />{{ todayLine(item) }}</el-space>
      </el-text>
      <el-text size="small" type="info">{{ remainingLine(item) }}</el-text>
      <el-text size="small" type="info" class="item-row__updated">
        Son güncelleme: {{ lastUpdateLabel(item.lastEntryAt) }}
      </el-text>
    </div>
  </el-card>
</template>

<style scoped>
.item-row :deep(.el-card__body) {
  display: grid;
  gap: var(--space-2);
}

.item-row__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.item-row__title {
  display: grid;
  flex: 1;
  min-width: 0;
}

/* Element Plus yan yana düğmelere sol boşluk verir; aralığı gap tek başına belirlesin. */
.item-row__head :deep(.el-button + .el-button) {
  margin-left: 0;
}

.item-row__figures,
.item-row__foot {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.item-row__figures {
  justify-content: space-between;
  margin-top: var(--space-1);
}

.item-row__updated {
  margin-left: auto;
}
</style>
