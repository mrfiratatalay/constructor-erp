<script setup lang="ts">
import type { FieldSummary } from '@/core/field/fieldSummary'

/**
 * Saha sekmesinin tek güçlü alanı: en son çekilen saha fotoğrafı geniş, üstünde hafif bir gölgeyle
 * "Bugün şantiyede · Son güncelleme 17:42 · Musa · 4 saha güncellemesi". Küçük kutular, sayaçlar yok.
 * Fotoğraf yoksa şantiyenin lacivert ızgaralı zemini. Dokununca fotoğraf tam ekran açılır.
 */
const { summary } = defineProps<{ summary: FieldSummary }>()
const emit = defineEmits<{ open: [url: string] }>()
</script>

<template>
  <header class="field-hero" :class="{ 'field-hero--plain': !summary.photoUrl }">
    <button v-if="summary.photoUrl" type="button" class="field-hero__photo" aria-label="Fotoğrafı büyüt"
      @click="emit('open', summary.photoUrl)">
      <img :src="summary.photoUrl" alt="" decoding="async" />
    </button>
    <div class="field-hero__text">
      <h2 class="field-hero__title">{{ summary.title }}</h2>
      <p>{{ summary.lastUpdate }}</p>
      <p v-if="summary.todayCount">{{ summary.todayCount }}</p>
    </div>
  </header>
</template>

<style scoped>
.field-hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  height: clamp(150px, 22vw, 190px);
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--brand-deep);
  color: #fff;
}

.field-hero--plain {
  background-image: var(--blueprint-grid);
  background-size: var(--blueprint-grid-size);
}

.field-hero__photo {
  position: absolute;
  inset: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: zoom-in;
}

.field-hero__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Yazı fotoğrafın sol altında; gölge yalnızca okunacak kadar, fotoğrafı karartmaz. */
.field-hero__photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgb(10 18 44 / 0.62) 0%, rgb(10 18 44 / 0.18) 55%, transparent 80%),
    linear-gradient(0deg, rgb(10 18 44 / 0.5) 0%, transparent 60%);
}

.field-hero__text {
  position: relative;
  display: grid;
  gap: 2px;
  padding: var(--space-5) var(--space-5) var(--space-4);
  pointer-events: none;
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
}

.field-hero__text p {
  margin: 0;
  color: rgb(255 255 255 / 0.9);
  font-size: var(--text-sm);
}

.field-hero__title {
  margin: 0 0 var(--space-1);
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.01em;
}
</style>
