<script setup lang="ts">
const { title, subtitle } = defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <section class="desktop-page">
    <header class="desktop-page__header">
      <div>
        <h1 class="desktop-page__title">{{ title }}</h1>
        <p v-if="subtitle" class="desktop-page__subtitle">{{ subtitle }}</p>
      </div>
      <div class="desktop-page__actions"><slot name="actions" /></div>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.desktop-page {
  display: grid;
  gap: var(--space-5);
  align-content: start;
  max-width: 1180px;
}

.desktop-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.desktop-page__title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.desktop-page__subtitle {
  margin: 4px 0 0;
  color: var(--text-muted);
}

.desktop-page__actions {
  display: flex;
  gap: var(--space-2);
}
</style>
