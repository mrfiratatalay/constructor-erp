<script setup lang="ts">
import { FileText, Mic, X } from 'lucide-vue-next'
import type { Attachment } from '@/core/posts/attachments'

/**
 * Gönderme çubuğunun içinde, yazının üstünde eklenen dosyalar: küçük kareler, köşesinde ✕. Ayrı bir önizleme
 * penceresi açılmaz; çubuk yalnızca biraz büyür (Saha'da güncelleme mesaj atmak kadar kolay kalsın diye).
 */
const { attachments } = defineProps<{ attachments: Attachment[] }>()
const emit = defineEmits<{ remove: [attachmentId: string] }>()
</script>

<template>
  <ul class="attachment-thumbs">
    <li v-for="item in attachments" :key="item.id" class="attachment-thumbs__item">
      <img v-if="item.kind === 'PHOTO'" :src="item.previewUrl" alt="" />
      <video v-else-if="item.kind === 'VIDEO'" :src="item.previewUrl" muted playsinline preload="metadata" />
      <Mic v-else-if="item.kind === 'AUDIO'" :size="22" />
      <FileText v-else :size="22" />
      <button type="button" class="attachment-thumbs__remove" aria-label="Çıkar" @click="emit('remove', item.id)">
        <X :size="12" :stroke-width="3" />
      </button>
    </li>
  </ul>
</template>

<style scoped>
.attachment-thumbs {
  display: flex;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  overflow-x: auto;
  list-style: none;
}

.attachment-thumbs__item {
  position: relative;
  display: grid;
  flex: none;
  place-items: center;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
  color: var(--text-muted);
}

.attachment-thumbs__item img,
.attachment-thumbs__item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attachment-thumbs__remove {
  position: absolute;
  top: 3px;
  right: 3px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgb(15 23 42 / 0.7);
  color: #fff;
  cursor: pointer;
}
</style>
