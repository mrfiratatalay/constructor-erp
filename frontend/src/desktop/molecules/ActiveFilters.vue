<script setup lang="ts">
import type { ActiveFilter } from '@/core/materials/activeFilters'

/** Seçili süzgeçler etiket olarak; × ile tek tek, "Filtreleri temizle" ile hepsi birden kalkar. */
const { tags } = defineProps<{ tags: ActiveFilter[] }>()
const emit = defineEmits<{ remove: [tag: ActiveFilter]; clear: [] }>()
</script>

<template>
  <el-space v-if="tags.length" wrap :size="8">
    <el-text type="info" size="small">Süzgeçler:</el-text>
    <el-tag v-for="tag in tags" :key="tag.key" closable round effect="plain" @close="emit('remove', tag)">
      {{ tag.label }}
    </el-tag>
    <el-button link type="primary" @click="emit('clear')">Filtreleri temizle</el-button>
  </el-space>
</template>
