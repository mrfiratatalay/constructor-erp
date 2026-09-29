<script setup lang="ts">
import type { ActiveFilter } from '@/core/materials/activeFilters'

/** Seçili süzgeçler etiket olarak; × ile tek tek, "Temizle" ile hepsi birden kalkar. */
const { tags } = defineProps<{ tags: ActiveFilter[] }>()
const emit = defineEmits<{ remove: [tag: ActiveFilter]; clear: [] }>()
</script>

<template>
  <van-space v-if="tags.length" wrap :size="6" align="center">
    <van-tag v-for="tag in tags" :key="tag.key" type="primary" size="medium" round closeable
      @close="emit('remove', tag)">
      {{ tag.label }}
    </van-tag>
    <van-button size="mini" plain round @click="emit('clear')">Temizle</van-button>
  </van-space>
</template>
