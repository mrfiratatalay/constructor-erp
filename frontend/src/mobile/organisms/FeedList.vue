<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showImagePreview } from 'vant'
import { Camera } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { useFeed } from '@/core/posts/useFeed'
import ResolveIssueSheet from '@/mobile/organisms/ResolveIssueSheet.vue'
import FeedDayTitle from '@/shared/molecules/FeedDayTitle.vue'
import PostCard from '@/shared/organisms/PostCard.vue'

/** siteId boşsa bütün şantiyeler. showSite: tek şantiyenin akışında şantiye adı tekrar yazılmaz. */
const { siteId, showSite = true } = defineProps<{ siteId?: string; showSite?: boolean }>()
const router = useRouter()
const { days, isLoading, hasMore, isLoadingMore, loadMore, refresh } = useFeed(() => siteId)
const refreshing = ref(false)
const resolving = ref<PostView | null>(null)

async function pullToRefresh() {
  await refresh()
  refreshing.value = false
}

function openPhotos(urls: string[], index: number) {
  showImagePreview({ images: urls, startPosition: index, closeable: true })
}
</script>

<template>
  <van-pull-refresh v-model="refreshing" pulling-text="Yenilemek için çek" loosing-text="Bırak, yenilensin"
    loading-text="Yenileniyor…" @refresh="pullToRefresh">
    <van-skeleton v-if="isLoading" :row="6" avatar />
    <van-empty v-else-if="!days.length" :image="undefined" description="Henüz gönderi yok. İlk fotoğrafı + düğmesinden gönder.">
      <template #image><Camera :size="48" class="feed-list__empty-icon" /></template>
    </van-empty>
    <van-list v-else :loading="isLoadingMore" :finished="!hasMore" finished-text="Hepsi bu kadar"
      loading-text="Daha eskiler geliyor…" @load="loadMore">
      <section v-for="day in days" :key="day.key" class="feed-list__day">
        <FeedDayTitle :title="day.title" :count="day.posts.length" />
        <PostCard v-for="post in day.posts" :key="post.id" :post="post" :show-site="showSite"
          @open-site="router.push({ name: 'siteFeed', params: { siteId: $event } })" @open-photos="openPhotos">
          <template #action>
            <van-button type="success" size="small" round block plain @click="resolving = post">
              Çözüldü olarak işaretle
            </van-button>
          </template>
        </PostCard>
      </section>
    </van-list>
  </van-pull-refresh>
  <ResolveIssueSheet v-model="resolving" />
</template>

<style scoped>
.feed-list__day {
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.feed-list__empty-icon {
  color: var(--text-subtle);
}
</style>
