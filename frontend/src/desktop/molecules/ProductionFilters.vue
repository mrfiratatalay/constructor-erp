<script setup lang="ts">
import { computed } from 'vue'
import { Search } from 'lucide-vue-next'
import { STATUS_FILTERS, type StatusFilter } from '@/core/production/productionBoard'

/**
 * İmalat listesinin süzgeci: üstte durum düğmeleri (Fırat'ın yoklama süzgeci gibi sekme görünüşlü, sayılı), altında
 * taşeron, tür ve arama. Seçenekler listedeki imalatlardan gelir; seçilmeyen süzmez.
 */
const status = defineModel<StatusFilter>('status', { required: true })
const crewId = defineModel<string | undefined>('crewId', { required: true })
const trade = defineModel<string | undefined>('trade', { required: true })
const query = defineModel<string>('query', { required: true })
const { counts, crews, trades } = defineProps<{
  counts: Record<StatusFilter, number>
  crews: { id: string; name: string }[]
  trades: string[]
}>()

const options = computed(() => STATUS_FILTERS.map((option) => ({ ...option, count: counts[option.value] })))
const optionOf = (item: unknown) => item as (typeof options.value)[number]
</script>

<template>
  <div class="production-filters">
    <el-segmented v-model="status" :options="options" class="production-filters__status">
      <template #default="{ item }">
        <el-space :size="6">
          <span>{{ optionOf(item).label }}</span>
          <b>{{ optionOf(item).count }}</b>
        </el-space>
      </template>
    </el-segmented>
    <div class="production-filters__row">
      <el-select v-model="crewId" placeholder="Taşeron: tümü" clearable filterable aria-label="Taşeron">
        <el-option v-for="crew in crews" :key="crew.id" :label="crew.name" :value="crew.id" />
      </el-select>
      <el-select v-model="trade" placeholder="İş türü: tümü" clearable filterable aria-label="İş türü">
        <el-option v-for="name in trades" :key="name" :label="name" :value="name" />
      </el-select>
      <el-input v-model="query" placeholder="Ara…" clearable aria-label="İş kalemi ara">
        <template #prefix><Search :size="15" /></template>
      </el-input>
    </div>
  </div>
</template>

<style scoped>
.production-filters {
  display: grid;
  gap: var(--space-3);
}

.production-filters__status {
  justify-self: start;
  max-width: 100%;
  overflow-x: auto;
}

.production-filters__row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.4fr;
  gap: var(--space-3);
}
</style>
