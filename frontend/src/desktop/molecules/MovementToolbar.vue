<script setup lang="ts">
import { computed } from 'vue'
import { CircleDot, Package, Search, Store } from 'lucide-vue-next'
import type { LocationView, MaterialView, PartyView } from '@/core/api/generated/model'
import type { DatePreset, DateRange } from '@/core/materials/dateRanges'
import { STATUS_LOOKS, type MovementStatus } from '@/core/materials/materialLabels'
import type { MovementFilters } from '@/core/materials/movementQuery'
import { useSearchText } from '@/core/materials/useSearchText'
import DateFilter from '@/desktop/molecules/DateFilter.vue'
import LocationSelect from '@/desktop/molecules/LocationSelect.vue'

/**
 * Hareket süzgeçleri tek satırda: tarih, lokasyon (kaynak ya da hedef), malzeme, firma, durum ve arama. Hepsi
 * birlikte çalışır; seçilenler altta etiket olarak görünür. Arama yazdıkça değil, yazmayı bırakınca süzer.
 */
const { filters, locations, materials, parties } = defineProps<{
  filters: MovementFilters
  locations: LocationView[]
  materials: MaterialView[]
  parties: PartyView[]
}>()
const emit = defineEmits<{ update: [change: Partial<MovementFilters>]; dates: [preset: DatePreset, custom?: DateRange] }>()
const STATUSES = Object.keys(STATUS_LOOKS) as MovementStatus[]
const SELECT = { width: '190px' }
const range = computed<DateRange>(() => ({ from: filters.from, to: filters.to }))
const set = <K extends keyof MovementFilters>(key: K) => (value: MovementFilters[K]) => emit('update', { [key]: value })
const text = useSearchText(() => filters.q, (q) => emit('update', { q }))
</script>

<template>
  <el-space wrap :size="10">
    <DateFilter :preset="filters.preset" :range="range" @change="(preset, custom) => emit('dates', preset, custom)" />
    <LocationSelect :model-value="filters.locationId" :locations="locations" placeholder="Tüm lokasyonlar" clearable
      :style="SELECT" @update:model-value="set('locationId')($event)" />
    <el-select :model-value="filters.materialId" placeholder="Tüm malzemeler" filterable clearable size="large"
      :style="SELECT" :value-on-clear="null" @update:model-value="set('materialId')($event)">
      <template #prefix><Package :size="16" /></template>
      <el-option v-for="material in materials" :key="material.id" :value="material.id" :label="material.name" />
    </el-select>
    <el-select :model-value="filters.partyId" placeholder="Tüm firmalar" filterable clearable size="large"
      :style="SELECT" :value-on-clear="null" no-data-text="Henüz firma yok" @update:model-value="set('partyId')($event)">
      <template #prefix><Store :size="16" /></template>
      <el-option v-for="party in parties" :key="party.id" :value="party.id" :label="party.name" />
    </el-select>
    <el-select :model-value="filters.status" placeholder="Tüm durumlar" clearable size="large" :style="SELECT"
      :value-on-clear="null" @update:model-value="set('status')($event)">
      <template #prefix><CircleDot :size="16" /></template>
      <el-option v-for="status in STATUSES" :key="status" :value="status" :label="STATUS_LOOKS[status].label" />
    </el-select>
    <el-input v-model="text" placeholder="Malzeme, firma, açıklama ya da MH-no ara" clearable size="large"
      :prefix-icon="Search" style="width: 300px" />
  </el-space>
</template>
