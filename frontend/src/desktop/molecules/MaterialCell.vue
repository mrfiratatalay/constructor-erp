<script setup lang="ts">
import MaterialGlyph from '@/shared/atoms/MaterialGlyph.vue'

/** Tablonun malzeme hücresi: simge, kalın ad ve varsa altında kodu. */
const { name, code = null } = defineProps<{ name: string; code?: string | null }>()
</script>

<template>
  <el-space :size="10">
    <MaterialGlyph :name="name" />
    <el-space direction="vertical" alignment="flex-start" :size="0">
      <el-text tag="b">{{ name }}</el-text>
      <el-text v-if="code" type="info" size="small">{{ code }}</el-text>
    </el-space>
  </el-space>
</template>
