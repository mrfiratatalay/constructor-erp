<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarDays, ChevronDown } from 'lucide-vue-next'
import { DATE_PRESETS, rangeLabel, type DatePreset, type DateRange } from '@/core/materials/dateRanges'

/**
 * Tarih süzgeci: düğmede seçili aralığın adı ("Son 30 gün"); açılınca hazır aralıklar ve altında elle aralık seçimi.
 * Hazır aralık bugüne göre kayar (yarın açılan "Son 30 gün" yine son 30 gündür), elle seçilen sabittir.
 */
const { preset, range } = defineProps<{ preset: DatePreset; range: DateRange }>()
const emit = defineEmits<{ change: [preset: DatePreset, custom?: DateRange] }>()
const open = ref(false)
const label = computed(() => rangeLabel(preset, range))
const custom = computed<[string, string] | null>(() =>
  preset === 'custom' && range.from && range.to ? [range.from, range.to] : null,
)

function choose(next: DatePreset, value?: [string, string] | null) {
  open.value = false
  if (next === 'custom' && !value) return emit('change', 'all')
  emit('change', next, value ? { from: value[0], to: value[1] } : undefined)
}
</script>

<template>
  <el-popover v-model:visible="open" trigger="click" placement="bottom-start" :width="300">
    <template #reference>
      <el-button size="large">
        <el-space :size="8"><CalendarDays :size="17" />{{ label }}<ChevronDown :size="15" /></el-space>
      </el-button>
    </template>
    <el-space direction="vertical" alignment="stretch" :size="12" fill style="width: 100%">
      <el-radio-group :model-value="preset" @change="(value) => choose(value as DatePreset)">
        <el-space direction="vertical" alignment="flex-start" :size="4">
          <el-radio v-for="item in DATE_PRESETS" :key="item.key" :value="item.key">{{ item.label }}</el-radio>
        </el-space>
      </el-radio-group>
      <el-divider style="margin: 0">Özel aralık</el-divider>
      <el-date-picker :model-value="custom" type="daterange" value-format="YYYY-MM-DD" format="D MMM YYYY"
        start-placeholder="Başlangıç" end-placeholder="Bitiş" unlink-panels :teleported="false"
        style="width: 100%" @update:model-value="(value: [string, string] | null) => choose('custom', value)" />
    </el-space>
  </el-popover>
</template>
