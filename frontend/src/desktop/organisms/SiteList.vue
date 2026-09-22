<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SiteToday, SiteView } from '@/core/api/generated/model'
import { listMoment } from '@/core/format/dates'
import { postPreview } from '@/core/posts/postPreview'
import { leadNames } from '@/core/sites/siteNames'
import { siteStatusLine } from '@/core/today/siteStatusLine'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'

/**
 * Şantiye listesi, WhatsApp'taki sohbet listesi gibi: her şantiye aynı satır. Üstte ad, saat ve okunmadı
 * rozeti; altında durum etiketi (varsa) ve son gönderinin önizlemesi. Kart, ızgara, fotoğraf yok:
 * fotoğraflar seçilen şantiyenin akışında. Sıralama dışarıdan gelir (önce dikkat isteyenler).
 */
const { sites, selectedId, completed } = defineProps<{
  sites: SiteToday[]
  selectedId: string | null
  completed: SiteView[]
}>()
const showCompleted = ref(false)

const rows = computed(() =>
  sites.map((site) => ({
    site,
    status: siteStatusLine(site),
    preview: site.latestPost ? postPreview(site.latestPost) : leadNames(site.leads),
  })),
)
const linkTo = (siteId: string) => ({ name: 'siteFeed', params: { siteId } })
</script>

<template>
  <ListRow v-for="{ site, status, preview } in rows" :key="site.siteId" :to="linkTo(site.siteId)"
    :selected="site.siteId === selectedId">
    <template #title>{{ site.name }}</template>
    <template #meta>
      <time v-if="site.lastPostAt" :class="{ 'site-list__time--unread': site.unreadPosts }">
        {{ listMoment(site.lastPostAt) }}
      </time>
      <!-- Okunmamış bilgi alarm değildir: kırmızı açık soruna ayrıldı, rozet lacivert. -->
      <el-badge v-if="site.unreadPosts" :value="site.unreadPosts" :max="99" type="primary" />
    </template>
    <StatusTag v-if="status" :tone="status.tone">{{ status.label }}</StatusTag>
    <span class="site-list__preview">{{ preview }}</span>
  </ListRow>
  <template v-if="completed.length">
    <el-button text class="site-list__more" @click="showCompleted = !showCompleted">
      Tamamlanan {{ completed.length }} şantiye {{ showCompleted ? '⌃' : '›' }}
    </el-button>
    <template v-if="showCompleted">
      <ListRow v-for="site in completed" :key="site.id" :to="linkTo(site.id)" :selected="site.id === selectedId">
        <template #title>{{ site.name }}</template>
        <StatusTag tone="neutral">Tamamlandı</StatusTag>
      </ListRow>
    </template>
  </template>
</template>

<style scoped>
.site-list__time--unread {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
}

.site-list__preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-list__more {
  width: 100%;
  justify-content: flex-start;
  margin: var(--space-2) 0;
  padding: var(--space-2) var(--space-4);
}
</style>
