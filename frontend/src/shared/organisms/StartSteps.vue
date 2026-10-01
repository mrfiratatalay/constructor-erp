<script setup lang="ts">
import { START_STEPS } from '@/core/marketing/marketingCopy'

/** Satın alma yolu: başvuru → paket → kurulum linki → ekip. Kart altyapısı olmadığı için süreci açıkça anlatır. */
</script>

<template>
  <ol class="start-steps">
    <li v-for="(step, index) in START_STEPS" :key="step.title" class="start-steps__item">
      <span class="start-steps__number">0{{ index + 1 }}</span>
      <h3>{{ step.title }}</h3>
      <p>{{ step.text }}</p>
    </li>
  </ol>
</template>

<style scoped>
.start-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
  gap: var(--space-8);
  margin: 0;
  padding: 0;
  list-style: none;
}
.start-steps__item { padding-top: 20px; border-top: 1px solid rgb(255 255 255 / .2); }

.start-steps__number {
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgb(250 204 21 / .3);
  border-radius: 12px;
  background: rgb(250 204 21 / .07);
  color: var(--brand-signature);
  font-size: 13px;
  font-weight: var(--weight-black);
}

.start-steps h3 {
  margin: var(--space-5) 0 var(--space-2);
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
}

.start-steps p {
  margin: 0;
  color: inherit;
  font-size: 14px;
  line-height: 1.8;
  opacity: .72;
}
</style>
