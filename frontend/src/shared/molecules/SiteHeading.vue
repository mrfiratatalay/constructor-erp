<script setup lang="ts">
import type { SiteView } from '@/core/api/generated/model'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'

/**
 * Şantiyenin başlığı, WhatsApp'taki sohbet başlığı gibi: fotoğraf, ad ve altında katılımcılar
 * ("Musa, Sen"). Dokununca şantiye bilgisi açılır.
 */
const { site, line, size = 40 } = defineProps<{ site: SiteView; line: string; size?: number }>()
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <button type="button" class="site-heading" aria-label="Şantiye bilgisi" @click="emit('open')">
    <SiteAvatar :photo-url="site.photoThumbnailUrl" :size="size" />
    <span class="site-heading__text">
      <strong>{{ site.name }}</strong>
      <small v-if="line">{{ line }}</small>
    </span>
  </button>
</template>

<style scoped>
.site-heading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.site-heading__text {
  display: grid;
  min-width: 0;
  line-height: 1.25;
}

.site-heading__text strong,
.site-heading__text small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-heading__text strong {
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
}

.site-heading__text small {
  color: var(--text-muted);
  font-size: 12px;
}
</style>
