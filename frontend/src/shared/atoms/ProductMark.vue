<script setup lang="ts">
/**
 * Constructor ERP'nin işareti: kule vinci. Koyu zeminde sarı kare içinde lacivert, açık zeminde lacivert kare
 * içinde sarı (baret sarısı yalnızca koyu zeminde okunur; tokens.css).
 */
const { size = 32, surface = 'light' } = defineProps<{ size?: number; surface?: 'light' | 'dark' }>()
</script>

<template>
  <span class="product-mark" :class="`product-mark--on-${surface}`" :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true">
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M10 26V8" />
      <path d="M6 8h20" />
      <path d="M10 8l4.5-4" />
      <path d="M14.5 4L10 8" />
      <path d="M22 8v6" />
      <path d="M20 14h4v3.5h-4z" />
      <path d="M6.5 26h7" />
    </svg>
  </span>
</template>

<style scoped>
.product-mark {
  display: inline-grid;
  place-items: center;
  flex: none;
  border-radius: 28%;
}

.product-mark svg {
  width: 66%;
  height: 66%;
}

.product-mark--on-light {
  background: var(--brand-deep);
  color: var(--brand-signature);
}

.product-mark--on-dark {
  background: var(--brand-signature);
  color: var(--brand-deep);
}
</style>
