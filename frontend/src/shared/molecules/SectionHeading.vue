<script setup lang="ts">
const { title, hint } = defineProps<{ title: string; hint?: string }>()
</script>

<template>
  <div class="section-heading">
    <h2>{{ title }}</h2>
    <span v-if="hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}

.section-heading h2 {
  margin: 0;
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
}

.section-heading span {
  color: var(--text-subtle);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
}
</style>
