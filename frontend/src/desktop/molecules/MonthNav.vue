<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { monthKey, monthTitle, shiftMonth } from '@/core/format/dates'
import { monthsBack } from '@/core/puantaj/puantajDays'

/**
 * Ay seçici (takvim uygulamalarının kalıbı): ‹ › ile bir ay geri ya da ileri, yanında "Eylül 2026 ▾"; ona basınca son
 * on iki ay listelenir (ay sonu hesabı çoğunlukla geçen aya bakar). Gelecek aya gidilmez. Liste düğme grubunun içine
 * konmaz: Element Plus gruptaki açılır menüyü son öğe sayar, ortada köşeleri kopuk durur.
 */
const { month } = defineProps<{ month: string }>()
const emit = defineEmits<{ change: [month: string] }>()
const current = monthKey()
const choices = computed(() => monthsBack(current, 12))
const titleOf = (value: string) => monthTitle(`${value}-01`)
</script>

<template>
  <el-space :size="8">
    <el-button-group>
      <el-button :icon="ChevronLeft" aria-label="Önceki ay" @click="emit('change', shiftMonth(month, -1))" />
      <el-button :icon="ChevronRight" aria-label="Sonraki ay" :disabled="month >= current"
        @click="emit('change', shiftMonth(month, 1))" />
    </el-button-group>
    <el-dropdown trigger="click" @command="(value: string) => emit('change', value)">
      <el-button text>
        <el-space :size="6"><el-text tag="b" size="large">{{ titleOf(month) }}</el-text><ChevronDown :size="16" /></el-space>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="value in choices" :key="value" :command="value" :disabled="value === month">
            {{ titleOf(value) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-space>
</template>
