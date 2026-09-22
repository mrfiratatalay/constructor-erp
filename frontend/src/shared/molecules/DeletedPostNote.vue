<script setup lang="ts">
import { Ban } from 'lucide-vue-next'
import type { PostDeletion } from '@/core/api/generated/model'
import { dateTime } from '@/core/format/dates'

/** Silinen gönderinin izi: içerik gitti, ama silindiği ve kimin sildiği görünür (TASARIM.md İlke 6). */
const { deletion, issue } = defineProps<{ deletion: PostDeletion; issue: boolean }>()
</script>

<template>
  <p class="deleted-post">
    <Ban :size="16" class="deleted-post__icon" />
    <span>
      {{ issue ? 'Bu sorun silindi' : 'Bu gönderi silindi' }}
      <span class="deleted-post__meta">· {{ deletion.deletedByName }} · {{ dateTime(deletion.deletedAt) }}</span>
    </span>
  </p>
</template>

<style scoped>
.deleted-post {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-style: italic;
}

.deleted-post__icon {
  flex: none;
  color: var(--text-subtle);
}

.deleted-post__meta {
  color: var(--text-subtle);
  font-style: normal;
}
</style>
