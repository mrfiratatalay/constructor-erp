<script setup lang="ts">
import { CalendarDays, MoreHorizontal, Undo2 } from 'lucide-vue-next'
import type { DayMarkView } from '@/core/api/generated/model'

/**
 * Satırın ikincil işleri, cetvelin en sağında hep aynı yerde (⋯): kişinin ayı (takvim, geçmiş günleri düzeltmek) ve
 * bugünün işaretini kaldırmak. Durum, mesai ve not satırın kendisinde yazılır.
 */
const { mark = undefined, canMark } = defineProps<{ mark?: DayMarkView; canMark: boolean }>()
const emit = defineEmits<{ details: []; clear: [] }>()
const onCommand = (command: 'details' | 'clear') => (command === 'details' ? emit('details') : emit('clear'))
</script>

<template>
  <el-dropdown trigger="click" @command="onCommand">
    <el-button text circle aria-label="Satırın işlemleri"><MoreHorizontal :size="18" /></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="details" :icon="CalendarDays">Ayın takvimi</el-dropdown-item>
        <el-dropdown-item v-if="canMark && mark" command="clear" :icon="Undo2" divided>
          Bugünün işaretini kaldır
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
