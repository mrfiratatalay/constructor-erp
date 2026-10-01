<script setup lang="ts">
import { PRODUCT_POINTS } from '@/core/marketing/marketingCopy'
import MarketingIcon from '@/shared/atoms/MarketingIcon.vue'

/** Ürünün yaptığı işler: tanıtım sayfasının "Neler var?" ızgarası. Genişliğe göre bir, iki ya da üç sütun. */
</script>

<template>
  <ul class="product-points">
    <li v-for="(point, index) in PRODUCT_POINTS" :key="point.title" class="product-points__item">
      <div class="product-points__top"><span class="product-points__icon"><MarketingIcon :name="point.icon" /></span>
        <span class="product-points__index">0{{ index + 1 }}</span></div>
      <h3>{{ point.title }}</h3>
      <p>{{ point.text }}</p>
    </li>
  </ul>
</template>

<style scoped>
.product-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.product-points__item {
  padding: clamp(22px, 3vw, 30px);
  border: 1px solid var(--mk-line, var(--border-soft));
  border-radius: 16px;
  background: var(--surface);
  transition: border-color .2s;
}

.product-points__item:hover {
  border-color: var(--brand-tint-strong);
}
.product-points__top { display: flex; align-items: center; justify-content: space-between; }
.product-points__index { color: var(--text-subtle); font-size: 11px; font-variant-numeric: tabular-nums; }

.product-points__icon {
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--brand-tint);
  color: var(--brand-primary);
}

.product-points h3 {
  margin: var(--space-5) 0 var(--space-2);
  font-size: 18px;
  font-weight: var(--weight-bold);
}

.product-points p {
  margin: 0;
  color: var(--mk-muted, var(--text-muted));
  font-size: 14px;
  line-height: 1.8;
}
</style>
