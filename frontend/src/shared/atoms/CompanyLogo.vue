<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { initialsOf } from '@/core/tenant/brand'

/**
 * Firmanın logosu; yüklenmemişse (ya da açılamazsa) adının baş harfleri. Kare, köşeleri yumuşak: firmanın gerçek logosu
 * beyaz zemin üstünde durur, baş harfler markanın lacivert/sarı ikilisiyle.
 */
const {
  name,
  logoUrl = null,
  size = 40,
  surface = 'light',
} = defineProps<{ name: string; logoUrl?: string | null; size?: number; surface?: 'light' | 'dark' }>()

const failed = ref(false)
watch(() => logoUrl, () => (failed.value = false))
const initials = computed(() => initialsOf(name))
</script>

<template>
  <span class="company-logo" :class="`company-logo--on-${surface}`"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.38)}px` }">
    <img v-if="logoUrl && !failed" :src="logoUrl" :alt="`${name} logosu`" @error="failed = true" />
    <span v-else aria-hidden="true">{{ initials }}</span>
  </span>
</template>

<style scoped>
.company-logo {
  display: inline-grid;
  place-items: center;
  flex: none;
  overflow: hidden;
  border-radius: 26%;
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--surface);
}

.company-logo--on-light {
  background: var(--brand-deep);
  color: var(--brand-signature);
}

.company-logo--on-dark {
  background: var(--brand-signature);
  color: var(--brand-deep);
}
</style>
