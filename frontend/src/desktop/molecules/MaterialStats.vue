<script setup lang="ts">
import type { StockRow } from '@/core/api/generated/model'
import { formatQuantity } from '@/core/materials/quantity'

/** Malzemenin özet sayıları: toplam kullanılabilir, depolarda, şantiyelerde, dışarıda (ödünç); birim sayının yanında. */
const { stock, depots, sites, returns } = defineProps<{
  stock: StockRow
  depots: number
  sites: number
  returns: number
}>()
const format = (value: number) => formatQuantity(value)
/** Çekmecedeki dört kart dar: sayı ve birimi tek satırda kalsın diye sayfadaki özet kartlarından küçük. */
const VALUE_STYLE = { fontSize: '22px', whiteSpace: 'nowrap' }
</script>

<template>
  <el-row :gutter="12">
    <el-col v-for="stat in [
      { title: 'Toplam kullanılabilir', value: stock.available },
      { title: 'Depolarda', value: depots },
      { title: 'Şantiyelerde', value: sites },
      { title: 'Dışarıda (ödünç)', value: stock.outside },
    ]" :key="stat.title" :span="6">
      <el-card shadow="never" style="height: 100%">
        <el-statistic :title="stat.title" :value="stat.value" :formatter="format" :suffix="stock.unit"
          :value-style="VALUE_STYLE" />
        <el-text v-if="stat.title.startsWith('Dışarıda') && returns" type="warning" size="small">
          {{ returns }} iade bekleniyor
        </el-text>
      </el-card>
    </el-col>
  </el-row>
</template>
