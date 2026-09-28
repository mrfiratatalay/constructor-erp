<script setup lang="ts">
import type { LocationViewKind } from '@/core/api/generated/model'
import { LOCATION_ICONS } from '@/shared/materials/materialIcons'

/** Depo ya da şantiye adı, türünün simgesiyle (depo binası, şantiye binası). */
const { name, kind } = defineProps<{ name: string; kind: LocationViewKind }>()
</script>

<template>
  <el-space :size="6">
    <el-text type="info"><component :is="LOCATION_ICONS[kind]" :size="15" aria-hidden="true" /></el-text>
    <span>{{ name }}</span>
  </el-space>
</template>
