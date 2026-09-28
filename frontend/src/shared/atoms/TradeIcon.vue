<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  BrickWall,
  Cog,
  Construction,
  Frame,
  Grid2x2,
  Hammer,
  Layers,
  PaintRoller,
  Shield,
  Zap,
} from 'lucide-vue-next'
import { tradeKind, type TradeKind } from '@/core/production/tradeKind'

/**
 * İmalatın satır başındaki simgesi, türünden okunur (Demir, Sıva, Elektrik…). Yalnızca göz gezdirmeyi kolaylaştırır;
 * anlamı yanındaki ad taşır (TASARIM.md İlke 2). Açık lacivert kare, masaüstünde ve telefonda aynı.
 */
const { trade, size = 44 } = defineProps<{ trade: string; size?: number }>()

const ICONS: Record<TradeKind, Component> = {
  rebar: Construction,
  formwork: Frame,
  masonry: BrickWall,
  plaster: Layers,
  tile: Grid2x2,
  paint: PaintRoller,
  electric: Zap,
  mechanical: Cog,
  insulation: Shield,
  other: Hammer,
}
const icon = computed(() => ICONS[tradeKind(trade)])
</script>

<template>
  <span class="trade-icon" :style="{ width: `${size}px`, height: `${size}px` }" aria-hidden="true">
    <component :is="icon" :size="Math.round(size * 0.45)" :stroke-width="2" />
  </span>
</template>

<style scoped>
.trade-icon {
  display: inline-grid;
  flex: none;
  place-items: center;
  border-radius: var(--radius-sm);
  background: var(--brand-tint);
  color: var(--brand-primary);
}
</style>
