<script setup lang="ts">
import type { DayMarkView } from '@/core/api/generated/model'
import { lookOf, markText, shortText } from '@/core/puantaj/puantajLabels'

/**
 * Bir günün işareti: açık zeminli, yazılı etiket (Geldi, Yarım gün, Gelmedi, İzinli). compact: ayın cetvelinin
 * dar hücresi için kısa işaret ("✓", "✓+2"); anlamı yine şekil taşır, yalnızca renk değil.
 */
const { mark, compact = false } = defineProps<{ mark: DayMarkView; compact?: boolean }>()
</script>

<template>
  <el-tag :type="lookOf(mark).tone" :size="compact ? 'small' : 'default'" effect="light" round disable-transitions>
    {{ compact ? shortText(mark) : markText(mark) }}
  </el-tag>
</template>
