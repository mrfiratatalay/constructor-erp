<script setup lang="ts">
import type { TagTone } from '@/core/format/statusTone'

/** Anlam tonunu Element Plus etiket tipine çevirir; "light" efekt yumuşak zemini hazır verir. */
const EL_TYPE = {
  danger: 'danger',
  warning: 'warning',
  success: 'success',
  neutral: 'info',
  progress: 'primary',
} as const

const { tone } = defineProps<{ tone: TagTone }>()
</script>

<template>
  <el-tag :type="EL_TYPE[tone]" round disable-transitions><slot /></el-tag>
</template>
