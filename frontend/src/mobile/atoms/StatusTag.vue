<script setup lang="ts">
import type { TagTone } from '@/core/format/statusTone'

/** Anlam tonunu Vant etiket tipine çevirir; yumuşak renkler mobile/styles/theme.css'te. */
const VAN_TYPE = {
  danger: 'danger',
  warning: 'warning',
  success: 'success',
  neutral: 'default',
  progress: 'primary',
} as const

const { tone } = defineProps<{ tone: TagTone }>()
</script>

<template>
  <van-tag round :type="VAN_TYPE[tone]"><slot /></van-tag>
</template>
