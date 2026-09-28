<script setup lang="ts">
import { STATUS_LOOKS, type MovementStatus } from '@/core/materials/materialLabels'
import { STATUS_ICONS } from '@/shared/materials/materialIcons'

/** Hareketin durumu: kütüphanenin durum renginde yuvarlak etiket, simgeyle ("✓ Tamamlandı", "◷ Yolda"). */
const { status } = defineProps<{ status: MovementStatus }>()
</script>

<template>
  <el-tag :type="STATUS_LOOKS[status].tone" round disable-transitions>
    <el-space :size="4">
      <component :is="STATUS_ICONS[status]" :size="13" :stroke-width="2.4" aria-hidden="true" />
      {{ STATUS_LOOKS[status].label }}
    </el-space>
  </el-tag>
</template>
