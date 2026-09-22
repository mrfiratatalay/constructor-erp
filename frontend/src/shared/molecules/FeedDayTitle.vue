<script setup lang="ts">
const { title, count } = defineProps<{ title: string; count: number }>()
</script>

<template>
  <!-- Kaydırırken üstte kalır: hangi güne baktığın hep bellidir. -->
  <h2 class="feed-day">
    <span class="feed-day__pill">{{ title }}</span>
    <span class="feed-day__count">{{ count }} gönderi</span>
  </h2>
</template>

<style scoped>
.feed-day {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin: 0;
  padding: var(--space-2) 0;
  background: linear-gradient(var(--canvas) 70%, transparent);
}

.feed-day__pill {
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--brand-deep);
  color: var(--brand-on-deep);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: 0.02em;
}

.feed-day__count {
  color: var(--text-subtle);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}
</style>
