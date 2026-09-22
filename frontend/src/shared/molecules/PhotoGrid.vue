<script setup lang="ts">
import { computed } from 'vue'

const { thumbnails } = defineProps<{ thumbnails: string[] }>()
const emit = defineEmits<{ open: [index: number] }>()

const VISIBLE = 6
const shown = computed(() => thumbnails.slice(0, VISIBLE))
const hiddenCount = computed(() => thumbnails.length - shown.value.length)
/** 1 fotoğraf geniş, 2 ya da 4 fotoğraf iki sütun, diğerleri üç sütun. */
const columns = computed(() => (thumbnails.length === 1 ? 1 : [2, 4].includes(thumbnails.length) ? 2 : 3))
</script>

<template>
  <div class="photo-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
    <button v-for="(src, index) in shown" :key="src" class="photo-grid__item" :class="{ 'photo-grid__item--wide': columns === 1 }"
      type="button" :aria-label="`Fotoğraf ${index + 1}`" @click="emit('open', index)">
      <img :src="src" alt="" loading="lazy" decoding="async" />
      <span v-if="index === VISIBLE - 1 && hiddenCount > 0" class="photo-grid__more">+{{ hiddenCount }}</span>
    </button>
  </div>
</template>

<style scoped>
.photo-grid {
  display: grid;
  gap: 4px;
  overflow: hidden;
  border-radius: var(--radius-md);
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
  font-size: 22px;
  font-weight: 700;
}
</style>
