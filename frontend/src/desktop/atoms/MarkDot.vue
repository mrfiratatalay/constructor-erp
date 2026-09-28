<script setup lang="ts">
import { computed } from 'vue'
import { lookOf, markTitle, type MarkLike } from '@/core/puantaj/puantajLabels'

/**
 * İşaretin kısa boyu (cetvel, takvim, açıklama): renkli dolu daire, içinde beyaz şekil (✓ ½ ✕ İ; kaydı yoksa gri ○).
 * Her hücre aynı genişlikte kalır, göz satırın ritmini yakalar. Mesai daireyi büyütmez: köşesinde lacivert bir nokta
 * olur, saati üstüne gelince yazar. Rozetin genişliği sabitlenir ki dar "İ" ile geniş "✓" aynı daire olsun.
 * label: açıklamanın başına eklenir ("26 Eylül Cumartesi: Geldi"), ör. son günler şeridinde hangi gün olduğu.
 */
const { mark = null, label = '' } = defineProps<{ mark?: MarkLike | null; label?: string }>()
const look = computed(() => lookOf(mark))
const title = computed(() => (label ? `${label}: ${markTitle(mark)}` : markTitle(mark)))
const CIRCLE = { width: '20px', height: '20px', padding: '0', fontWeight: '700' }
/** Nokta varsayılan yerinde dairenin üstüne taşıyor, tablo hücresi onu yarıdan kesip çizgiye çeviriyordu. */
const DOT_INSIDE: [number, number] = [-2, 5]
</script>

<template>
  <span role="img" :aria-label="title" :title="title">
    <el-badge is-dot type="primary" :hidden="!mark?.overtimeHours" :offset="DOT_INSIDE">
      <el-badge :value="look.short" :type="look.tone" :badge-style="CIRCLE" />
    </el-badge>
  </span>
</template>
