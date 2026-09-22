<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import DeletedPostNote from '@/shared/molecules/DeletedPostNote.vue'
import IssueFooter from '@/shared/molecules/IssueFooter.vue'
import PostHeader from '@/shared/molecules/PostHeader.vue'
import PostMedia from '@/shared/molecules/PostMedia.vue'

/**
 * Ürüne özel kart; kütüphaneden bağımsızdır (iki kabukta birebir aynı görünür).
 * Kabuğa ait parçalar yuvadan gelir: "çözüldü" düğmesi (action) ve masaüstündeki ⋯ menüsü (menu).
 * Silinen gönderi yerinde yalnızca izini bırakır.
 */
const { post, showSite = true } = defineProps<{ post: PostView; showSite?: boolean }>()
const emit = defineEmits<{ openSite: [siteId: string]; openPhotos: [urls: string[], index: number] }>()
</script>

<template>
  <DeletedPostNote v-if="post.deletion" :deletion="post.deletion" :issue="post.issue" />
  <article v-else class="post-card" :class="{ 'post-card--open-issue': post.issue && !post.resolution }">
    <!-- Açık sorun kartın tepesinde: akışta kaydırırken gözden kaçmaz. -->
    <p v-if="post.issue && !post.resolution" class="post-card__flag">
      <TriangleAlert :size="15" />Açık sorun
    </p>
    <PostHeader :post="post" :show-site="showSite" @open-site="emit('openSite', $event)">
      <template v-if="$slots.menu" #menu><slot name="menu" /></template>
    </PostHeader>
    <p v-if="post.body" class="post-card__body">{{ post.body }}</p>
    <PostMedia :media="post.media" @open-photos="(urls, index) => emit('openPhotos', urls, index)" />
    <IssueFooter :post="post" />
    <slot v-if="post.issue && !post.resolution" name="action" />
  </article>
</template>

<style scoped>
.post-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.post-card--open-issue {
  border-color: color-mix(in srgb, var(--status-danger) 30%, var(--border-soft));
}

.post-card__flag {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: calc(var(--space-4) * -1) calc(var(--space-4) * -1) 0;
  padding: 9px var(--space-4);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--status-danger-bg);
  color: var(--status-danger);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.post-card__body {
  margin: 0;
  font-size: var(--text-base);
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
