<script setup lang="ts">
import { computed } from 'vue'
import type { MediaView } from '@/core/api/generated/model'
import AudioNote from '@/shared/atoms/AudioNote.vue'
import DocumentChip from '@/shared/atoms/DocumentChip.vue'
import MediaPending from '@/shared/atoms/MediaPending.vue'
import PhotoGrid from '@/shared/molecules/PhotoGrid.vue'

const { media } = defineProps<{ media: MediaView[] }>()
const emit = defineEmits<{ openPhotos: [urls: string[], index: number] }>()

const ready = computed(() => media.filter((item) => item.status === 'READY' && item.url))
const photos = computed(() => ready.value.filter((item) => item.kind === 'PHOTO'))
const videos = computed(() => ready.value.filter((item) => item.kind === 'VIDEO'))
const voices = computed(() => ready.value.filter((item) => item.kind === 'AUDIO'))
const documents = computed(() => ready.value.filter((item) => item.kind === 'DOCUMENT'))
const pending = computed(() => media.filter((item) => item.status !== 'READY'))
</script>

<template>
  <div v-if="media.length" class="post-media">
    <PhotoGrid v-if="photos.length" :thumbnails="photos.map((p) => p.thumbnailUrl ?? p.url!)"
      @open="emit('openPhotos', photos.map((p) => p.url!), $event)" />
    <video v-for="video in videos" :key="video.id" class="post-media__video" :src="video.url!"
      :poster="video.thumbnailUrl ?? undefined" controls playsinline preload="metadata" />
    <AudioNote v-for="voice in voices" :key="voice.id" :src="voice.url!" :duration="voice.durationSeconds ?? 0" />
    <DocumentChip v-for="document in documents" :key="document.id" :document="document" />
    <MediaPending v-for="item in pending" :key="item.id" :kind="item.kind" :failed="item.status === 'FAILED'" />
  </div>
</template>

<style scoped>
.post-media {
  display: grid;
  gap: var(--space-2);
}

/*
 * Sahadan gelen videolar çoğunlukla dikey. Genişliği zorlarsak video kendi içinde küçülüp
 * iki yanı simsiyah kalıyordu; sınırı verip boyutu videoya bırakıyoruz.
 */
.post-media__video {
  display: block;
  justify-self: start;
  max-width: 100%;
  max-height: 420px;
  border-radius: var(--radius-md);
  background: #0b1020;
}
</style>
