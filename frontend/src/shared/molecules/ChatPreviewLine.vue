<script setup lang="ts">
import type { ChatPreview } from '@/core/posts/postPreview'
import TickMark from '@/shared/atoms/TickMark.vue'

/** Liste satırının alt yazısı, WhatsApp'taki gibi: kendi mesajındaysa tik, sonra kimden ve ne. */
const { preview } = defineProps<{ preview: ChatPreview }>()
</script>

<template>
  <span class="chat-preview">
    <TickMark v-if="preview.tick" :tick="preview.tick" :size="15" />
    <span class="chat-preview__text">
      <template v-if="preview.author">{{ preview.author }}: </template>{{ preview.text }}
    </span>
  </span>
</template>

<style scoped>
.chat-preview {
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.chat-preview__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
