<script setup lang="ts">
import { computed } from 'vue'
import { FileText } from 'lucide-vue-next'
import type { ProductionEntryView } from '@/core/api/generated/model'
import { clockTime } from '@/core/format/dates'
import { entryAmount } from '@/core/production/productionFormat'

/**
 * Geçmişteki bir giriş: "+3,5 ton · 12 çalışan · 16:42 · Mehmet Şef", notu, fotoğrafları (tıklayınca büyür) ve
 * belgeleri. 0 girilen gün "Çalışma yapılmadı" der. Şef yanlış girişi siler (onay sorulur).
 */
const { entry, unit, canDelete } = defineProps<{ entry: ProductionEntryView; unit: string; canDelete: boolean }>()
const emit = defineEmits<{ remove: [] }>()

const photos = computed(() => entry.media.filter((file) => file.kind === 'PHOTO' && file.url))
const photoUrls = computed(() => photos.value.map((file) => file.url!))
const documents = computed(() => entry.media.filter((file) => file.kind === 'DOCUMENT' && file.url))
const processing = computed(() => entry.media.filter((file) => file.status === 'PROCESSING').length)
const details = computed(() =>
  [entry.workerCount ? `${entry.workerCount} çalışan` : null, clockTime(entry.createdAt), entry.authorName]
    .filter(Boolean)
    .join(' · '),
)
</script>

<template>
  <div class="history-entry" data-testid="production-history-entry">
    <el-space :size="8" wrap>
      <el-text tag="b">{{ entry.quantity > 0 ? entryAmount(entry.quantity, unit) : 'Çalışma yapılmadı' }}</el-text>
      <el-text size="small" type="info">{{ details }}</el-text>
      <el-tag v-if="entry.onField" size="small" type="info" round>Saha'da</el-tag>
      <el-popconfirm v-if="canDelete" title="Bu giriş silinsin mi? Toplamdan düşer." confirm-button-text="Sil"
        cancel-button-text="Vazgeç" width="240" @confirm="emit('remove')">
        <template #reference><el-button link type="danger" size="small">Sil</el-button></template>
      </el-popconfirm>
    </el-space>
    <el-text v-if="entry.note">{{ entry.note }}</el-text>
    <el-space v-if="photos.length || documents.length || processing" :size="8" wrap>
      <el-image v-for="(photo, index) in photos" :key="photo.id" :src="photo.thumbnailUrl ?? photo.url!" fit="cover"
        :preview-src-list="photoUrls" :initial-index="index" preview-teleported class="history-entry__photo" />
      <el-link v-for="doc in documents" :key="doc.id" :href="doc.url!" target="_blank" type="primary">
        <FileText :size="15" />&nbsp;{{ doc.fileName ?? 'Belge' }}
      </el-link>
      <el-text v-if="processing" size="small" type="info">{{ processing }} dosya hazırlanıyor…</el-text>
    </el-space>
  </div>
</template>

<style scoped>
.history-entry {
  display: grid;
  gap: var(--space-1);
  padding-bottom: var(--space-3);
}

.history-entry__photo {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-sm);
}
</style>
