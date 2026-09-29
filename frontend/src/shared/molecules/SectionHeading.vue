<script setup lang="ts">
/** Tanıtım sayfasında bölüm başlığı: küçük üst başlık, başlık ve açıklama. surface=dark koyu bantta. */
const { eyebrow, title, lead, surface = 'light' } = defineProps<{
  eyebrow?: string
  title: string
  lead?: string
  surface?: 'light' | 'dark'
}>()
</script>

<template>
  <div class="section-heading" :class="`section-heading--${surface}`">
    <small v-if="eyebrow">{{ eyebrow }}</small>
    <h2>{{ title }}</h2>
    <p v-if="lead">{{ lead }}</p>
  </div>
</template>

<style scoped>
.section-heading {
  max-width: 680px;
  margin: 0 auto var(--space-8);
  text-align: center;
}

.section-heading small {
  color: var(--brand-primary);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-heading h2 {
  margin: var(--space-2) 0 0;
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.section-heading p {
  margin: var(--space-3) 0 0;
  color: var(--text-muted);
  font-size: var(--text-md);
  line-height: 1.6;
}

.section-heading--dark small {
  color: var(--brand-signature);
}

.section-heading--dark p {
  color: rgb(255 255 255 / 0.75);
}
</style>
