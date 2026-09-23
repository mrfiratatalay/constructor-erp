<script setup lang="ts">
const { title } = defineProps<{ title: string }>()
</script>

<template>
  <!-- WhatsApp'taki gün rozeti: ortada, küçük, kaydırırken üstte kalır. Gönderi sayısı yazılmaz. -->
  <h2 class="feed-day">
    <span class="feed-day__pill">{{ title }}</span>
  </h2>
</template>

<style scoped>
.feed-day {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: var(--space-2) 0;
}

.feed-day__pill {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}
</style>
