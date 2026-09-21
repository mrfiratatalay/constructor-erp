<script setup lang="ts">
// Sarı imza beyaz zeminde okunmadığı için işaretin renkleri üzerinde durduğu zemine göre değişir.
const { surface = 'light' } = defineProps<{ surface?: 'light' | 'dark' }>()
</script>

<template>
  <span class="brand-logo" :class="`brand-logo--on-${surface}`">
    <span class="brand-logo__mark" aria-hidden="true">KŞ</span>
    <span>Kızılkan Şantiye</span>
  </span>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
}

.brand-logo__mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  font-size: 13px;
}

.brand-logo--on-light {
  color: var(--text-strong);
}

.brand-logo--on-light .brand-logo__mark {
  background: var(--brand-deep);
  color: var(--brand-signature);
}

.brand-logo--on-dark {
  color: var(--brand-on-deep);
}

.brand-logo--on-dark .brand-logo__mark {
  background: var(--brand-signature);
  color: var(--brand-deep);
}
</style>
