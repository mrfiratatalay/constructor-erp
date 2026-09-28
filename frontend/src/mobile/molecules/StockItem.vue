<script setup lang="ts">
import type { StockRow } from '@/core/api/generated/model'
import { withUnit } from '@/core/materials/quantity'
import StockStatusTag from '@/mobile/atoms/StockStatusTag.vue'
import MaterialGlyph from '@/shared/atoms/MaterialGlyph.vue'

/**
 * Stokta bir malzeme: başlıkta ad, toplam kullanılabilir ve durum; açılınca lokasyon lokasyon miktar (yetkili kişi
 * satırdan sayım girer), kullanılabilire girmeyen miktarlar ve "Kartı aç".
 */
const { row, canAdjust, openable = true } = defineProps<{ row: StockRow; canAdjust: boolean; openable?: boolean }>()
const emit = defineEmits<{ open: []; adjust: [locationId: string] }>()
const pending = [
  { key: 'inTransit', label: 'Yolda' },
  { key: 'pendingCheck', label: 'Kontrol bekleyen' },
  { key: 'outside', label: 'Dışarıda (ödünç)' },
] as const
</script>

<template>
  <van-collapse-item :name="row.materialId">
    <template #title>
      <van-space :size="10" align="center">
        <MaterialGlyph :name="row.name" :size="32" />
        <span><strong>{{ row.name }}</strong><br /><small>{{ row.category }}</small></span>
      </van-space>
    </template>
    <template #value>
      <van-space direction="vertical" :size="4" align="end">
        <strong>{{ withUnit(row.available, row.unit) }}</strong>
        <StockStatusTag :status="row.status" />
      </van-space>
    </template>
    <van-cell v-for="cell in row.locations" :key="cell.locationId" :title="cell.name"
      :label="cell.kind === 'DEPOT' ? 'Depo' : 'Şantiye'" :value="withUnit(cell.quantity, row.unit)" center>
      <template v-if="canAdjust" #right-icon>
        <van-button size="mini" plain type="primary" style="margin-left: 8px" @click="emit('adjust', cell.locationId)">
          Sayım
        </van-button>
      </template>
    </van-cell>
    <van-cell v-if="!row.locations.length" title="Hiçbir lokasyonda kullanılabilir stok yok" />
    <template v-for="item in pending" :key="item.key">
      <van-cell v-if="row[item.key] > 0" :title="item.label" :value="withUnit(row[item.key], row.unit)" />
    </template>
    <van-button v-if="openable" block plain round size="small" type="primary" style="margin-top: 8px"
      @click="emit('open')">
      Kartı aç
    </van-button>
  </van-collapse-item>
</template>
