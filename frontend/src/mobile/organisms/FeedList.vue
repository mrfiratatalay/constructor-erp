<script setup lang="ts">
import { computed, ref } from 'vue'
import { showImagePreview } from 'vant'
import { Camera } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useLongPress } from '@/core/gestures/useLongPress'
import { canCorrect, canDelete } from '@/core/posts/postPermissions'
import { lastUnreadPostId } from '@/core/posts/unreadDivider'
import { useFeed } from '@/core/posts/useFeed'
import PostActionSheet from '@/mobile/organisms/PostActionSheet.vue'
import ResolveIssueSheet from '@/mobile/organisms/ResolveIssueSheet.vue'
import FeedDayTitle from '@/shared/molecules/FeedDayTitle.vue'
import PostCard from '@/shared/organisms/PostCard.vue'

/**
 * Tek şantiyenin defteri, en yeniden eskiye. seenAt: kişinin önceki bakışı; ondan sonra gelenlerin
 * altına "buradan yukarısı yeni" çizgisi çekilir. Gönderiye uzun basınca Düzelt / Sil menüsü açılır.
 */
const { siteId, seenAt = null } = defineProps<{ siteId: string; seenAt?: string | null }>()
const { data: user } = useCurrentUser()
const { days, isLoading, hasMore, isLoadingMore, loadMore, refresh } = useFeed(() => siteId)
const refreshing = ref(false)
const resolving = ref<PostView | null>(null)
const acting = ref<PostView | null>(null)
const longPress = useLongPress()
const dividerAfter = computed(() =>
  lastUnreadPostId(days.value.flatMap((day) => day.posts), seenAt, user.value?.id),
)

/** Uzun basma yalnızca üzerinde işlem yapılabilen gönderiye bağlanır; ötekilerde telefonun kendi menüsü kalır. */
function pressHandlers(post: PostView) {
  const actionable = canCorrect(post, user.value) || canDelete(post, user.value)
  return actionable ? longPress(() => (acting.value = post)) : {}
}

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
    <van-empty v-else-if="!days.length" description="Henüz gönderi yok. İlk fotoğrafı aşağıdaki çubuktan gönder.">
      <template #image><Camera :size="48" class="feed-list__empty-icon" /></template>
    </van-empty>
    <van-list v-else :loading="isLoadingMore" :finished="!hasMore" finished-text="Hepsi bu kadar"
      loading-text="Daha eskiler geliyor…" @load="loadMore">
      <section v-for="day in days" :key="day.key" class="feed-list__day">
        <FeedDayTitle :title="day.title" :count="day.count" />
        <template v-for="post in day.posts" :key="post.id">
          <PostCard :post="post" :show-site="false" class="feed-list__post" v-bind="pressHandlers(post)"
            @open-photos="openPhotos">
            <template #action>
              <van-button type="success" size="small" round block plain @click="resolving = post">
                Çözüldü olarak işaretle
              </van-button>
            </template>
          </PostCard>
          <van-divider v-if="post.id === dividerAfter" class="feed-list__new">Buradan yukarısı yeni</van-divider>
        </template>
      </section>
    </van-list>
  </van-pull-refresh>
  <ResolveIssueSheet v-model="resolving" />
  <PostActionSheet v-model="acting" />
</template>

<style scoped>
/* Uzun basarken yazı seçilip büyüteç çıkmasın: basılı tutmanın anlamı menüdür (WhatsApp gibi). */
.feed-list__post {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.feed-list__day {
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.feed-list__empty-icon {
  color: var(--text-subtle);
}

/* Okunmamış bilgi lacivert: ana ekrandaki rozetle aynı dil. */
.feed-list__new {
  --van-divider-text-color: var(--brand-primary);
  --van-divider-border-color: var(--brand-primary);
  margin: var(--space-1) 0;
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}
</style>
