<script setup lang="ts">
import type { DayMarkView } from '@/core/api/generated/model'
import { lookOf, markText, shortText, type Tone } from '@/core/puantaj/puantajLabels'

/**
 * Bir günün işareti, Vant etiketiyle: yumuşak renkler mobile/styles/theme.css'te. İzinli (mavi) çerçeveli çizilir:
 * dolu lacivert öbür yumuşak etiketlerin yanında bağırırdı. compact: takvimin dar hücresi ("✓", "✓+2").
 */
const VAN_TYPE: Record<Tone, 'success' | 'warning' | 'danger' | 'primary' | 'default'> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  primary: 'primary',
  info: 'default',
}

const { mark, compact = false } = defineProps<{ mark: DayMarkView; compact?: boolean }>()
</script>

<template>
  <van-tag :type="VAN_TYPE[lookOf(mark).tone]" :plain="lookOf(mark).tone === 'primary'" round
    :size="compact ? undefined : 'medium'">
    {{ compact ? shortText(mark) : markText(mark) }}
  </van-tag>
</template>
