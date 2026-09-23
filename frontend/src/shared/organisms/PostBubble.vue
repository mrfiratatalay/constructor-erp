<script setup lang="ts">
import type { PostView } from '@/core/api/generated/model'
import { clockTime } from '@/core/format/dates'
import DeletedPostNote from '@/shared/molecules/DeletedPostNote.vue'
import PostMedia from '@/shared/molecules/PostMedia.vue'

/**
 * Gönderi, WhatsApp'taki mesaj baloncuğudur: içeriği kadar geniştir, kendi gönderin sağda ve lacivert
 * zeminde durur, başkasınınkinde üstte adı yazar. Sıra: önce fotoğraf, sonra yazı, en altta saat.
 * Kütüphaneden bağımsızdır (iki kabukta birebir aynı görünür); masaüstündeki ⋯ menüsü yuvadan gelir.
 */
defineOptions({ inheritAttrs: false })

const { post, mine } = defineProps<{ post: PostView; mine: boolean }>()
const emit = defineEmits<{ openPhotos: [urls: string[], index: number] }>()
</script>

<template>
  <div class="bubble-row" :class="{ 'bubble-row--mine': mine }">
    <DeletedPostNote v-if="post.deletion" :deletion="post.deletion" />
    <article v-else class="bubble" :class="{ 'bubble--mine': mine }" v-bind="$attrs">
      <p v-if="!mine" class="bubble__author">{{ post.author.fullName }}</p>
      <div v-if="$slots.menu" class="bubble__menu"><slot name="menu" /></div>
      <PostMedia :media="post.media" @open-photos="(urls, index) => emit('openPhotos', urls, index)" />
      <p v-if="post.body" class="bubble__body">{{ post.body }}</p>
      <span class="bubble__time">
        <span v-if="post.editedAt">düzenlendi · </span>
        <time :datetime="post.createdAt">{{ clockTime(post.createdAt) }}</time>
      </span>
    </article>
  </div>
</template>

<style scoped>
.bubble-row {
  display: flex;
  justify-content: flex-start;
}

.bubble-row--mine {
  justify-content: flex-end;
}

.bubble {
  position: relative;
  display: grid;
  gap: 6px;
  /* Baloncuk içeriği kadar: uzun rapor okunabilir kalsın diye tavan var, kısa not kutuya yayılmasın. */
  max-width: min(78%, 520px);
  min-width: 96px;
  padding: 8px 10px 4px;
  border-radius: var(--radius-lg);
  border-top-left-radius: 4px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.bubble--mine {
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: 4px;
  background: var(--brand-tint);
}

.bubble__author {
  margin: 0;
  color: var(--brand-primary);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}

.bubble__body {
  margin: 0;
  font-size: var(--text-base);
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

/* Saat WhatsApp'taki gibi baloncuğun sağ alt köşesinde, küçük ve soluk. */
.bubble__time {
  justify-self: end;
  color: var(--text-subtle);
  font-size: var(--text-xs);
}

/* ⋯ yalnızca fareyle üstüne gelince belirir: baloncuk sakin kalır. */
.bubble__menu {
  position: absolute;
  top: 2px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.12s ease;
}

.bubble:hover .bubble__menu,
.bubble__menu:focus-within {
  opacity: 1;
}
</style>
