<script setup lang="ts">
import { computed } from 'vue'
import type { SiteToday } from '@/core/api/generated/model'
import { listMoment } from '@/core/format/dates'
import { firstName } from '@/core/format/names'
import { postPreview } from '@/core/posts/postPreview'
import { showsPreview, type SiteDensity } from '@/core/today/siteRow'
import { siteStatusLine } from '@/core/today/siteStatusLine'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import PhotoStrip from '@/mobile/molecules/PhotoStrip.vue'

/**
 * Ana ekrandaki şantiye satırı. Yoğunluk önemden gelir: geniş (yeni haber: fotoğraf şeridi + önizleme),
 * orta (sorunluda önizleme + kırmızı etiket, sessizde durum + sorumlu), tek satır (ad · sorumlu · saat).
 * Ok işareti yok: bütün satır dokunulur.
 */
const { site, density } = defineProps<{ site: SiteToday; density: SiteDensity }>()
const emit = defineEmits<{ open: [siteId: string] }>()

const status = computed(() => siteStatusLine(site))
const leads = computed(() => site.leads.map((lead) => firstName(lead.fullName)).join(', '))
const preview = computed(() =>
  site.latestPost && showsPreview(site, density) ? postPreview(site.latestPost) : null,
)
const showPhotos = computed(() => density === 'wide' && site.recentPhotoUrls.length > 0)
</script>

<template>
  <van-cell clickable :class="['site-row', `site-row--${density}`]" @click="emit('open', site.siteId)">
    <template #title>
      <span class="site-row__head">
        <span class="site-row__name">{{ site.name }}</span>
        <span v-if="density === 'compact' && leads" class="site-row__lead">· {{ leads }}</span>
        <time v-if="site.lastPostAt" class="site-row__time" :class="{ 'site-row__time--unread': site.unreadPosts }"
          :datetime="site.lastPostAt">{{ listMoment(site.lastPostAt) }}</time>
        <!-- Okunmamış bilgi alarm değildir: kırmızı açık soruna ayrıldı, rozet lacivert. -->
        <van-badge v-if="site.unreadPosts" :content="site.unreadPosts" :max="99" color="var(--brand-primary)"
          class="site-row__badge" />
      </span>
    </template>
    <template v-if="density !== 'compact'" #label>
      <PhotoStrip v-if="showPhotos" :urls="site.recentPhotoUrls" :total="site.photosToday" class="site-row__photos" />
      <span v-if="preview" class="site-row__preview">{{ preview }}</span>
      <span v-if="status" class="site-row__status">
        <StatusTag :tone="status.tone">{{ status.label }}</StatusTag>
        <span v-if="density === 'quiet' && !preview && leads">{{ leads }}</span>
      </span>
    </template>
  </van-cell>
</template>

<style scoped>
/*
 * Vant'ın başlık sütunu flex öğesidir ve varsayılan en küçük genişliği içeriği kadardır: tek satıra
 * zorlanan önizleme metni sütunu ekrandan taşırıyordu (saat, rozet ve üçüncü fotoğraf dışarıda kalıyordu).
 */
.site-row :deep(.van-cell__title) {
  min-width: 0;
}

.site-row__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.site-row__name,
.site-row__lead {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-row__name {
  flex: 0 1 auto;
  font-weight: var(--weight-bold);
}

.site-row--wide .site-row__name {
  font-size: var(--text-md);
}

.site-row__lead {
  flex: 0 1 auto;
  color: var(--text-muted);
}

.site-row__time {
  flex: none;
  margin-left: auto;
  color: var(--text-subtle);
  font-size: var(--text-sm);
}

.site-row__time--unread {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
}

/* Vant köşe kaydırmasını (translate) tek başına duran rozete de uyguluyor; satırda saatin yanında dursun. */
.site-row__badge {
  flex: none;
  transform: none;
}

.site-row__photos {
  margin: var(--space-2) 0;
}

.site-row__preview {
  display: block;
  overflow: hidden;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-row__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-top: 6px;
}
</style>
