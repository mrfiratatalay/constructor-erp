<script setup lang="ts">
/** Tanıtım sayfasında bölüm başlığı: küçük üst başlık, başlık ve açıklama. surface=dark koyu bantta. */
const { eyebrow, title, lead, surface = 'light', align = 'center', level = 2 } = defineProps<{
  eyebrow?: string
  title: string
  lead?: string
  surface?: 'light' | 'dark'
  align?: 'left' | 'center'
  level?: 1 | 2
}>()
</script>

<template>
  <div class="section-heading" :class="[`section-heading--${surface}`, `section-heading--${align}`]">
    <small v-if="eyebrow">{{ eyebrow }}</small>
    <component :is="`h${level}`">{{ title }}</component>
    <p v-if="lead">{{ lead }}</p>
  </div>
</template>

<style scoped>
.section-heading {
  max-width: 720px;
  margin: 0 auto clamp(28px, 4vw, 48px);
  text-align: center;
}

.section-heading small {
  color: var(--mk-muted, var(--text-muted));
  font-size: 11px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-heading h1,
.section-heading h2 {
  margin: var(--space-3) 0 0;
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: var(--weight-black);
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.section-heading p {
  margin: var(--space-3) 0 0;
  color: var(--mk-muted, var(--text-muted));
  font-size: var(--text-md);
  line-height: 1.6;
}

.section-heading--dark small {
  color: var(--brand-signature);
}

.section-heading--dark p {
  color: rgb(255 255 255 / 0.75);
}
.section-heading--left { margin-left: 0; text-align: left; }
</style>
