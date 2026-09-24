<script setup lang="ts">
import { showImagePreview } from 'vant'
import { Play } from 'lucide-vue-next'
import type { MediaView } from '@/core/api/generated/model'
import { useSiteLibrary } from '@/core/sites/useSiteLibrary'
import DocumentChip from '@/shared/atoms/DocumentChip.vue'

/**
 * "Medya ve belgeler" (WhatsApp gibi): Medya sekmesinde fotoğraf ve videolar aylara ayrılmış ızgarada,
 * Belgeler sekmesinde PDF'ler. Şantiyenin bütün geçmişi: geçen ayın fotoğrafı buradan bulunur.
 */
const show = defineModel<boolean>('show', { required: true })
const { siteId } = defineProps<{ siteId: string }>()
const { mediaMonths, documentMonths, photoUrls, isLoading } = useSiteLibrary(() => siteId)

function openItem(item: MediaView) {
  if (item.kind === 'VIDEO') window.open(item.url ?? '', '_blank')
  else showImagePreview({ images: photoUrls.value, startPosition: photoUrls.value.indexOf(item.url ?? ''), closeable: true })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" class="library">
    <h2 class="library__title">Medya ve belgeler</h2>
    <van-loading v-if="isLoading" size="20" class="library__loading" />
    <van-tabs v-else>
      <van-tab title="Medya">
        <van-empty v-if="!mediaMonths.length" description="Henüz fotoğraf ya da video yok" />
        <section v-for="month in mediaMonths" :key="month.key" class="library__month">
          <h3>{{ month.title }}</h3>
          <div class="library__grid">
            <button v-for="item in month.items" :key="item.id" type="button" class="library__cell" @click="openItem(item)">
              <img :src="item.thumbnailUrl ?? ''" alt="" loading="lazy" />
              <Play v-if="item.kind === 'VIDEO'" :size="22" class="library__play" />
            </button>
          </div>
        </section>
      </van-tab>
      <van-tab title="Belgeler">
        <van-empty v-if="!documentMonths.length" description="Henüz belge yok" />
        <section v-for="month in documentMonths" :key="month.key" class="library__month">
          <h3>{{ month.title }}</h3>
          <DocumentChip v-for="item in month.items" :key="item.id" :document="item" />
        </section>
      </van-tab>
    </van-tabs>
  </van-popup>
</template>

<style scoped>
.library {
  height: 90dvh;
  overflow-y: auto;
}

.library__title {
  margin: 0;
  padding: var(--space-5) var(--space-4) var(--space-2);
  font-size: var(--text-lg);
}

.library__loading {
  padding: var(--space-6);
  text-align: center;
}

.library__month {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-3) 0;
}

.library__month h3 {
  margin: 0;
  color: var(--text-subtle);
  font-size: var(--text-xs);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.library__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
}

.library__cell {
  position: relative;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  background: var(--surface-muted);
}

.library__cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.library__play {
  position: absolute;
  inset: 0;
  margin: auto;
  color: #fff;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.5));
}
</style>
