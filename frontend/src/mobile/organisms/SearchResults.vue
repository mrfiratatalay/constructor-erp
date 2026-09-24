<script setup lang="ts">
import type { PostView, SiteToday } from '@/core/api/generated/model'
import { listMoment } from '@/core/format/dates'
import { postSummary } from '@/core/posts/postPreview'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'

/**
 * Arama sonuçları, WhatsApp'taki gibi iki bölüm: adı uyan şantiyeler ve yazısında aranan geçen mesajlar.
 * Mesaja dokununca şantiye o mesajın olduğu yerde açılır.
 */
const { sites, posts, searching, showSiteName = true } = defineProps<{
  sites: SiteToday[]
  posts: PostView[]
  searching: boolean
  showSiteName?: boolean
}>()
const emit = defineEmits<{ openSite: [siteId: string]; openPost: [post: PostView] }>()
</script>

<template>
  <van-cell-group v-if="sites.length" inset title="Şantiyeler">
    <van-cell v-for="site in sites" :key="site.siteId" :title="site.name" clickable center
      @click="emit('openSite', site.siteId)">
      <template #icon><SiteAvatar :photo-url="site.photoThumbnailUrl" :size="40" class="search__avatar" /></template>
    </van-cell>
  </van-cell-group>
  <van-cell-group v-if="posts.length" inset title="Mesajlar">
    <van-cell v-for="post in posts" :key="post.id" clickable :label="postSummary(post)"
      :value="listMoment(post.createdAt)" @click="emit('openPost', post)">
      <template #title>
        <span class="search__who">{{ showSiteName ? `${post.site.name} · ` : '' }}{{ post.author.fullName }}</span>
      </template>
    </van-cell>
  </van-cell-group>
  <van-loading v-if="searching" size="20" class="search__loading">Aranıyor…</van-loading>
  <van-empty v-else-if="!sites.length && !posts.length" description="Sonuç yok" />
</template>

<style scoped>
.search__avatar {
  margin-right: var(--space-3);
}

.search__who {
  font-weight: var(--weight-semibold);
}

.search__loading {
  justify-self: center;
}
</style>
