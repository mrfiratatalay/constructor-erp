<script setup lang="ts">
import { computed } from 'vue'

const { name, size = 40 } = defineProps<{ name: string; size?: number }>()

/** "Ahmet Yılmaz" → "AY"; tek kelimede ilk iki harf. */
const initials = computed(() => {
  const words = name.trim().split(/\s+/)
  const letters = words.length > 1 ? words[0]!.charAt(0) + words[words.length - 1]!.charAt(0) : name.slice(0, 2)
  return letters.toLocaleUpperCase('tr-TR')
})
</script>

<template>
  <span class="user-avatar" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.36)}px` }"
    aria-hidden="true">{{ initials }}</span>
</template>

<style scoped>
.user-avatar {
  display: inline-grid;
  place-items: center;
  flex: none;
  border-radius: 50%;
  background: var(--brand-tint);
  color: var(--brand-primary);
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;
}
</style>
