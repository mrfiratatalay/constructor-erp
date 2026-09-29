<script setup lang="ts">
import ProductMark from '@/shared/atoms/ProductMark.vue'

/**
 * Koyu zeminde ürünün imzası (platform yönetimi, tanıtım sitesi): vinç işareti, yanında "Constructor ERP" ve isteğe
 * bağlı slogan. compact: yalnızca işaret.
 */
const {
  size = 'md',
  tagline,
  compact = false,
} = defineProps<{ size?: 'md' | 'lg'; tagline?: string; compact?: boolean }>()
</script>

<template>
  <div class="brand-mark" :class="`brand-mark--${size}`">
    <ProductMark surface="dark" :size="size === 'lg' ? 64 : 40" />
    <div v-if="!compact" class="brand-mark__text">
      <strong>Constructor <b>ERP</b></strong>
      <span v-if="tagline">{{ tagline }}</span>
    </div>
  </div>
</template>

<style scoped>
.brand-mark {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--brand-on-deep);
}

.brand-mark__text {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.brand-mark__text strong {
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.brand-mark__text b {
  color: var(--brand-signature);
  font-weight: var(--weight-black);
}

.brand-mark__text span {
  color: rgb(255 255 255 / 0.72);
  font-size: var(--text-sm);
}

.brand-mark--md .brand-mark__text strong {
  font-size: var(--text-md);
}

.brand-mark--lg .brand-mark__text strong {
  font-size: var(--text-xl);
}
</style>
