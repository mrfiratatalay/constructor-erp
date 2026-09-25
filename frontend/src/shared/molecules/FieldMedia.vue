<script setup lang="ts">
import { computed } from 'vue'
import type { MediaView } from '@/core/api/generated/model'
import AudioNote from '@/shared/atoms/AudioNote.vue'
import DocumentChip from '@/shared/atoms/DocumentChip.vue'
import MediaPending from '@/shared/atoms/MediaPending.vue'
import VideoThumb from '@/shared/atoms/VideoThumb.vue'

/**
 * Güncellemenin kanıtı yazının hemen altında durur, ayrı bir galeride değil: "5. kat tamamlandı" ve altında o
 * işin fotoğrafı. Fotoğraf ve video kapakları yan yana, en çok dördü; fazlası "+N". Sesli not ve belge altında.
 */
const { media } = defineProps<{ media: MediaView[] }>()
const emit = defineEmits<{ openPhotos: [urls: string[], index: number] }>()

const VISIBLE = 4
const ready = computed(() => media.filter((item) => item.status === 'READY' && item.url))
const visuals = computed(() => ready.value.filter((item) => item.kind === 'PHOTO' || item.kind === 'VIDEO'))
const shown = computed(() => visuals.value.slice(0, VISIBLE))
const hidden = computed(() => visuals.value.length - shown.value.length)
const photoUrls = computed(() => visuals.value.filter((item) => item.kind === 'PHOTO').map((item) => item.url!))
const voices = computed(() => ready.value.filter((item) => item.kind === 'AUDIO'))
const documents = computed(() => ready.value.filter((item) => item.kind === 'DOCUMENT'))
const pending = computed(() => media.filter((item) => item.status !== 'READY'))

const openPhoto = (url: string) => emit('openPhotos', photoUrls.value, photoUrls.value.indexOf(url))
/** "+N" gösterilmeyen ilk fotoğraftan açar; tam ekranda hepsi kaydırılarak görülür. */
const openRest = () => emit('openPhotos', photoUrls.value, Math.min(VISIBLE, photoUrls.value.length - 1))
</script>

<template>
  <div v-if="media.length" class="field-media">
    <div v-if="shown.length" class="field-media__tiles">
      <template v-for="(item, index) in shown" :key="item.id">
        <VideoThumb v-if="item.kind === 'VIDEO'" :src="item.url!" :poster="item.thumbnailUrl"
          :duration="item.durationSeconds" />
        <button v-else type="button" class="field-media__photo" :aria-label="`Fotoğraf ${index + 1}`"
          @click="openPhoto(item.url!)">
          <img :src="item.thumbnailUrl ?? item.url!" alt="" loading="lazy" decoding="async" />
        </button>
      </template>
      <button v-if="hidden && photoUrls.length" type="button" class="field-media__more"
        :aria-label="`${hidden} görüntü daha`" @click="openRest">
        +{{ hidden }}
      </button>
    </div>
    <AudioNote v-for="voice in voices" :key="voice.id" :src="voice.url!" :duration="voice.durationSeconds ?? 0"
      class="field-media__voice" />
    <DocumentChip v-for="document in documents" :key="document.id" :document="document" />
    <MediaPending v-for="item in pending" :key="item.id" :kind="item.kind" :failed="item.status === 'FAILED'" />
  </div>
</template>

<style scoped>
.field-media {
  display: grid;
  gap: var(--space-2);
  justify-items: start;
}

/* Telefonda iki kare yan yana, geniş ekranda fotoğraf boyunda kareler. */
.field-media__tiles {
  --thumb-width: min(208px, calc(50% - 4px));
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  width: 100%;
}

.field-media__photo,
.field-media__more {
  width: var(--thumb-width);
  aspect-ratio: 3 / 2;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
  cursor: zoom-in;
}

.field-media__photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.field-media__more {
  width: auto;
  min-width: 64px;
  color: var(--text-muted);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
}

.field-media__voice {
  width: min(100%, 320px);
}
</style>
