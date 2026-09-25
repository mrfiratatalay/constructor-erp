<script setup lang="ts">
import { computed } from 'vue'
import { queuedFilesLabel } from '@/core/posts/queuedFiles'
import type { QueuedPost } from '@/core/posts/uploadStorage'
import FieldRow from '@/shared/molecules/FieldRow.vue'

/**
 * Bu telefondan henüz gitmemiş saha güncellemesi (🕓): günün en üstünde, soluk. İnternet gelince gider ve yerini
 * asıl güncelleme alır (sohbetteki gitmemiş mesaj gibi).
 */
const { post } = defineProps<{ post: QueuedPost }>()
const files = computed(() => queuedFilesLabel(post.files))
</script>

<template>
  <FieldRow :at="post.queuedAt" kind="pending">
    <p v-if="post.body" class="queued-entry__title">{{ post.body }}</p>
    <p class="queued-entry__meta">
      <span v-if="post.issue">Sorun · </span><span v-if="files">{{ files }} · </span>Gönderiliyor…
    </p>
  </FieldRow>
</template>

<style scoped>
.queued-entry__title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  line-height: 1.4;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.queued-entry__meta {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
