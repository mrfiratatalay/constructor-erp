<script setup lang="ts">
import { computed } from 'vue'
import { lookOf, markTitle, type MarkLike } from '@/core/puantaj/puantajLabels'
import { vanColor } from '@/mobile/markTones'

/**
 * İşaretin kısa boyu (takvim, toplamlar): renkli dolu daire, içinde beyaz şekil (✓ ½ ✕ İ; kaydı yoksa gri ○).
 * Masaüstü cetvelindeki dairenin aynısı. Mesai daireyi büyütmez: köşesinde lacivert nokta olur. Kök öğe rozetin
 * kendisidir: satır içi bir sarmalayıcı daireyi yazının taban çizgisine oturtup yukarı kaydırıyordu.
 */
const { mark = null } = defineProps<{ mark?: MarkLike | null }>()
const look = computed(() => lookOf(mark))
/** Vant rozeti tek başınayken de köşe konumuna göre yarım boy kayar (translate 50%, -50%); daire yerinde durmalı. */
const IN_PLACE = { transform: 'none' }
/** Mesai noktası köşeden biraz içeride: tam köşede daireden kopuk duruyordu. */
const DOT_INSIDE: [number, number] = [-3, 3]
</script>

<template>
  <van-badge :dot="!!mark?.overtimeHours" :color="vanColor('primary')" :offset="DOT_INSIDE" role="img"
    :aria-label="markTitle(mark)">
    <van-badge :content="look.short" :color="vanColor(look.tone)" :style="IN_PLACE" />
  </van-badge>
</template>
