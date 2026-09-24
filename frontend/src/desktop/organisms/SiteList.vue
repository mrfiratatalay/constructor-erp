<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDown, Pin } from 'lucide-vue-next'
import type { SiteToday, SiteView } from '@/core/api/generated/model'
import { listMoment } from '@/core/format/dates'
import { activityAt, sitePreview } from '@/core/today/siteRow'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'
import ChatPreviewLine from '@/shared/molecules/ChatPreviewLine.vue'

/**
 * Şantiye listesi, WhatsApp Masaüstü'nün sohbet listesi gibi: fotoğraf, ad, zaman; altında tikli önizleme,
 * 📌 ve okunmadı rozeti. Satırın üstüne gelince ⌄ belirir: Sabitle. Tamamlananlar listenin sonunda.
 */
const { sites, selectedId, completed, viewerId } = defineProps<{
  sites: SiteToday[]
  selectedId: string | null
  completed: SiteView[]
  viewerId?: string
}>()
const emit = defineEmits<{ pin: [site: SiteToday] }>()
const showCompleted = ref(false)

const rows = computed(() => sites.map((site) => ({ site, preview: sitePreview(site, viewerId), moment: activityAt(site) })))
const linkTo = (siteId: string) => ({ name: 'siteFeed', params: { siteId } })
</script>

<template>
  <ListRow v-for="{ site, preview, moment } in rows" :key="site.siteId" :to="linkTo(site.siteId)"
    :selected="site.siteId === selectedId" class="site-list__row">
    <template #leading><SiteAvatar :photo-url="site.photoThumbnailUrl" :size="48" /></template>
    <template #title>{{ site.name }}</template>
    <template #meta>
      <time v-if="moment" :class="{ 'site-list__time--unread': site.unreadPosts }">{{ listMoment(moment) }}</time>
    </template>
    <ChatPreviewLine v-if="preview" :preview="preview" class="site-list__preview" />
    <Pin v-if="site.pinnedAt" :size="15" class="site-list__pin" aria-label="Sabitlendi" />
    <!-- Okunmamış bilgi alarm değildir: rozet marka lacivertidir, kırmızı değil. -->
    <el-badge v-if="site.unreadPosts" :value="site.unreadPosts" :max="99" type="primary" />
    <el-dropdown trigger="click" placement="bottom-end" @command="emit('pin', site)">
      <button type="button" class="site-list__chevron" aria-label="Şantiye menüsü" @click.prevent.stop>
        <ChevronDown :size="18" />
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>{{ site.pinnedAt ? 'Sabitlemeyi kaldır' : '📌 Sabitle' }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </ListRow>
  <template v-if="completed.length">
    <el-button text class="site-list__more" @click="showCompleted = !showCompleted">
      Tamamlanan {{ completed.length }} şantiye {{ showCompleted ? '⌃' : '›' }}
    </el-button>
    <template v-if="showCompleted">
      <ListRow v-for="site in completed" :key="site.id" :to="linkTo(site.id)" :selected="site.id === selectedId">
        <template #leading><SiteAvatar :photo-url="site.photoThumbnailUrl" :size="48" /></template>
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
  flex: 1;
}

.site-list__pin {
  flex: none;
  color: var(--text-subtle);
}

/* ⌄ yalnızca satırın üstüne gelince belirir (WhatsApp Masaüstü gibi); liste sakin kalır. */
.site-list__chevron {
  display: grid;
  place-items: center;
  width: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: transparent;
  color: var(--text-subtle);
  cursor: pointer;
}

.site-list__row:hover .site-list__chevron,
.site-list__chevron:focus-visible {
  width: 22px;
}

.site-list__more {
  width: 100%;
  justify-content: flex-start;
  margin: var(--space-2) 0;
  padding: var(--space-2) var(--space-4);
}
</style>
