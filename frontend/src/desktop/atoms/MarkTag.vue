<script setup lang="ts">
import { lookOf, markLabel, type MarkLike } from '@/core/puantaj/puantajLabels'

/**
 * İşaretin uzun boyu, tek günün gösterildiği yerlerde: açık zeminli, koyu yazılı etiket ("✓ Geldi · +2 s"). Anlamı
 * şekil ve yazı taşır, renk destekler. Kaydı yoksa gri "○ İşaretlenmedi". Kısa boy: MarkDot.
 */
const { mark = null } = defineProps<{ mark?: MarkLike | null }>()
</script>

<template>
  <el-tag :type="lookOf(mark).tone" effect="light" round disable-transitions>{{ markLabel(mark) }}</el-tag>
</template>
