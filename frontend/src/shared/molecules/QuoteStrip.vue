<script setup lang="ts">
import { computed } from 'vue'
import type { PostQuote } from '@/core/api/generated/model'

/**
 * Yanıtlanan mesajın alıntısı (WhatsApp gibi): solda renkli çizgi, kimin ve ne dediği, varsa küçük resmi.
 * Dokununca o mesaja gidilir. Çubuğun üstünde (yazarken) ✕ ile kapatılır.
 */
const { quote, closable = false } = defineProps<{ quote: PostQuote; closable?: boolean }>()
const emit = defineEmits<{ open: []; close: [] }>()

const LABELS: Record<string, string> = { PHOTO: '📷 Fotoğraf', VIDEO: '🎥 Video', AUDIO: '🎤 Sesli not', DOCUMENT: '📄 Belge' }
const text = computed(() => {
  if (quote.deleted) return '🚫 Bu mesaj silindi'
  return quote.body ?? (quote.mediaKind ? LABELS[quote.mediaKind] : '')
})
</script>

<template>
  <div class="quote-strip" role="button" tabindex="0" @click.stop="emit('open')" @keydown.enter="emit('open')">
    <span class="quote-strip__text">
      <strong>{{ quote.authorName }}</strong>
      <span>{{ text }}</span>
    </span>
    <img v-if="quote.thumbnailUrl && !quote.deleted" :src="quote.thumbnailUrl" alt="" class="quote-strip__thumb" />
    <button v-if="closable" type="button" class="quote-strip__close" aria-label="Yanıtlamaktan vazgeç"
      @click.stop="emit('close')">✕</button>
  </div>
</template>

<style scoped>
.quote-strip {
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
  min-width: 0;
  overflow: hidden;
  border-left: 4px solid var(--brand-primary);
  border-radius: var(--radius-sm);
  background: rgb(15 23 42 / 0.05);
  cursor: pointer;
}

.quote-strip__text {
  display: grid;
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
}

.quote-strip__text strong {
  color: var(--brand-primary);
  font-size: var(--text-xs);
}

.quote-strip__text span {
  overflow: hidden;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quote-strip__thumb {
  flex: none;
  width: 48px;
  object-fit: cover;
}

.quote-strip__close {
  flex: none;
  width: 36px;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
}
</style>
