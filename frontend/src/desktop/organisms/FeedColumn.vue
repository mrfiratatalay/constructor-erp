<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { keepPosition, type Scroller } from '@/core/posts/feedAnchor'
import { postMenu } from '@/core/posts/postMenu'
import { firstUnreadPostId } from '@/core/posts/unreadDivider'
import { useFeedBottom } from '@/core/posts/useFeedBottom'
import { useJumpTarget } from '@/core/posts/useJumpTarget'
import { usePinnedPosts } from '@/core/posts/usePinnedPosts'
import { useSiteTimeline } from '@/core/posts/useSiteTimeline'
import { eventLine } from '@/core/sites/siteEvents'
import PostMenu from '@/desktop/molecules/PostMenu.vue'
import ForwardDialog from '@/desktop/organisms/ForwardDialog.vue'
import PostCorrectDialog from '@/desktop/organisms/PostCorrectDialog.vue'
import PostInfoDialog from '@/desktop/organisms/PostInfoDialog.vue'
import { usePostMenuActions } from '@/desktop/postActions'
import FeedDayTitle from '@/shared/molecules/FeedDayTitle.vue'
import FeedSystemLine from '@/shared/molecules/FeedSystemLine.vue'
import PinnedBanner from '@/shared/molecules/PinnedBanner.vue'
import PostBubble from '@/shared/organisms/PostBubble.vue'
import QueuedBubble from '@/shared/organisms/QueuedBubble.vue'

/**
 * Şantiyenin akışı, WhatsApp Masaüstü gibi: üstte sabit mesaj şeridi, en eski üstte, en yenisi altta,
 * aralarda sistem satırları, en dipte henüz gitmemiş mesajlar (🕓). "Daha eski mesajlar" yukarıdadır ve
 * basınca ekran zıplamaz. Mesajın köşesindeki ⋯ menüsünden Yanıtla, İlet, Sabitle, Bilgi, Düzelt, Sil.
 * Yoklama mesajının baloncuğunda kartı durur ("Yoklamaya Katıl").
 */
const { siteId, seenAt = null } = defineProps<{ siteId: string; seenAt?: string | null }>()
const emit = defineEmits<{ reply: [post: PostView] }>()
const { data: user } = useCurrentUser()
const timeline = useSiteTimeline(() => siteId)
const { days, pending, posts, isLoading, hasMore, isLoadingMore, loadMore } = timeline
const { jump } = useJumpTarget(timeline)
const { pinned } = usePinnedPosts(() => siteId)
const { correcting, forwarding, inspecting, run } = usePostMenuActions((post) => emit('reply', post))
const viewer = ref<{ urls: string[]; index: number } | null>(null)
const root = useTemplateRef<HTMLElement>('root')

const dividerBefore = computed(() => firstUnreadPostId(posts.value, seenAt, user.value?.id))
/** Kayan öğe sağ panelin gövdesidir (el-scrollbar'ın sarmalayıcısı); akış onun içinde yaşar. */
const scroller = (): Scroller => root.value?.closest<HTMLElement>('.el-scrollbar__wrap') ?? null
useFeedBottom(scroller, () => pending.value.at(-1)?.id ?? posts.value.at(-1)?.id)
const loadOlder = () => keepPosition(scroller(), () => loadMore())
</script>

<template>
  <div ref="root" class="feed-column">
    <PinnedBanner v-if="pinned.length" :pinned="pinned" class="feed-column__pinned" @open="jump" />
    <el-skeleton v-if="isLoading" :rows="6" animated />
    <el-button v-if="hasMore" class="feed-column__more" :loading="isLoadingMore" @click="loadOlder">
      Daha eski mesajlar
    </el-button>
    <section v-for="day in days" :key="day.key" class="feed-column__day">
      <FeedDayTitle :title="day.title" />
      <template v-for="item in day.items" :key="item.key">
        <FeedSystemLine v-if="item.kind === 'event'" :text="eventLine(item.event, user?.id)" />
        <template v-else>
          <el-divider v-if="item.post.id === dividerBefore" class="feed-column__new">Buradan aşağısı yeni</el-divider>
          <PostBubble :post="item.post" :mine="item.post.author.id === user?.id"
            @open-photos="(urls, index) => (viewer = { urls, index })" @open-quote="jump">
            <template v-if="!item.post.deletion" #menu>
              <PostMenu :items="postMenu(item.post, user)" @select="(action) => run(action, item.post)" />
            </template>
          </PostBubble>
        </template>
      </template>
    </section>
    <section v-if="pending.length" class="feed-column__day">
      <QueuedBubble v-for="post in pending" :key="post.id" :post="post" />
    </section>
    <el-image-viewer v-if="viewer" :url-list="viewer.urls" :initial-index="viewer.index" teleported
      @close="viewer = null" />
    <PostCorrectDialog v-model="correcting" />
    <ForwardDialog v-model="forwarding" />
    <PostInfoDialog v-model="inspecting" />
  </div>
</template>

<style scoped>
.feed-column {
  display: grid;
  align-content: end;
  gap: var(--space-3);
}

/* Sabit mesaj şeridi, akış kayarken panelin üstünde yapışık durur. */
.feed-column__pinned {
  position: sticky;
  top: 0;
  z-index: 3;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.feed-column__day {
  display: grid;
  gap: var(--space-2);
}

.feed-column__more {
  justify-self: center;
}

/* Okunmamış bilgi lacivert: ana ekrandaki rozetle aynı dil. */
.feed-column__new {
  --el-border-color: var(--brand-primary);
  --el-text-color-primary: var(--brand-primary);
  margin: var(--space-2) 0;
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}

.feed-column__new :deep(.el-divider__text) {
  background: var(--canvas);
}
</style>
