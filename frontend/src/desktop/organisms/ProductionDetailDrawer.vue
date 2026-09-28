<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { ProductionEntryView } from '@/core/api/generated/model'
import { fullDate } from '@/core/format/dates'
import { barPercent, entryAmount, percentLabel, PRODUCTION_STATUS, quantityLabel } from '@/core/production/productionFormat'
import { useProductionDetail } from '@/core/production/useProductionDetail'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ProductionHistoryEntry from '@/desktop/molecules/ProductionHistoryEntry.vue'
import TradeIcon from '@/shared/atoms/TradeIcon.vue'

/**
 * İmalatın detayı, sağdan çekmece: özet (toplam, tamamlanan, kalan, ilerleme, tarihler) ve gün gün günlük geçmiş
 * (miktar, çalışan, not, fotoğraf ve belgeler, giren ve saat). Şef yanlış girişi siler; "Güncelle" yeni giriş açar.
 */
const show = defineModel<boolean>('show', { required: true })
const { siteId, itemId, canEnter } = defineProps<{ siteId: string; itemId: string | null; canEnter: boolean }>()
const emit = defineEmits<{ update: [] }>()
const { item, days, isLoading, deleteEntry } = useProductionDetail(() => siteId, () => itemId)
const status = computed(() => (item.value ? PRODUCTION_STATUS[item.value.status] : null))
const dateOr = (isoDate: string | null | undefined) => (isoDate ? fullDate(isoDate) : '—')

async function remove(entry: ProductionEntryView) {
  try {
    await deleteEntry(entry)
    ElMessage.success('Giriş silindi')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-drawer v-model="show" size="560px" append-to-body>
    <template #header>
      <el-space v-if="item && status" :size="12">
        <TradeIcon :trade="item.trade" />
        <div class="detail__title">
          <el-space :size="8"><el-text tag="b" size="large">{{ item.name }}</el-text>
            <StatusTag :tone="status.tone">{{ status.label }}</StatusTag></el-space>
          <el-text size="small" type="info">Taşeron: {{ item.crew?.name ?? 'atanmadı' }} · {{ item.trade }}</el-text>
        </div>
      </el-space>
    </template>
    <el-skeleton v-if="isLoading || !item" :rows="6" animated />
    <template v-else>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="Toplam">{{ quantityLabel(item.totalQuantity) }} {{ item.unit }}</el-descriptions-item>
        <el-descriptions-item label="Tamamlanan">
          {{ quantityLabel(item.doneQuantity) }} {{ item.unit }}
        </el-descriptions-item>
        <el-descriptions-item label="Kalan">{{ quantityLabel(item.remainingQuantity) }} {{ item.unit }}</el-descriptions-item>
        <el-descriptions-item label="İlerleme">{{ percentLabel(item.percent) }}</el-descriptions-item>
        <el-descriptions-item label="Başlangıç">{{ dateOr(item.startDate) }}</el-descriptions-item>
        <el-descriptions-item label="Planlanan bitiş">{{ dateOr(item.plannedEnd) }}</el-descriptions-item>
      </el-descriptions>
      <el-progress :percentage="barPercent(item.percent)" :format="() => percentLabel(item!.percent)" :stroke-width="8"
        class="detail__bar" />
      <el-text v-if="item.note" type="info">{{ item.note }}</el-text>
      <el-divider content-position="left">Günlük geçmiş</el-divider>
      <el-empty v-if="!days.length" :image-size="64" description="Henüz günlük giriş yok" />
      <el-timeline v-else>
        <el-timeline-item v-for="day in days" :key="day.day" placement="top" type="primary" hollow
          :timestamp="`${day.title} · ${entryAmount(day.total, item.unit)}`">
          <ProductionHistoryEntry v-for="entry in day.entries" :key="entry.id" :entry="entry" :unit="item.unit"
            :can-delete="canEnter" @remove="remove(entry)" />
        </el-timeline-item>
      </el-timeline>
    </template>
    <template v-if="canEnter && item && item.status !== 'COMPLETED'" #footer>
      <el-button type="primary" @click="emit('update')">Güncelle</el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
.detail__title {
  display: grid;
}

.detail__bar {
  margin: var(--space-4) 0 var(--space-2);
}
</style>
