<script setup lang="ts">
import { computed } from 'vue'
import type { SiteToday } from '@/core/api/generated/model'
import { listMoment } from '@/core/format/dates'
import { sitePreview } from '@/core/today/siteRow'

/**
 * Ana ekrandaki şantiye satırı; WhatsApp sohbet listesindeki satırın aynısı: ad, son haberin saati,
 * okunmadı rozeti ve tek satır önizleme. Yoğunluk kademesi, durum etiketi ve fotoğraf şeridi yok —
 * bir şantiyeden ne zaman haber geldiğini saatin kendisi söyler ("Dün 17:40", "12 Eyl").
 * Ok işareti yok: bütün satır dokunulur.
 */
const { site } = defineProps<{ site: SiteToday }>()
const emit = defineEmits<{ open: [siteId: string] }>()

const preview = computed(() => sitePreview(site))
</script>

<template>
  <van-cell clickable class="site-row" @click="emit('open', site.siteId)">
    <template #title>
      <span class="site-row__head">
        <span class="site-row__name">{{ site.name }}</span>
        <time v-if="site.lastPostAt" class="site-row__time" :class="{ 'site-row__time--unread': site.unreadPosts }"
          :datetime="site.lastPostAt">{{ listMoment(site.lastPostAt) }}</time>
        <!-- Okunmamış bilgi alarm değildir: rozet marka lacivertidir, kırmızı değil. -->
        <van-badge v-if="site.unreadPosts" :content="site.unreadPosts" :max="99" color="var(--brand-primary)"
          class="site-row__badge" />
      </span>
    </template>
    <template v-if="preview" #label>
      <span class="site-row__preview">{{ preview }}</span>
    </template>
  </van-cell>
</template>

<style scoped>
/*
 * Vant'ın başlık sütunu flex öğesidir ve varsayılan en küçük genişliği içeriği kadardır: tek satıra
 * zorlanan önizleme metni sütunu ekrandan taşırıyordu (saat ve rozet dışarıda kalıyordu).
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

.site-row__name {
  overflow: hidden;
  flex: 0 1 auto;
  font-weight: var(--weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
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

.site-row__preview {
  display: block;
  overflow: hidden;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
