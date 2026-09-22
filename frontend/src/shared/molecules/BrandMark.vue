<script setup lang="ts">
/** Koyu zeminde marka imzası: sarı kare içinde KŞ, yanında ad ve isteğe bağlı slogan. */
const { size = 'md', tagline } = defineProps<{ size?: 'md' | 'lg'; tagline?: string }>()
</script>

<template>
  <div class="brand-mark" :class="`brand-mark--${size}`">
    <span class="brand-mark__badge" aria-hidden="true">KŞ</span>
    <div class="brand-mark__text">
      <strong>Kızılkan Şantiye</strong>
      <span v-if="tagline">{{ tagline }}</span>
    </div>
  </div>
</template>

<style scoped>
.brand-mark {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--brand-on-deep);
}

.brand-mark__badge {
  display: grid;
  place-items: center;
  flex: none;
  background: var(--brand-signature);
  color: var(--brand-deep);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.brand-mark__text {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.brand-mark__text strong {
  font-weight: var(--weight-bold);
  letter-spacing: -0.01em;
}

.brand-mark__text span {
  color: rgb(255 255 255 / 0.72);
  font-size: var(--text-sm);
}

.brand-mark--md .brand-mark__badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  font-size: var(--text-base);
}

.brand-mark--md .brand-mark__text strong {
  font-size: var(--text-md);
}

.brand-mark--lg .brand-mark__badge {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  font-size: var(--text-xl);
}

.brand-mark--lg .brand-mark__text strong {
  font-size: var(--text-xl);
}
</style>
