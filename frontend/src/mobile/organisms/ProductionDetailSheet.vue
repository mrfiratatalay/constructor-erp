<script setup lang="ts">
import { computed } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { ProductionEntryView } from '@/core/api/generated/model'
import { fullDate } from '@/core/format/dates'
import {
  barPercent,
  entryAmount,
  percentLabel,
  PRODUCTION_STATUS,
  quantityLabel,
} from '@/core/production/productionFormat'
import { useProductionDetail } from '@/core/production/useProductionDetail'
import { confirmAction } from '@/mobile/confirmAction'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import ProductionEntryCell from '@/mobile/molecules/ProductionEntryCell.vue'
import { tagColor } from '@/mobile/markTones'

/**
 * İmalatın detayı, alttan: özet (toplam, tamamlanan, kalan, ilerleme, tarihler) ve gün gün günlük geçmiş. Şef yanlış
 * girişi sola kaydırıp siler (onay sorulur); "Güncelle" yeni giriş açar.
 */
const show = defineModel<boolean>('show', { required: true })
const { siteId, itemId, canEnter } = defineProps<{ siteId: string; itemId: string | null; canEnter: boolean }>()
const emit = defineEmits<{ update: [] }>()
const { item, days, isLoading, deleteEntry } = useProductionDetail(() => siteId, () => itemId)
const status = computed(() => (item.value ? PRODUCTION_STATUS[item.value.status] : null))
const amount = (value: number) => `${quantityLabel(value)} ${item.value?.unit ?? ''}`
const dateOr = (isoDate: string | null | undefined) => (isoDate ? fullDate(isoDate) : '—')

async function remove(entry: ProductionEntryView) {
  const agreed = await confirmAction({ title: 'Giriş silinsin mi?', message: 'Toplamdan düşer.', confirm: 'Sil' })
  if (!agreed) return
  await deleteEntry(entry).then(() => showSuccessToast('Giriş silindi'), (error) => showFailToast(errorMessage(error)))
}
</script>

<template>
  <van-action-sheet v-model:show="show" :title="item?.name ?? 'İş kalemi'" teleport="body">
    <van-skeleton v-if="isLoading || !item || !status" title :row="5" class="detail-sheet__loading" />
    <template v-else>
      <van-cell-group inset>
        <van-cell title="Durum"><template #value><StatusTag :tone="status.tone">{{ status.label }}</StatusTag></template></van-cell>
        <van-cell title="Taşeron" :value="item.crew?.name ?? 'Atanmadı'" />
        <van-cell title="Toplam" :value="amount(item.totalQuantity)" />
        <van-cell title="Tamamlanan" :value="amount(item.doneQuantity)" />
        <van-cell title="Kalan" :value="amount(item.remainingQuantity)" />
        <van-cell title="İlerleme" :value="percentLabel(item.percent)">
          <template #label>
            <van-progress :percentage="barPercent(item.percent)" :show-pivot="false" stroke-width="6"
              :color="tagColor(status.tone)" />
          </template>
        </van-cell>
        <van-cell title="Başlangıç" :value="dateOr(item.startDate)" />
        <van-cell title="Planlanan bitiş" :value="dateOr(item.plannedEnd)" />
        <van-cell v-if="item.note" title="Açıklama" :label="item.note" />
      </van-cell-group>
      <van-empty v-if="!days.length" image-size="64" description="Henüz günlük giriş yok" />
      <van-cell-group v-for="day in days" :key="day.day" inset :title="`${day.title} · ${entryAmount(day.total, item.unit)}`"
        class="detail-sheet__day">
        <ProductionEntryCell v-for="entry in day.entries" :key="entry.id" :entry="entry" :unit="item.unit"
          :can-delete="canEnter" @remove="remove(entry)" />
      </van-cell-group>
      <div v-if="canEnter && item.status !== 'COMPLETED'" class="detail-sheet__submit">
        <van-button type="primary" block round icon="edit" @click="emit('update')">Güncelle</van-button>
      </div>
    </template>
  </van-action-sheet>
</template>

<style scoped>
.detail-sheet__loading {
  padding: var(--space-4) 0;
}

.detail-sheet__day {
  margin-top: var(--space-3);
}

.detail-sheet__submit {
  padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom));
}
</style>
