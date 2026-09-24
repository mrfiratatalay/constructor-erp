<script setup lang="ts">
/**
 * Saha akışında günün başlığı. Akışın ilk günü ("Bugün") kalın bir başlıktır; önceki günlere ise ince bir
 * çizgiyle geçilir: "23 EYLÜL SALI · 6 GÜNCELLEME". Ayrı bölümler, kartlar yoktur; hepsi tek akışın parçası.
 */
const { text, lead = false } = defineProps<{ text: string; lead?: boolean }>()
</script>

<template>
  <h3 class="field-day" :class="{ 'field-day--lead': lead }">
    <span>{{ text }}</span>
  </h3>
</template>

<style scoped>
.field-day {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: var(--space-4) 0 var(--space-1);
  padding: 0 var(--space-2);
  color: var(--text-subtle);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.field-day::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-soft);
}

.field-day--lead {
  margin-top: var(--space-2);
  color: var(--text-strong);
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  letter-spacing: 0;
  text-transform: none;
}

.field-day--lead::after {
  content: none;
}
</style>
