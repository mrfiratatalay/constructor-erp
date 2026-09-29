<script setup lang="ts">
import ProductMark from '@/shared/atoms/ProductMark.vue'

/**
 * Ürünün (Constructor ERP) logosu: giriş, davet, katılma ve kurulum ekranlarında. Firmanın markası değildir; firma
 * kendi logosuyla çalışma alanında görünür (WorkspaceBrand).
 */
const { surface = 'light', size = 'md' } = defineProps<{ surface?: 'light' | 'dark'; size?: 'md' | 'lg' }>()
</script>

<template>
  <span class="brand-logo" :class="[`brand-logo--on-${surface}`, `brand-logo--${size}`]">
    <ProductMark :surface="surface" :size="size === 'lg' ? 44 : 32" />
    <span class="brand-logo__name">Constructor <b>ERP</b></span>
  </span>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;
}

.brand-logo--lg {
  gap: var(--space-3);
  font-size: var(--text-lg);
}

.brand-logo__name b {
  font-weight: var(--weight-black);
}

.brand-logo--on-light {
  color: var(--text-strong);
}

.brand-logo--on-light .brand-logo__name b {
  color: var(--brand-primary);
}

.brand-logo--on-dark {
  color: var(--brand-on-deep);
}

.brand-logo--on-dark .brand-logo__name b {
  color: var(--brand-signature);
}
</style>
