<script setup lang="ts">
import { START_STEPS } from '@/core/marketing/marketingCopy'

/** Satın alma yolu: başvuru → paket → kurulum linki → ekip. Kart altyapısı olmadığı için süreci açıkça anlatır. */
</script>

<template>
  <ol class="start-steps">
    <li v-for="(step, index) in START_STEPS" :key="step.title" class="start-steps__item">
      <span class="start-steps__number">{{ index + 1 }}</span>
      <h3>{{ step.title }}</h3>
      <p>{{ step.text }}</p>
    </li>
  </ol>
</template>

<style scoped>
.start-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.start-steps__number {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--brand-signature);
  color: var(--brand-deep);
  font-weight: var(--weight-black);
}

.start-steps h3 {
  margin: var(--space-3) 0 var(--space-1);
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
}

.start-steps p {
  margin: 0;
  color: inherit;
  line-height: 1.6;
  opacity: 0.8;
}
</style>
