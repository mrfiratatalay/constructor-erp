<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, Play } from 'lucide-vue-next'
import type { MediaView } from '@/core/api/generated/model'
import { useSiteLibrary } from '@/core/sites/useSiteLibrary'
import DocumentChip from '@/shared/atoms/DocumentChip.vue'

/**
 * "Medya ve belgeler" (WhatsApp Masaüstü gibi bilgi panelinin içinde): Medya sekmesinde aylara ayrılmış
 * ızgara, Belgeler sekmesinde PDF'ler. ‹ ile bilgiye dönülür.
 */
const { siteId } = defineProps<{ siteId: string }>()
const emit = defineEmits<{ back: [] }>()
const { mediaMonths, documentMonths, photoUrls } = useSiteLibrary(() => siteId)
const tab = ref('media')
const viewerIndex = ref<number | null>(null)

function openItem(item: MediaView) {
  if (item.kind === 'VIDEO') window.open(item.url ?? '', '_blank')
  else viewerIndex.value = Math.max(0, photoUrls.value.indexOf(item.url ?? ''))
}
</script>

<template>
  <section class="library">
    <header class="library__head">
      <el-button text circle aria-label="Geri" @click="emit('back')"><ChevronLeft :size="18" /></el-button>
      <strong>Medya ve belgeler</strong>
    </header>
    <el-tabs v-model="tab">
      <el-tab-pane label="Medya" name="media">
        <el-empty v-if="!mediaMonths.length" :image-size="56" description="Henüz fotoğraf ya da video yok" />
        <div v-for="month in mediaMonths" :key="month.key" class="library__month">
          <h3>{{ month.title }}</h3>
          <div class="library__grid">
            <button v-for="item in month.items" :key="item.id" type="button" class="library__cell" @click="openItem(item)">
              <img :src="item.thumbnailUrl ?? ''" alt="" loading="lazy" />
              <Play v-if="item.kind === 'VIDEO'" :size="20" class="library__play" />
            </button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Belgeler" name="documents">
        <el-empty v-if="!documentMonths.length" :image-size="56" description="Henüz belge yok" />
        <div v-for="month in documentMonths" :key="month.key" class="library__month">
          <h3>{{ month.title }}</h3>
          <DocumentChip v-for="item in month.items" :key="item.id" :document="item" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="viewerIndex !== null" :url-list="photoUrls" :initial-index="viewerIndex" teleported
      @close="viewerIndex = null" />
  </section>
</template>

<style scoped>
.library__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.library__month {
  display: grid;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
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
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}

.library__cell {
  position: relative;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  background: var(--surface-muted);
  cursor: zoom-in;
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
