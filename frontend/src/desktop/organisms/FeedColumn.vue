<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFeed } from '@/core/posts/useFeed'
import { useResolvePrompt } from '@/desktop/resolvePrompt'
import FeedDayTitle from '@/shared/molecules/FeedDayTitle.vue'
import PostCard from '@/shared/organisms/PostCard.vue'

const { siteId, showSite = true } = defineProps<{ siteId?: string; showSite?: boolean }>()
const router = useRouter()
const { days, isLoading, hasMore, isLoadingMore, loadMore } = useFeed(() => siteId)
const viewer = ref<{ urls: string[]; index: number } | null>(null)
const promptResolve = useResolvePrompt()
</script>

<template>
  <div class="feed-column">
    <el-skeleton v-if="isLoading" :rows="6" animated />
    <el-empty v-else-if="!days.length" description="Henüz gönderi yok. Sağ üstten ilk gönderiyi ekleyebilirsin." />
    <section v-for="day in days" :key="day.key" class="feed-column__day">
      <FeedDayTitle :title="day.title" :count="day.posts.length" />
      <PostCard v-for="post in day.posts" :key="post.id" :post="post" :show-site="showSite"
        @open-site="router.push({ name: 'siteFeed', params: { siteId: $event } })"
        @open-photos="(urls, index) => (viewer = { urls, index })">
        <template #action>
          <el-button type="success" plain @click="promptResolve(post)">Çözüldü olarak işaretle</el-button>
        </template>
      </PostCard>
    </section>
    <el-button v-if="hasMore" class="feed-column__more" :loading="isLoadingMore" @click="loadMore">
      Daha eski gönderiler
    </el-button>
    <el-image-viewer v-if="viewer" :url-list="viewer.urls" :initial-index="viewer.index" teleported
      @close="viewer = null" />
  </div>
</template>

<style scoped>
.feed-column {
  display: grid;
  gap: var(--space-4);
  max-width: 680px;
}

.feed-column__day {
  display: grid;
  gap: var(--space-3);
}

.feed-column__more {
  justify-self: center;
}
</style>
