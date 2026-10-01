<script setup lang="ts">
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'
import { ShipmentRowType } from '@/core/api/generated/model'
import type { MovementFilter } from '@/core/shipments/movementFilters'
import { movementTypeLabel } from '@/core/shipments/movementPresentation'

const search = defineModel<string>('search', { required: true })
defineProps<{ filter: MovementFilter; points: string[]; hasFilters: boolean }>()
defineEmits<{ clear: []; change: [patch: Partial<MovementFilter>] }>()
</script>

<template>
  <div class="movement-toolbar" role="search" aria-label="Hareket filtreleri">
    <el-input v-model="search" :prefix-icon="Search" placeholder="Malzeme, firma veya sevkiyat ara..." clearable
      aria-label="Hareket ara" class="movement-toolbar__search" />
    <el-date-picker :model-value="filter.dates" type="daterange" value-format="YYYY-MM-DD" format="DD.MM.YYYY"
      start-placeholder="Başlangıç" end-placeholder="Bitiş" range-separator="–" unlink-panels
      aria-label="Tarih aralığı" class="movement-toolbar__dates" @update:model-value="$emit('change', { dates: $event })" />
    <el-select :model-value="filter.type" placeholder="Hareket türü" clearable aria-label="Hareket türü" class="movement-toolbar__type"
      @update:model-value="$emit('change', { type: $event || '' })">
      <template #prefix><SlidersHorizontal :size="15" /></template>
      <el-option v-for="type in ShipmentRowType" :key="type" :value="type" :label="movementTypeLabel(type)" />
    </el-select>
    <el-select :model-value="filter.point" placeholder="Tüm noktalar" clearable filterable aria-label="Nokta" class="movement-toolbar__point"
      @update:model-value="$emit('change', { point: $event || '' })">
      <el-option v-for="point in points" :key="point" :label="point" :value="point" />
    </el-select>
    <el-button link :disabled="!hasFilters" :icon="X" class="movement-toolbar__clear" @click="$emit('clear')">Temizle</el-button>
  </div>
</template>

<style scoped>
.movement-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
.movement-toolbar__search { flex: 1 1 240px; min-width: 220px; }
.movement-toolbar__dates { flex: 0 1 240px; width: 240px; }
.movement-toolbar__type { width: 175px; }
.movement-toolbar__point { width: 170px; }
.movement-toolbar__clear { margin-left: 0; font-size: var(--text-xs); }
.movement-toolbar :deep(.el-date-editor.el-input__wrapper) { width: 240px; flex-grow: 0; }
</style>
