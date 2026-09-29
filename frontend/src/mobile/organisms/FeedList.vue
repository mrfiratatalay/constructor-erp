<script setup lang="ts">
import { computed, ref } from 'vue'
import { showImagePreview } from 'vant'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useLongPress } from '@/core/gestures/useLongPress'
import { keepPosition } from '@/core/posts/feedAnchor'
import { firstUnreadPostId } from '@/core/posts/unreadDivider'
import { useFeedBottom } from '@/core/posts/useFeedBottom'
import { useJumpTarget } from '@/core/posts/useJumpTarget'
import { usePinnedPosts } from '@/core/posts/usePinnedPosts'
import { useSiteTimeline } from '@/core/posts/useSiteTimeline'
import { eventLine } from '@/core/sites/siteEvents'
import PostActionSheet from '@/mobile/organisms/PostActionSheet.vue'
import FeedDayTitle from '@/shared/molecules/FeedDayTitle.vue'
import FeedSystemLine from '@/shared/molecules/FeedSystemLine.vue'
import PinnedBanner from '@/shared/molecules/PinnedBanner.vue'
import PostBubble from '@/shared/organisms/PostBubble.vue'
import QueuedBubble from '@/shared/organisms/QueuedBubble.vue'

/**
 * Şantiyenin akışı, WhatsApp'taki sohbet gibi: üstte sabit mesaj şeridi, en eski üstte, en yenisi altta,
 * aralarda sistem satırları ("Patron, Musa'yı ekledi"), en dipte henüz gitmemiş mesajlar (🕓). Yukarı
 * kaydırınca geçmiş gelir ve ekran zıplamaz. seenAt: önceki bakış; sonrasına "buradan aşağısı yeni" çizgisi.
 * Mesaja uzun basınca menü açılır; Yanıtla, gönderme çubuğuna (sayfaya) iletilir.
 */
const { siteId, seenAt = null } = defineProps<{ siteId: string; seenAt?: string | null }>()
const emit = defineEmits<{ reply: [post: PostView] }>()
const { data: user } = useCurrentUser()
const timeline = useSiteTimeline(() => siteId)
const { days, pending, posts, bottom, isLoading, hasMore, isLoadingMore, loadMore } = timeline
const { jump } = useJumpTarget(timeline)
const { pinned } = usePinnedPosts(() => siteId)
const acting = ref<PostView | null>(null)
const longPress = useLongPress()

const dividerBefore = computed(() => firstUnreadPostId(posts.value, seenAt, user.value?.id))
// Mobilde kayan şey sayfanın kendisidir (null). Yeni gönderilen (🕓) mesaj da dibe indirir.
useFeedBottom(() => null, bottom)
const loadOlder = () => keepPosition(null, () => loadMore())

/** Silinen mesajın menüsü yoktur; ötekilerde uzun basma WhatsApp'taki menüyü açar. */
const pressHandlers = (post: PostView) => (post.deletion ? {} : longPress(() => (acting.value = post)))

function openPhotos(urls: string[], index: number) {
  showImagePreview({ images: urls, startPosition: index, closeable: true })
}
</script>

<template>
  <PinnedBanner v-if="pinned.length" :pinned="pinned" class="feed-list__pinned" @open="jump" />
  <van-skeleton v-if="isLoading" :row="6" avatar />
  <!-- direction="up": yeni gönderi aşağıda olduğu için "daha fazla" yukarıda istenir (WhatsApp gibi). -->
  <van-list v-else :loading="isLoadingMore" :finished="!hasMore" direction="up" finished-text=""
    loading-text="Daha eskiler geliyor…" @load="loadOlder">
    <section v-for="day in days" :key="day.key" class="feed-list__day">
      <FeedDayTitle :title="day.title" />
      <template v-for="item in day.items" :key="item.key">
        <FeedSystemLine v-if="item.kind === 'event'" :text="eventLine(item.event, user?.id)" />
        <template v-else>
          <van-divider v-if="item.post.id === dividerBefore" class="feed-list__new">Buradan aşağısı yeni</van-divider>
          <PostBubble :post="item.post" :mine="item.post.author.id === user?.id" v-bind="pressHandlers(item.post)"
            @open-photos="openPhotos" @open-quote="jump" />
        </template>
      </template>
    </section>
    <section v-if="pending.length" class="feed-list__day">
      <QueuedBubble v-for="post in pending" :key="post.id" :post="post" />
    </section>
  </van-list>
  <PostActionSheet v-model="acting" @reply="emit('reply', $event)" />
</template>

<style scoped>
/* Sabit mesaj şeridi, başlık çubuğunun (ve sekmelerin) hemen altında yapışık durur (WhatsApp gibi). */
.feed-list__pinned {
  position: sticky;
  top: var(--mobile-page-top);
  z-index: 3;
  margin: calc(-1 * var(--space-4)) calc(-1 * var(--space-4)) 0;
  width: auto;
}

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
  top: var(--mobile-page-top);
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
