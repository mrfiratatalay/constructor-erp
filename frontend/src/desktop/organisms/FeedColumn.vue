<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { keepPosition, type Scroller } from '@/core/posts/feedAnchor'
import { canCorrect, canDelete } from '@/core/posts/postPermissions'
import { firstUnreadPostId } from '@/core/posts/unreadDivider'
import { useFeed } from '@/core/posts/useFeed'
import { useFeedBottom } from '@/core/posts/useFeedBottom'
import { useDeletePrompt } from '@/desktop/deletePrompt'
import PostMenu from '@/desktop/molecules/PostMenu.vue'
import PostCorrectDialog from '@/desktop/organisms/PostCorrectDialog.vue'
import FeedDayTitle from '@/shared/molecules/FeedDayTitle.vue'
import PostBubble from '@/shared/organisms/PostBubble.vue'

/**
 * Şantiyenin akışı, sohbet gibi: en eski üstte, en yenisi altta, panel açılınca dip. "Daha eski
 * gönderiler" yukarıdadır ve basınca ekran zıplamaz. seenAt: kişinin önceki bakışı; ondan sonra
 * gelenlerin üstüne "buradan aşağısı yeni" çizgisi çekilir. Kartın köşesindeki ⋯ menüsünden düzeltilir.
 */
const { siteId, seenAt = null } = defineProps<{ siteId: string; seenAt?: string | null }>()
const { data: user } = useCurrentUser()
const { days, isLoading, hasMore, isLoadingMore, loadMore } = useFeed(() => siteId)
const viewer = ref<{ urls: string[]; index: number } | null>(null)
const correcting = ref<PostView | null>(null)
const promptDelete = useDeletePrompt()
const root = useTemplateRef<HTMLElement>('root')

const posts = computed(() => days.value.flatMap((day) => day.posts))
const dividerBefore = computed(() => firstUnreadPostId(posts.value, seenAt, user.value?.id))
/** Kayan öğe sağ panelin gövdesidir (el-scrollbar'ın sarmalayıcısı); akış onun içinde yaşar. */
const scroller = (): Scroller => root.value?.closest<HTMLElement>('.el-scrollbar__wrap') ?? null
useFeedBottom(scroller, () => posts.value.at(-1)?.id)
const loadOlder = () => keepPosition(scroller(), () => loadMore())
</script>

<template>
  <div ref="root" class="feed-column">
    <el-skeleton v-if="isLoading" :rows="6" animated />
    <el-button v-if="hasMore" class="feed-column__more" :loading="isLoadingMore" @click="loadOlder">
      Daha eski gönderiler
    </el-button>
    <slot v-if="!hasMore" name="start" :empty="!posts.length" />
    <section v-for="day in days" :key="day.key" class="feed-column__day">
      <FeedDayTitle :title="day.title" />
      <template v-for="post in day.posts" :key="post.id">
        <el-divider v-if="post.id === dividerBefore" class="feed-column__new">Buradan aşağısı yeni</el-divider>
        <PostBubble :post="post" :mine="post.author.id === user?.id"
          @open-photos="(urls, index) => (viewer = { urls, index })">
          <template v-if="canCorrect(post, user) || canDelete(post, user)" #menu>
            <PostMenu :can-correct="canCorrect(post, user)" :can-delete="canDelete(post, user)"
              @correct="correcting = post" @delete="promptDelete(post)" />
          </template>
        </PostBubble>
      </template>
    </section>
    <el-image-viewer v-if="viewer" :url-list="viewer.urls" :initial-index="viewer.index" teleported
      @close="viewer = null" />
    <PostCorrectDialog v-model="correcting" />
  </div>
</template>

<style scoped>
.feed-column {
  display: grid;
  align-content: end;
  gap: var(--space-3);
}

.feed-column__day {
  display: grid;
  gap: var(--space-2);
}

/* Geniş ekranda tek fotoğraf ~480px'e çıkıyordu; tavan koyuyoruz, fazlası kırpılır (tıklayınca tamamı açılır). */
.feed-column :deep(.photo-grid__item--wide) {
  max-height: 360px;
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
