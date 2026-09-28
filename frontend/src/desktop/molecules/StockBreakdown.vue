<script setup lang="ts">
import { ClipboardList } from 'lucide-vue-next'
import type { StockRow } from '@/core/api/generated/model'
import { withUnit } from '@/core/materials/quantity'
import LocationLabel from '@/desktop/atoms/LocationLabel.vue'

/**
 * Stok satırı açılınca lokasyon kırılımı: "Ana Depo 900 · Çamburnu 650", her biri toplamın payı kadar çubukla.
 * Kullanılabilire girmeyen miktarlar (yolda, kontrol bekleyen, dışarıda) ayrıca yazar. Yetkili kişi lokasyonun
 * satırından sayım düzeltmesi girer.
 */
const { row, canAdjust } = defineProps<{ row: StockRow; canAdjust: boolean }>()
const emit = defineEmits<{ adjust: [locationId: string] }>()
const share = (quantity: number) => (row.available > 0 ? Math.round((quantity / row.available) * 100) : 0)
const pending = [
  { key: 'inTransit', label: 'Yolda' },
  { key: 'pendingCheck', label: 'Kontrol bekleyen' },
  { key: 'outside', label: 'Dışarıda (ödünç)' },
] as const
</script>

<template>
  <el-space direction="vertical" alignment="stretch" :size="10" fill style="width: 100%; padding: 8px 56px 16px">
    <el-text v-if="!row.locations.length" type="info">Hiçbir lokasyonda kullanılabilir stok yok.</el-text>
    <el-row v-for="cell in row.locations" :key="cell.locationId" align="middle" :gutter="16">
      <el-col :span="7"><LocationLabel :name="cell.name" :kind="cell.kind" /></el-col>
      <el-col :span="9"><el-progress :percentage="share(cell.quantity)" :show-text="false" :stroke-width="8" /></el-col>
      <el-col :span="5"><el-text tag="b">{{ withUnit(cell.quantity, row.unit) }}</el-text></el-col>
      <el-col :span="3" style="text-align: right">
        <el-button v-if="canAdjust" link type="primary" :icon="ClipboardList" @click="emit('adjust', cell.locationId)">
          Sayım
        </el-button>
      </el-col>
    </el-row>
    <el-space v-if="pending.some((item) => row[item.key] > 0)" wrap :size="16">
      <template v-for="item in pending" :key="item.key">
        <el-text v-if="row[item.key] > 0" type="warning">{{ item.label }}: {{ withUnit(row[item.key], row.unit) }}</el-text>
      </template>
    </el-space>
  </el-space>
</template>
