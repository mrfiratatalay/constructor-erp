<script setup lang="ts">
import { CircleCheck, Clock, TriangleAlert } from 'lucide-vue-next'
import type { SummaryTone } from '@/core/today/todaySummary'

/**
 * Tek cümlelik durum satırı; kutu değil, yazı. link verilirse cümle bağlantıdır (ör. Sorunlar'a götürür).
 * Sakin ve iyi haber alarm değildir: marka lacivertiyle, bağırmadan.
 */
const { tone, text, link = false } = defineProps<{ tone: SummaryTone; text: string; link?: boolean }>()
const emit = defineEmits<{ open: [] }>()
const ICONS = { danger: TriangleAlert, warning: TriangleAlert, calm: Clock, good: CircleCheck } as const
</script>

<template>
  <el-link v-if="link" :underline="false" :class="['status-notice', `status-notice--${tone}`]" @click="emit('open')">
    <component :is="ICONS[tone]" :size="15" class="status-notice__icon" />{{ text }} ›
  </el-link>
  <p v-else :class="['status-notice', `status-notice--${tone}`]">
    <component :is="ICONS[tone]" :size="15" class="status-notice__icon" />{{ text }}
  </p>
</template>

<style scoped>
.status-notice {
  justify-content: flex-start;
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.status-notice__icon {
  margin-right: 6px;
  vertical-align: -2px;
}

.status-notice--danger {
  --el-link-text-color: var(--status-danger);
  --el-link-hover-text-color: var(--status-danger);
  color: var(--status-danger);
}

.status-notice--warning {
  --el-link-text-color: var(--status-warning);
  --el-link-hover-text-color: var(--status-warning);
  color: var(--status-warning);
}

.status-notice--calm,
.status-notice--good {
  --el-link-text-color: var(--brand-primary);
  color: var(--brand-primary);
}
</style>
