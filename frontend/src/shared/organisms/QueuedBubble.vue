<script setup lang="ts">
import { computed } from 'vue'
import { clockTime } from '@/core/format/dates'
import { kindOf } from '@/core/posts/attachments'
import type { QueuedPost } from '@/core/posts/uploadStorage'
import TickMark from '@/shared/atoms/TickMark.vue'

/**
 * Bu telefondan henüz gitmemiş mesaj (WhatsApp'taki 🕓): akışın dibinde, kendi mesajın gibi sağda ama soluk.
 * İnternet gelince gider; yerini asıl mesaj alır ve tik ✓ olur.
 */
const { post } = defineProps<{ post: QueuedPost }>()

const LABELS = { PHOTO: '📷 Fotoğraf', VIDEO: '🎥 Video', AUDIO: '🎤 Sesli not', DOCUMENT: '📄 Belge' } as const
const files = computed(() => {
  const kinds = post.files.map((file) => kindOf(file)).filter((kind) => kind !== null)
  const first = kinds[0]
  if (!first) return null
  return kinds.length > 1 ? `${LABELS[first]} ve ${kinds.length - 1} dosya daha` : LABELS[first]
})
</script>

<template>
  <div class="queued-row">
    <article class="queued-bubble">
      <p v-if="files" class="queued-bubble__files">{{ files }}</p>
      <p v-if="post.body" class="queued-bubble__body">{{ post.body }}</p>
      <span class="queued-bubble__time">
        <time :datetime="post.queuedAt">{{ clockTime(post.queuedAt) }}</time>
        <TickMark tick="pending" :size="15" />
      </span>
    </article>
  </div>
</template>

<style scoped>
.queued-row {
  display: flex;
  justify-content: flex-end;
}

.queued-bubble {
  display: grid;
  gap: 6px;
  max-width: min(78%, 520px);
  min-width: 96px;
  padding: 8px 10px 4px;
  border-radius: var(--radius-lg);
  border-top-right-radius: 4px;
  background: var(--brand-tint);
  box-shadow: var(--shadow-sm);
  opacity: 0.7;
}

.queued-bubble__files {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.queued-bubble__body {
  margin: 0;
  font-size: var(--text-base);
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.queued-bubble__time {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  justify-self: end;
  color: var(--text-subtle);
  font-size: var(--text-xs);
}
</style>
