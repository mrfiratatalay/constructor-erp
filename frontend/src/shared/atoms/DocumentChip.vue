<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import type { MediaView } from '@/core/api/generated/model'
import { fileSize } from '@/core/format/fileSize'

/** Mesajdaki belge (WhatsApp'taki PDF satırı): adı ve boyutu; dokununca tarayıcıda ya da telefonda açılır. */
const { document } = defineProps<{ document: MediaView }>()
</script>

<template>
  <a class="document-chip" :href="document.url ?? undefined" target="_blank" rel="noopener">
    <span class="document-chip__icon"><FileText :size="22" /></span>
    <span class="document-chip__text">
      <strong>{{ document.fileName ?? 'Belge' }}</strong>
      <small>PDF · {{ fileSize(document.sizeBytes) }}</small>
    </span>
  </a>
</template>

<style scoped>
.document-chip {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--surface-muted);
  color: inherit;
  text-decoration: none;
}

.document-chip__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: #e5484d;
  color: #fff;
}

.document-chip__text {
  display: grid;
  min-width: 0;
}

.document-chip__text strong {
  overflow: hidden;
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-chip__text small {
  color: var(--text-muted);
  font-size: var(--text-xs);
}
</style>
