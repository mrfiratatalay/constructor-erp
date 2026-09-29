<script setup lang="ts">
import { PRODUCT_POINTS } from '@/core/marketing/marketingCopy'
import MarketingIcon from '@/shared/atoms/MarketingIcon.vue'

/** Ürünün yaptığı işler: tanıtım sayfasının "Neler var?" ızgarası. Genişliğe göre bir, iki ya da üç sütun. */
</script>

<template>
  <ul class="product-points">
    <li v-for="point in PRODUCT_POINTS" :key="point.title" class="product-points__item">
      <span class="product-points__icon"><MarketingIcon :name="point.icon" /></span>
      <h3>{{ point.title }}</h3>
      <p>{{ point.text }}</p>
    </li>
  </ul>
</template>

<style scoped>
.product-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.product-points__item {
  padding: var(--space-6);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  background: var(--surface);
  transition: box-shadow 0.2s, transform 0.2s;
}

.product-points__item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.product-points__icon {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: var(--brand-tint);
  color: var(--brand-primary);
}

.product-points h3 {
  margin: var(--space-4) 0 var(--space-2);
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
}

.product-points p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
