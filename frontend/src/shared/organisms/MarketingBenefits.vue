<script setup lang="ts">
import { PRODUCT_BENEFITS } from '@/core/marketing/marketingCopy'
import MarketingIcon from '@/shared/atoms/MarketingIcon.vue'
</script>

<template>
  <section class="marketing-benefits" aria-label="Saha ve ofis birlikte">
    <ul class="marketing-container">
      <li v-for="benefit in PRODUCT_BENEFITS" :key="benefit.title">
        <MarketingIcon :name="benefit.icon" :size="24" />
        <div><h2>{{ benefit.title }}</h2><p>{{ benefit.text }}</p></div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.marketing-benefits { border-bottom: 1px solid var(--mk-line); background: var(--mk-paper); }
.marketing-benefits ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 24px; margin-block: 0; padding-block: 32px; list-style: none; }
.marketing-benefits li { display: flex; align-items: center; gap: 14px; }
.marketing-benefits li > svg { flex: none; color: var(--brand-primary); }
.marketing-benefits h2 { margin: 0; font-size: 14px; font-weight: var(--weight-bold); }
.marketing-benefits p { margin: 4px 0 0; font-size: 12px; line-height: 1.6; color: var(--mk-muted); }
</style>
