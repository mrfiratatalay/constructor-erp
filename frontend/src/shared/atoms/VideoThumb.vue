<script setup lang="ts">
import { ref } from 'vue'
import { Play } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'

/**
 * Saha akışındaki video: önce fotoğraf kadar küçük bir kapak (▶ ve süresi); dokununca yerinde oynar.
 * Akış kapaklarla sakin kalır, video ancak istenince yer kaplar. Kapak genişliği --thumb-width ile gelir.
 */
const { src, poster = null, duration = null } = defineProps<{
  src: string
  poster?: string | null
  duration?: number | null
}>()
const playing = ref(false)
</script>

<template>
  <video v-if="playing" class="video-thumb__player" :src="src" :poster="poster ?? undefined" controls autoplay
    playsinline />
  <button v-else type="button" class="video-thumb" aria-label="Videoyu oynat" @click="playing = true">
    <img v-if="poster" :src="poster" alt="" loading="lazy" decoding="async" />
    <span class="video-thumb__play"><Play :size="18" fill="currentColor" /></span>
    <span v-if="duration" class="video-thumb__time">{{ durationLabel(duration) }}</span>
  </button>
</template>

<style scoped>
.video-thumb {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--thumb-width, 200px);
  aspect-ratio: 3 / 2;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: var(--radius-sm);
  background: #0b1020;
  cursor: pointer;
}

.video-thumb img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumb__play {
  position: relative;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding-left: 3px;
  border-radius: 50%;
  background: rgb(15 23 42 / 0.6);
  color: #fff;
}

.video-thumb__time {
  position: absolute;
  right: 6px;
  bottom: 6px;
  padding: 1px 6px;
  border-radius: 6px;
  background: rgb(15 23 42 / 0.6);
  color: #fff;
  font-size: 11px;
  font-weight: var(--weight-semibold);
  font-variant-numeric: tabular-nums;
}

/* Dikey video iki yanı siyah kalmasın diye genişliği değil yüksekliği sınırlanır (PostMedia ile aynı). */
.video-thumb__player {
  display: block;
  max-width: 100%;
  max-height: 420px;
  border-radius: var(--radius-md);
  background: #0b1020;
}
</style>
