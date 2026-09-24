<script setup lang="ts">
import { computed } from 'vue'
import { Pin } from 'lucide-vue-next'
import type { SiteToday } from '@/core/api/generated/model'
import { listMoment } from '@/core/format/dates'
import { useLongPress } from '@/core/gestures/useLongPress'
import { activityAt, sitePreview } from '@/core/today/siteRow'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'
import ChatPreviewLine from '@/shared/molecules/ChatPreviewLine.vue'

/**
 * Ana ekrandaki şantiye satırı, WhatsApp'ın sohbet satırının aynısı: solda şantiye fotoğrafı, ad (sabitliyse
 * 📌), sağda akıştaki son şeyin zamanı ve okunmadı rozeti, altında tikli önizleme. Uzun basınca menü açılır.
 */
const { site, viewerId } = defineProps<{ site: SiteToday; viewerId?: string }>()
const emit = defineEmits<{ open: [siteId: string]; menu: [site: SiteToday] }>()
const longPress = useLongPress()

const preview = computed(() => sitePreview(site, viewerId))
const moment = computed(() => activityAt(site))
</script>

<template>
  <van-cell clickable center class="site-row" v-bind="longPress(() => emit('menu', site))"
    @click="emit('open', site.siteId)">
    <template #icon><SiteAvatar :photo-url="site.photoThumbnailUrl" :size="50" class="site-row__avatar" /></template>
    <template #title>
      <span class="site-row__head">
        <span class="site-row__name">{{ site.name }}</span>
        <time v-if="moment" class="site-row__time" :class="{ 'site-row__time--unread': site.unreadPosts }"
          :datetime="moment">{{ listMoment(moment) }}</time>
      </span>
    </template>
    <template #label>
      <span class="site-row__foot">
        <ChatPreviewLine v-if="preview" :preview="preview" class="site-row__preview" />
        <Pin v-if="site.pinnedAt" :size="15" class="site-row__pin" aria-label="Sabitlendi" />
        <!-- Okunmamış bilgi alarm değildir: rozet marka lacivertidir, kırmızı değil. -->
        <van-badge v-if="site.unreadPosts" :content="site.unreadPosts" :max="99" color="var(--brand-primary)"
          class="site-row__badge" />
      </span>
    </template>
  </van-cell>
</template>

<style scoped>
/* Vant'ın başlık sütunu flex öğesidir; tek satıra zorlanan önizleme sütunu ekrandan taşırmasın. */
.site-row :deep(.van-cell__title) {
  min-width: 0;
}

.site-row {
  -webkit-touch-callout: none;
  user-select: none;
}

.site-row__avatar {
  margin-right: var(--space-3);
}

.site-row__head,
.site-row__foot {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.site-row__name {
  overflow: hidden;
  flex: 1;
  font-weight: var(--weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-row__time {
  flex: none;
  color: var(--text-subtle);
  font-size: var(--text-sm);
}

.site-row__time--unread {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
}

.site-row__preview {
  flex: 1;
}

.site-row__pin {
  flex: none;
  color: var(--text-subtle);
}

/* Vant köşe kaydırmasını (translate) tek başına duran rozete de uyguluyor; satırda sağda dursun. */
.site-row__badge {
  flex: none;
  transform: none;
}
</style>
