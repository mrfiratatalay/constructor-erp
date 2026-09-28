<script setup lang="ts">
import { lookOf, markLabel, type MarkLike } from '@/core/puantaj/puantajLabels'
import { vanType } from '@/mobile/markTones'

/**
 * İşaretin uzun boyu, tek günün gösterildiği yerlerde: açık zeminli, koyu yazılı etiket ("✓ Geldi · +2 s"). Anlamı
 * şekil ve yazı taşır, renk destekler. Kaydı yoksa gri "○ İşaretlenmedi". Kısa boy: MarkDot.
 */
const { mark = null } = defineProps<{ mark?: MarkLike | null }>()
</script>

<template>
  <van-tag :type="vanType(lookOf(mark).tone)" round size="medium">{{ markLabel(mark) }}</van-tag>
</template>
