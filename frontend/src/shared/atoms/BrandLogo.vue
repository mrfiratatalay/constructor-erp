<template>
  <span class="brand-logo">
    <span class="brand-logo__mark" aria-hidden="true">AŞ</span>
    <span>Atalay Şantiye</span>
  </span>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  color: var(--text-strong);
}

.brand-logo__mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--brand-primary);
  color: var(--brand-on-primary);
  font-size: 13px;
}
</style>
