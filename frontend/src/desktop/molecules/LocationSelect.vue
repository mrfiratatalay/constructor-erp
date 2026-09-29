<script setup lang="ts">
import { computed } from 'vue'
import type { LocationView } from '@/core/api/generated/model'
import { LOCATION_ICONS } from '@/shared/materials/materialIcons'

/**
 * Lokasyon seçimi: Depolar ve Şantiyeler ayrı gruplarda, her biri simgesiyle. Tamamlanmış şantiye grubun sonunda
 * soluk durur (eski stoğu orada kalmış olabilir). sitesOnly: "Hangi Şantiye" sorusunda depolar gösterilmez.
 */
const model = defineModel<string | null>({ required: true })
const {
  locations,
  placeholder = 'Lokasyon seç',
  sitesOnly = false,
  exclude = null,
  clearable = false,
} = defineProps<{
  locations: LocationView[]
  placeholder?: string
  sitesOnly?: boolean
  exclude?: string | null
  clearable?: boolean
}>()
const selected = computed(() => locations.find((location) => location.id === model.value))
const groups = computed(() =>
  [
    { label: 'Depolar', items: sitesOnly ? [] : locations.filter((location) => location.kind === 'DEPOT') },
    { label: 'Şantiyeler', items: locations.filter((location) => location.kind === 'SITE') },
  ].filter((group) => group.items.length > 0),
)
</script>

<template>
  <el-select v-model="model" :placeholder="placeholder" filterable :clearable="clearable" size="large"
    :empty-values="[null, undefined, '']" :value-on-clear="null">
    <template #prefix>
      <component :is="LOCATION_ICONS[selected?.kind ?? (sitesOnly ? 'SITE' : 'DEPOT')]" :size="16" />
    </template>
    <el-option-group v-for="group in groups" :key="group.label" :label="group.label">
      <el-option v-for="location in group.items" :key="location.id" :value="location.id" :label="location.name"
        :disabled="location.id === exclude">
        <el-space :size="8">
          <el-text :type="location.active ? 'primary' : 'info'">
            <component :is="LOCATION_ICONS[location.kind]" :size="15" />
          </el-text>
          <el-text :type="location.active ? undefined : 'info'">{{ location.name }}</el-text>
          <el-text v-if="!location.active" type="info" size="small">tamamlandı</el-text>
        </el-space>
      </el-option>
    </el-option-group>
  </el-select>
</template>
