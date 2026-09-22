<script setup lang="ts">
import type { StatusTone } from '@/core/format/statusTone'

/** Anlam tonunu Element Plus etiket tipine çevirir; "light" efekt yumuşak zemini hazır verir. */
const EL_TYPE = {
  danger: 'danger',
  warning: 'warning',
  success: 'success',
  neutral: 'info',
} as const

const { tone } = defineProps<{ tone: StatusTone }>()
</script>

<template>
  <el-tag :type="EL_TYPE[tone]" round disable-transitions><slot /></el-tag>
</template>
