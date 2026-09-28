<script setup lang="ts">
import { computed } from 'vue'
import type { LocationView } from '@/core/api/generated/model'
import { DATE_PRESETS, type DatePreset } from '@/core/materials/dateRanges'
import { STATUS_LOOKS, type MovementStatus } from '@/core/materials/materialLabels'
import type { MovementFilters } from '@/core/materials/movementQuery'

/**
 * Telefonda süzgeçler tek satır açılır menü: Tarih, Lokasyon, Durum (Vant'ın DropdownMenu'sü; seçenekler alttan
 * değil menünün altından açılır, liste yerinde kalır). Boş seçim "Tümü"dür. Malzeme ve firma süzgeci malzeme kartından
 * ("Tüm hareketleri gör") ve aramadan gelir.
 */
const { filters, locations } = defineProps<{ filters: MovementFilters; locations: LocationView[] }>()
const emit = defineEmits<{ update: [change: Partial<MovementFilters>]; dates: [preset: DatePreset] }>()
const dateOptions = DATE_PRESETS.map((item) => ({ text: item.label, value: item.key }))
const locationOptions = computed(() => [
  { text: 'Tüm lokasyonlar', value: '' },
  ...locations.map((location) => ({ text: location.name, value: location.id })),
])
const statusOptions = [
  { text: 'Tüm durumlar', value: '' },
  ...(Object.keys(STATUS_LOOKS) as MovementStatus[]).map((status) => ({ text: STATUS_LOOKS[status].label, value: status })),
]
const preset = computed(() => (filters.preset === 'custom' ? 'all' : filters.preset))
</script>

<template>
  <van-dropdown-menu active-color="var(--brand-primary)">
    <van-dropdown-item :model-value="preset" :options="dateOptions"
      @change="(value: DatePreset) => emit('dates', value)" />
    <van-dropdown-item :model-value="filters.locationId ?? ''" :options="locationOptions"
      @change="(value: string) => emit('update', { locationId: value || null })" />
    <van-dropdown-item :model-value="filters.status ?? ''" :options="statusOptions"
      @change="(value: string) => emit('update', { status: (value || null) as MovementStatus | null })" />
  </van-dropdown-menu>
</template>
