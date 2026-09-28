<script setup lang="ts">
import { computed, ref } from 'vue'
import type { StockRowStatus } from '@/core/api/generated/model'
import { STOCK_LOOKS } from '@/core/materials/materialLabels'
import { useMaterialOptions } from '@/core/materials/useMaterialOptions'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { useStockRows } from '@/core/materials/useStockRows'
import StockItem from '@/mobile/molecules/StockItem.vue'

/**
 * Telefonda Stok: "Bu malzeme şu an nerede?" Arama, kategori / lokasyon / durum menüsü; kritik ya da tükenen varsa
 * üstte yazar. Malzemeye dokununca lokasyon kırılımı açılır.
 */
const emit = defineEmits<{ open: [materialId: string]; adjust: [materialId: string, locationId: string] }>()
const stock = useStockRows()
const { filters } = stock
const options = useMaterialOptions()
const { can } = useMaterialPermissions()
const expanded = ref<string[]>([])
const SEARCH_STYLE = { padding: 0, '--van-search-content-background': 'var(--surface)' }
const categoryOptions = computed(() => [{ text: 'Tüm kategoriler', value: '' },
  ...options.categories.value.map((category) => ({ text: category, value: category }))])
const locationOptions = computed(() => [{ text: 'Tüm lokasyonlar', value: '' },
  ...options.locations.value.map((location) => ({ text: location.name, value: location.id }))])
const statusOptions = [{ text: 'Tüm durumlar', value: '' },
  ...(['CRITICAL', 'OUT', 'NORMAL'] as const).map((status) => ({ text: STOCK_LOOKS[status].label, value: status }))]
</script>

<template>
  <van-search v-model="filters.q" placeholder="Malzeme adı ya da kodu" shape="round" background="transparent"
    :style="SEARCH_STYLE" />
  <van-cell-group inset>
    <van-dropdown-menu active-color="var(--brand-primary)">
      <van-dropdown-item :model-value="filters.category ?? ''" :options="categoryOptions"
        @change="(value: string) => (filters.category = value || null)" />
      <van-dropdown-item :model-value="filters.locationId ?? ''" :options="locationOptions"
        @change="(value: string) => (filters.locationId = value || null)" />
      <van-dropdown-item :model-value="filters.status ?? ''" :options="statusOptions"
        @change="(value: string) => (filters.status = (value || null) as StockRowStatus | null)" />
    </van-dropdown-menu>
  </van-cell-group>
  <van-notice-bar v-if="stock.warnings.value" left-icon="warning-o" :scrollable="false" wrapable
    :text="`${stock.warnings.value} malzeme kritik seviyede ya da tükendi.`" @click="filters.status = 'CRITICAL'" />
  <van-skeleton v-if="stock.isPending.value" :row="6" />
  <van-empty v-else-if="stock.error.value" image="error" description="Stok yüklenemedi">
    <van-button round type="primary" size="small" @click="stock.refetch()">Tekrar dene</van-button>
  </van-empty>
  <van-empty v-else-if="!stock.rows.value.length"
    :description="stock.hasFilters.value ? 'Bu süzgeçlere uyan malzeme yok' : 'Henüz malzeme kartı yok'">
    <van-button v-if="stock.hasFilters.value" round size="small" @click="stock.clearFilters()">Filtreleri temizle</van-button>
  </van-empty>
  <van-collapse v-else v-model="expanded" :border="false" class="stock-list">
    <StockItem v-for="row in stock.rows.value" :key="row.materialId" :row="row" :can-adjust="can('STOCK_ADJUSTMENT')"
      @open="emit('open', row.materialId)" @adjust="(locationId) => emit('adjust', row.materialId, locationId)" />
  </van-collapse>
</template>

<style scoped>
.stock-list {
  overflow: hidden;
  border-radius: var(--radius-md);
}
</style>
