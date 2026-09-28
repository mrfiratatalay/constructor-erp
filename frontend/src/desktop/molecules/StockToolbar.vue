<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Search, Tag, Warehouse } from 'lucide-vue-next'
import type { LocationView, StockRowStatus } from '@/core/api/generated/model'
import { STOCK_LOOKS } from '@/core/materials/materialLabels'
import type { StockFilters } from '@/core/materials/useStockRows'
import LocationSelect from '@/desktop/molecules/LocationSelect.vue'

/**
 * Stok süzgeçleri: arama (ad ya da kod), kategori, lokasyon ve stok durumu. Sağda katalog işleri (yalnızca yetkiliye):
 * yeni depo ve yeni malzeme kartı.
 */
const filters = defineModel<StockFilters>({ required: true })
const { categories, locations, canManage } = defineProps<{
  categories: string[]
  locations: LocationView[]
  canManage: boolean
}>()
const emit = defineEmits<{ createMaterial: []; createDepot: [] }>()
const STATUSES = [
  { value: 'ALL', label: 'Tümü' },
  ...(['CRITICAL', 'OUT', 'NORMAL'] as const).map((value) => ({ value, label: STOCK_LOOKS[value].label })),
]
const SELECT = { width: '190px' }
/** Segmented boş değer taşımaz: "Tümü" ayrı bir değerdir. */
const status = computed({
  get: () => filters.value.status ?? 'ALL',
  set: (value: string) => (filters.value.status = value === 'ALL' ? null : (value as StockRowStatus)),
})
</script>

<template>
  <el-row justify="space-between" align="middle" style="row-gap: 10px">
    <el-space wrap :size="10">
      <el-input v-model="filters.q" placeholder="Malzeme adı ya da kodu" clearable size="large" :prefix-icon="Search"
        style="width: 260px" />
      <el-select v-model="filters.category" placeholder="Tüm kategoriler" clearable size="large" :style="SELECT"
        :value-on-clear="null">
        <template #prefix><Tag :size="16" /></template>
        <el-option v-for="category in categories" :key="category" :value="category" :label="category" />
      </el-select>
      <LocationSelect v-model="filters.locationId" :locations="locations" placeholder="Tüm lokasyonlar" clearable
        :style="SELECT" />
      <el-segmented v-model="status" :options="STATUSES" size="large" />
    </el-space>
    <el-space v-if="canManage" :size="10">
      <el-button size="large" :icon="Warehouse" @click="emit('createDepot')">Depo ekle</el-button>
      <el-button size="large" type="primary" plain :icon="Plus" @click="emit('createMaterial')">Yeni Malzeme</el-button>
    </el-space>
  </el-row>
</template>
