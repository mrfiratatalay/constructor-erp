<script setup lang="ts">
import type { PostView, SiteToday } from '@/core/api/generated/model'
import { listMoment } from '@/core/format/dates'
import { postSummary } from '@/core/posts/postPreview'
import ListRow from '@/desktop/molecules/ListRow.vue'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'

/**
 * Arama sonuçları (WhatsApp Masaüstü gibi): adı uyan şantiyeler ve yazısında aranan geçen mesajlar.
 * Mesaja tıklayınca şantiye o mesajın olduğu yerde açılır.
 */
const { sites, posts, searching, showSiteName = true } = defineProps<{
  sites: SiteToday[]
  posts: PostView[]
  searching: boolean
  showSiteName?: boolean
}>()
const emit = defineEmits<{ openPost: [post: PostView] }>()
const linkTo = (siteId: string) => ({ name: 'siteFeed', params: { siteId } })
</script>

<template>
  <h3 v-if="sites.length" class="results__heading">Şantiyeler</h3>
  <ListRow v-for="site in sites" :key="site.siteId" :to="linkTo(site.siteId)">
    <template #leading><SiteAvatar :photo-url="site.photoThumbnailUrl" :size="40" /></template>
    <template #title>{{ site.name }}</template>
  </ListRow>
  <h3 v-if="posts.length" class="results__heading">Mesajlar</h3>
  <ListRow v-for="post in posts" :key="post.id" @select="emit('openPost', post)">
    <template #title>{{ showSiteName ? `${post.site.name} · ` : '' }}{{ post.author.fullName }}</template>
    <template #meta>{{ listMoment(post.createdAt) }}</template>
    <span class="results__text">{{ postSummary(post) }}</span>
  </ListRow>
  <p v-if="searching" class="results__note">Aranıyor…</p>
  <p v-else-if="!sites.length && !posts.length" class="results__note">Sonuç yok</p>
</template>

<style scoped>
.results__heading {
  margin: 0;
  padding: var(--space-3) var(--space-4) var(--space-1);
  color: var(--brand-primary);
  font-size: var(--text-xs);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.results__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.results__note {
  margin: 0;
  padding: var(--space-5);
  color: var(--text-muted);
  text-align: center;
}
</style>
