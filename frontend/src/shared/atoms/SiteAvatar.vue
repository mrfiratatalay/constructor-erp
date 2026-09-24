<script setup lang="ts">
import { ref, watch } from 'vue'
import { HardHat } from 'lucide-vue-next'

/**
 * Şantiyenin fotoğrafı, WhatsApp'taki grup fotoğrafı gibi yuvarlak. Konmamışsa (ya da henüz işleniyorsa)
 * gri zeminde baret: WhatsApp'ın gri grup simgesinin karşılığı.
 */
const { photoUrl = null, size = 48 } = defineProps<{ photoUrl?: string | null; size?: number }>()
const failed = ref(false)
watch(() => photoUrl, () => (failed.value = false))
</script>

<template>
  <span class="site-avatar" :style="{ width: `${size}px`, height: `${size}px` }" aria-hidden="true">
    <img v-if="photoUrl && !failed" :src="photoUrl" alt="" loading="lazy" decoding="async" @error="failed = true" />
    <HardHat v-else :size="Math.round(size * 0.5)" />
  </span>
</template>

<style scoped>
.site-avatar {
  display: inline-grid;
  place-items: center;
  flex: none;
  overflow: hidden;
  border-radius: 50%;
  background: var(--surface-muted);
  color: var(--text-subtle);
}

.site-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
