<script setup lang="ts">
import { LoaderCircle, TriangleAlert } from 'lucide-vue-next'
import type { MediaViewKind } from '@/core/api/generated/model'

const { kind, failed } = defineProps<{ kind: MediaViewKind; failed: boolean }>()

const LABELS: Record<MediaViewKind, string> = { PHOTO: 'Fotoğraf', VIDEO: 'Video', AUDIO: 'Sesli not', DOCUMENT: 'Belge' }
</script>

<template>
  <div class="media-pending" :class="{ 'media-pending--failed': failed }">
    <TriangleAlert v-if="failed" :size="18" />
    <LoaderCircle v-else :size="18" class="media-pending__spin" />
    <span>{{ LABELS[kind] }} {{ failed ? 'işlenemedi' : 'hazırlanıyor…' }}</span>
  </div>
</template>

<style scoped>
.media-pending {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--surface-muted);
  color: var(--text-muted);
  font-size: 14px;
}

.media-pending--failed {
  background: var(--status-neutral-bg);
}

.media-pending__spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .media-pending__spin {
    animation: none;
  }
}
</style>
