<script setup lang="ts">
/** Liste sütununun başlığı: ad, yanında küçük bilgi (tarih, sayı) ve eylem (＋). Altına tek satır eklenebilir. */
const { title, meta } = defineProps<{ title: string; meta?: string }>()
</script>

<template>
  <header class="list-header">
    <div class="list-header__top">
      <h1 class="list-header__title">{{ title }}</h1>
      <span v-if="meta" class="list-header__meta">{{ meta }}</span>
      <slot name="action" />
    </div>
    <slot />
  </header>
</template>

<style scoped>
.list-header {
  display: grid;
  gap: var(--space-2);
}

.list-header__top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 32px;
}

.list-header__title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.list-header__meta {
  flex: 1;
  color: var(--text-subtle);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}
</style>
