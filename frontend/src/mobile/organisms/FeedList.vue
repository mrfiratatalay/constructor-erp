<script setup lang="ts">
import { computed, ref } from 'vue'
import { showImagePreview } from 'vant'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useLongPress } from '@/core/gestures/useLongPress'
import { keepPosition } from '@/core/posts/feedAnchor'
import { canCorrect, canDelete } from '@/core/posts/postPermissions'
import { firstUnreadPostId } from '@/core/posts/unreadDivider'
import { useFeed } from '@/core/posts/useFeed'
import { useFeedBottom } from '@/core/posts/useFeedBottom'
import PostActionSheet from '@/mobile/organisms/PostActionSheet.vue'
import FeedDayTitle from '@/shared/molecules/FeedDayTitle.vue'
import PostBubble from '@/shared/organisms/PostBubble.vue'

/**
 * Şantiyenin akışı, sohbet gibi: en eski üstte, en yenisi altta, sayfa açılınca dip. Yukarı kaydırınca
 * geçmiş gelir ve ekran zıplamaz. seenAt: kişinin önceki bakışı; ondan sonra gelenlerin üstüne
 * "buradan aşağısı yeni" çizgisi çekilir. Gönderiye uzun basınca Düzelt / Sil menüsü açılır.
 *
 * start yuvası akışın en başına girer (şantiye kuruldu satırları) ve yalnızca bütün geçmiş yüklendiğinde
 * görünür; boşsa (empty) sayfa oraya kendi boş durumunu koyar.
 */
const { siteId, seenAt = null } = defineProps<{ siteId: string; seenAt?: string | null }>()
const { data: user } = useCurrentUser()
const { days, isLoading, hasMore, isLoadingMore, loadMore } = useFeed(() => siteId)
const acting = ref<PostView | null>(null)
const longPress = useLongPress()

const posts = computed(() => days.value.flatMap((day) => day.posts))
const dividerBefore = computed(() => firstUnreadPostId(posts.value, seenAt, user.value?.id))
// Mobilde kayan şey sayfanın kendisidir: kaydırıcı yok (null).
useFeedBottom(() => null, () => posts.value.at(-1)?.id)
const loadOlder = () => keepPosition(null, () => loadMore())

/** Uzun basma yalnızca üzerinde işlem yapılabilen gönderiye bağlanır; ötekilerde telefonun kendi menüsü kalır. */
function pressHandlers(post: PostView) {
  const actionable = canCorrect(post, user.value) || canDelete(post, user.value)
  return actionable ? longPress(() => (acting.value = post)) : {}
}

function openPhotos(urls: string[], index: number) {
  showImagePreview({ images: urls, startPosition: index, closeable: true })
}
</script>

<template>
  <van-skeleton v-if="isLoading" :row="6" avatar />
  <!-- direction="up": yeni gönderi aşağıda olduğu için "daha fazla" yukarıda istenir (WhatsApp gibi). -->
  <van-list v-else :loading="isLoadingMore" :finished="!hasMore" direction="up" finished-text=""
    loading-text="Daha eskiler geliyor…" @load="loadOlder">
    <slot v-if="!hasMore" name="start" :empty="!posts.length" />
    <section v-for="day in days" :key="day.key" class="feed-list__day">
      <FeedDayTitle :title="day.title" />
      <template v-for="post in day.posts" :key="post.id">
        <van-divider v-if="post.id === dividerBefore" class="feed-list__new">Buradan aşağısı yeni</van-divider>
        <PostBubble :post="post" :mine="post.author.id === user?.id" v-bind="pressHandlers(post)"
          @open-photos="openPhotos" />
      </template>
    </section>
  </van-list>
  <PostActionSheet v-model="acting" />
</template>

<style scoped>
.feed-list__day {
  display: grid;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

/* Uzun basarken yazı seçilip büyüteç çıkmasın: basılı tutmanın anlamı menüdür (WhatsApp gibi). */
.feed-list__day :deep(.bubble) {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* Gün başlığı sayfanın üstüne değil, sabit başlık çubuğunun altına yapışır; yoksa onun arkasında kalır. */
.feed-list__day :deep(.feed-day) {
  top: calc(var(--van-nav-bar-height) + env(safe-area-inset-top, 0px));
  z-index: 1;
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
