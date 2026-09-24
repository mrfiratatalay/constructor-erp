<script setup lang="ts">
import { computed } from 'vue'

/**
 * Mesajdaki fotoğraflar, WhatsApp'taki albüm gibi: tek fotoğraf tek başına, çok fotoğraf 2×2 ızgara; dörtten
 * fazlasında son karede "+N". Üç fotoğrafta ilki iki sütunu kaplar ki boş kare kalmasın. Dokununca tam ekran.
 */
const { thumbnails } = defineProps<{ thumbnails: string[] }>()
const emit = defineEmits<{ open: [index: number] }>()

const VISIBLE = 4
const shown = computed(() => thumbnails.slice(0, VISIBLE))
const hiddenCount = computed(() => thumbnails.length - shown.value.length)
const single = computed(() => thumbnails.length === 1)
</script>

<template>
  <div class="photo-grid" :class="{ 'photo-grid--single': single }">
    <button v-for="(src, index) in shown" :key="src" type="button" class="photo-grid__item"
      :class="{ 'photo-grid__item--wide': single || (thumbnails.length === 3 && index === 0) }"
      :aria-label="`Fotoğraf ${index + 1}`" @click="emit('open', index)">
      <img :src="src" alt="" loading="lazy" decoding="async" />
      <span v-if="index === VISIBLE - 1 && hiddenCount > 0" class="photo-grid__more">+{{ hiddenCount }}</span>
    </button>
  </div>
</template>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3px;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.photo-grid--single {
  grid-template-columns: 1fr;
}

.photo-grid__item {
  position: relative;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  background: var(--surface-muted);
  cursor: zoom-in;
}

.photo-grid__item--wide {
  grid-column: 1 / -1;
  aspect-ratio: 4 / 3;
}

.photo-grid__item img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-grid__more {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(15 23 42 / 0.55);
  color: #fff;
  font-size: 26px;
  font-weight: 700;
}
</style>
