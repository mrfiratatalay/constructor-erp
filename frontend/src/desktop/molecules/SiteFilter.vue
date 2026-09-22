<script setup lang="ts">
import type { SiteView } from '@/core/api/generated/model'

/** Akışı şantiyeye göre süzer; boş seçim "tüm şantiyeler" demektir. */
const selected = defineModel<string | undefined>({ required: true })
const { sites } = defineProps<{ sites: SiteView[] }>()
</script>

<template>
  <el-select :model-value="selected ?? ''" class="site-filter" placeholder="Tüm şantiyeler"
    @update:model-value="(value: string) => (selected = value || undefined)">
    <el-option label="Tüm şantiyeler" value="" />
    <el-option v-for="site in sites" :key="site.id" :label="site.name" :value="site.id" />
  </el-select>
</template>

<style scoped>
.site-filter {
  width: 220px;
}
</style>
