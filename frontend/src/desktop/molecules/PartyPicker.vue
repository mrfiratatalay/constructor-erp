<script setup lang="ts">
import { Store } from 'lucide-vue-next'
import type { PartyView } from '@/core/api/generated/model'

/**
 * Firma ya da teslim alan: listeden seçilir ya da adı yazılır; yeni ad kaydedilirken firma olarak eklenir (ayrı bir
 * firma ekranı yoktur). Değer ya seçilen firmanın kimliği ya da yazılan addır.
 */
const model = defineModel<string>({ required: true })
const { parties, placeholder = 'Firma seçin ya da yazın…' } = defineProps<{
  parties: PartyView[]
  placeholder?: string
}>()
</script>

<template>
  <el-select v-model="model" filterable allow-create default-first-option clearable :placeholder="placeholder"
    size="large" no-data-text="Firma adını yazın" :value-on-clear="''">
    <template #prefix><Store :size="16" /></template>
    <el-option v-for="party in parties" :key="party.id" :value="party.id" :label="party.name" />
  </el-select>
</template>
