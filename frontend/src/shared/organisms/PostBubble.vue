<script setup lang="ts">
import { computed } from 'vue'
import { Forward, Pin } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { clockTime } from '@/core/format/dates'
import { postElementId } from '@/core/posts/jumpToPost'
import { postTick } from '@/core/posts/ticks'
import TickMark from '@/shared/atoms/TickMark.vue'
import DeletedPostNote from '@/shared/molecules/DeletedPostNote.vue'
import PostMedia from '@/shared/molecules/PostMedia.vue'
import QuoteStrip from '@/shared/molecules/QuoteStrip.vue'

/**
 * Mesaj baloncuğu, WhatsApp'taki gibi: kendi mesajın sağda ve lacivert zeminde, başkasınınkinde üstte adı.
 * Sıra: "İletildi", alıntı, fotoğraf, yazı, en altta 📌 · saat · tik. Fotoğraflı baloncuk daha dardır (albüm).
 * Kütüphaneden bağımsızdır (iki kabukta birebir aynı görünür); masaüstündeki ⋯ menüsü yuvadan gelir.
 */
defineOptions({ inheritAttrs: false })

const { post, mine } = defineProps<{ post: PostView; mine: boolean }>()
const emit = defineEmits<{ openPhotos: [urls: string[], index: number]; openQuote: [postId: string] }>()

const visual = computed(() => post.media.some((item) => item.kind === 'PHOTO' || item.kind === 'VIDEO'))
</script>

<template>
  <div :id="postElementId(post.id)" class="bubble-row" :class="{ 'bubble-row--mine': mine }">
    <DeletedPostNote v-if="post.deletion" :deletion="post.deletion" />
    <article v-else class="bubble" :class="{ 'bubble--mine': mine, 'bubble--visual': visual }" v-bind="$attrs">
      <p v-if="!mine" class="bubble__author">{{ post.author.fullName }}</p>
      <div v-if="$slots.menu" class="bubble__menu"><slot name="menu" /></div>
      <p v-if="post.forwarded" class="bubble__forwarded"><Forward :size="13" />İletildi</p>
      <QuoteStrip v-if="post.replyTo" :quote="post.replyTo" @open="emit('openQuote', post.replyTo.id)" />
      <PostMedia :media="post.media" @open-photos="(urls, index) => emit('openPhotos', urls, index)" />
      <p v-if="post.body" class="bubble__body">{{ post.body }}</p>
      <span class="bubble__time">
        <Pin v-if="post.pin" :size="12" aria-label="Sabitlendi" />
        <span v-if="post.editedAt">düzenlendi · </span>
        <time :datetime="post.createdAt">{{ clockTime(post.createdAt) }}</time>
        <TickMark v-if="mine" :tick="postTick(post)" :size="15" />
      </span>
    </article>
  </div>
</template>

<style scoped>
.bubble-row {
  display: flex;
  justify-content: flex-start;
  border-radius: var(--radius-lg);
  transition: background 0.4s ease;
}

.bubble-row--mine {
  justify-content: flex-end;
}

/* Mesaja gidilince (arama, alıntı, sabit mesaj) satır kısa süre sarı yanar. */
.bubble-row.bubble--flash {
  background: rgb(250 204 21 / 0.28);
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

/* WhatsApp'taki gibi fotoğraflı baloncuk ekranın yarısını kaplamaz; dokununca tam ekran açılır. */
.bubble--visual {
  width: min(75%, 320px);
  padding: 4px 4px 4px;
}

.bubble--mine {
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: 4px;
  background: var(--brand-tint);
}

.bubble__author,
.bubble__forwarded {
  margin: 0;
  font-size: var(--text-xs);
}

.bubble--visual .bubble__author,
.bubble--visual .bubble__forwarded,
.bubble--visual .bubble__body,
.bubble--visual .bubble__time {
  padding: 0 6px;
}

.bubble__author {
  color: var(--brand-primary);
  font-weight: var(--weight-bold);
}

.bubble__forwarded {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-subtle);
  font-style: italic;
}

.bubble__body {
  margin: 0;
  font-size: var(--text-base);
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

/* Saat WhatsApp'taki gibi baloncuğun sağ alt köşesinde, küçük ve soluk; yanında tik. */
.bubble__time {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  justify-self: end;
  color: var(--text-subtle);
  font-size: var(--text-xs);
}

/* ⋯ yalnızca fareyle üstüne gelince belirir: baloncuk sakin kalır. */
.bubble__menu {
  position: absolute;
  top: 2px;
  right: 4px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.12s ease;
}

.bubble:hover .bubble__menu,
.bubble__menu:focus-within {
  opacity: 1;
}
</style>
