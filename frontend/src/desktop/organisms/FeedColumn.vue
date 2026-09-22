<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { canCorrect, canDelete } from '@/core/posts/postPermissions'
import { lastUnreadPostId } from '@/core/posts/unreadDivider'
import { useFeed } from '@/core/posts/useFeed'
import { useDeletePrompt } from '@/desktop/deletePrompt'
import PostMenu from '@/desktop/molecules/PostMenu.vue'
import PostCorrectDialog from '@/desktop/organisms/PostCorrectDialog.vue'
import { useResolvePrompt } from '@/desktop/resolvePrompt'
import FeedDayTitle from '@/shared/molecules/FeedDayTitle.vue'
import PostCard from '@/shared/organisms/PostCard.vue'

/**
 * Tek şantiyenin defteri, en yeniden eskiye. seenAt: kişinin önceki bakışı; ondan sonra gelenlerin
 * altına "buradan yukarısı yeni" çizgisi çekilir. Kartın köşesindeki ⋯ menüsünden düzeltilir ya da silinir.
 */
const { siteId, seenAt = null } = defineProps<{ siteId: string; seenAt?: string | null }>()
const { data: user } = useCurrentUser()
const { days, isLoading, hasMore, isLoadingMore, loadMore } = useFeed(() => siteId)
const viewer = ref<{ urls: string[]; index: number } | null>(null)
const correcting = ref<PostView | null>(null)
const promptResolve = useResolvePrompt()
const promptDelete = useDeletePrompt()
const dividerAfter = computed(() =>
  lastUnreadPostId(days.value.flatMap((day) => day.posts), seenAt, user.value?.id),
)
</script>

<template>
  <div class="feed-column">
    <el-skeleton v-if="isLoading" :rows="6" animated />
    <el-empty v-else-if="!days.length" description="Henüz gönderi yok. İlk gönderiyi yukarıdan ekleyebilirsin." />
    <section v-for="day in days" :key="day.key" class="feed-column__day">
      <FeedDayTitle :title="day.title" :count="day.count" />
      <template v-for="post in day.posts" :key="post.id">
        <PostCard :post="post" :show-site="false" @open-photos="(urls, index) => (viewer = { urls, index })">
          <template #menu>
            <PostMenu :can-correct="canCorrect(post, user)" :can-delete="canDelete(post, user)"
              @correct="correcting = post" @delete="promptDelete(post)" />
          </template>
          <template #action>
            <el-button type="success" plain @click="promptResolve(post)">Çözüldü olarak işaretle</el-button>
          </template>
        </PostCard>
        <el-divider v-if="post.id === dividerAfter" class="feed-column__new">Buradan yukarısı yeni</el-divider>
      </template>
    </section>
    <el-button v-if="hasMore" class="feed-column__more" :loading="isLoadingMore" @click="loadMore">
      Daha eski gönderiler
    </el-button>
    <el-image-viewer v-if="viewer" :url-list="viewer.urls" :initial-index="viewer.index" teleported
      @close="viewer = null" />
    <PostCorrectDialog v-model="correcting" />
  </div>
</template>

<style scoped>
.feed-column {
  display: grid;
  gap: var(--space-4);
}

.feed-column__day {
  display: grid;
  gap: var(--space-3);
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
