<script setup lang="ts">
import { CircleCheck, Clock, TriangleAlert } from 'lucide-vue-next'
import type { StatusTone } from '@/core/format/statusTone'

/** Tek cümlelik durum şeridi. link: dokunulur ve ilgili sayfaya götürür (sağda ok çıkar). */
const { tone, text, link = false } = defineProps<{ tone: StatusTone; text: string; link?: boolean }>()
const emit = defineEmits<{ open: [] }>()
const ICONS = { danger: TriangleAlert, warning: TriangleAlert, success: CircleCheck, neutral: Clock } as const
</script>

<template>
  <van-notice-bar :text="text" :mode="link ? 'link' : undefined" :scrollable="false" wrapable
    :class="['status-notice', `status-notice--${tone}`]" @click="link && emit('open')">
    <template #left-icon><component :is="ICONS[tone]" :size="17" class="status-notice__icon" /></template>
  </van-notice-bar>
</template>

<style scoped>
.status-notice {
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
}

.status-notice--danger {
  --van-notice-bar-text-color: var(--status-danger);
  --van-notice-bar-background: var(--status-danger-bg);
}

.status-notice--warning {
  --van-notice-bar-text-color: var(--status-warning);
  --van-notice-bar-background: var(--status-warning-bg);
}

/* Sakin ve iyi haber alarm değildir: marka lacivertiyle, bağırmadan. */
.status-notice--neutral,
.status-notice--success {
  --van-notice-bar-text-color: var(--brand-primary);
  --van-notice-bar-background: var(--brand-tint);
}

.status-notice__icon {
  flex: none;
  margin-right: var(--space-2);
}
</style>
