<script setup lang="ts">
import { computed } from 'vue'
import { showImagePreview } from 'vant'
import type { ProductionEntryView } from '@/core/api/generated/model'
import { clockTime } from '@/core/format/dates'
import { entryAmount } from '@/core/production/productionFormat'

/**
 * Geçmişteki bir giriş, telefonda: "+3,5 ton", altında "12 çalışan · 16:42 · Mehmet Şef", not, fotoğraflar
 * (dokununca büyür) ve belgeler. 0 girilen gün "Çalışma yapılmadı" der. Şef sola kaydırıp siler (onay sorulur).
 */
const { entry, unit, canDelete } = defineProps<{ entry: ProductionEntryView; unit: string; canDelete: boolean }>()
const emit = defineEmits<{ remove: [] }>()

const photos = computed(() => entry.media.filter((file) => file.kind === 'PHOTO' && file.url))
const documents = computed(() => entry.media.filter((file) => file.kind === 'DOCUMENT' && file.url))
const processing = computed(() => entry.media.filter((file) => file.status === 'PROCESSING').length)
const details = computed(() =>
  [entry.workerCount ? `${entry.workerCount} çalışan` : null, clockTime(entry.createdAt), entry.authorName]
    .filter(Boolean)
    .join(' · '),
)
const openPhotos = (index: number) =>
  showImagePreview({ images: photos.value.map((file) => file.url!), startPosition: index, closeable: true })
</script>

<template>
  <van-swipe-cell :disabled="!canDelete" data-testid="production-history-entry">
    <van-cell :title="entry.quantity > 0 ? entryAmount(entry.quantity, unit) : 'Çalışma yapılmadı'" :label="details">
      <template #value><van-tag v-if="entry.onField" plain round>Saha'da</van-tag></template>
    </van-cell>
    <div v-if="entry.note || photos.length || documents.length || processing" class="entry-cell__more">
      <p v-if="entry.note" class="entry-cell__note">{{ entry.note }}</p>
      <van-space wrap :size="8">
        <van-image v-for="(photo, index) in photos" :key="photo.id" :src="photo.thumbnailUrl ?? photo.url!" width="64"
          height="64" radius="8" fit="cover" @click="openPhotos(index)" />
        <a v-for="doc in documents" :key="doc.id" :href="doc.url!" target="_blank" class="entry-cell__doc">
          <van-icon name="description" /> {{ doc.fileName ?? 'Belge' }}
        </a>
        <span v-if="processing" class="entry-cell__hint">{{ processing }} dosya hazırlanıyor…</span>
      </van-space>
    </div>
    <template #right>
      <van-button square type="danger" text="Sil" class="entry-cell__delete" @click="emit('remove')" />
    </template>
  </van-swipe-cell>
</template>

<style scoped>
.entry-cell__more {
  padding: 0 var(--space-4) var(--space-3);
  background: var(--van-cell-background);
}

.entry-cell__note {
  margin: 0 0 var(--space-2);
  color: var(--text-strong);
}

.entry-cell__doc {
  color: var(--van-primary-color);
}

.entry-cell__hint {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.entry-cell__delete {
  height: 100%;
}
</style>
