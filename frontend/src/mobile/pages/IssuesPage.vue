<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showImagePreview } from 'vant'
import { CircleCheck } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { lastResolvedText, NO_OPEN_ISSUES, resolvedLinkText } from '@/core/issues/resolvedSummary'
import { useIssues } from '@/core/issues/useIssues'
import IssueCard from '@/mobile/organisms/IssueCard.vue'
import ResolveIssueSheet from '@/mobile/organisms/ResolveIssueSheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/** Bir iş listesi: sekme ve süzgeç yok, en uzun bekleyen en üstte. Çözülenler en altta tek bir bağlantı. */
const router = useRouter()
const { data: user } = useCurrentUser()
const { issues, isLoading } = useIssues(true, undefined)
const { issues: resolved } = useIssues(false, undefined)
const resolving = ref<PostView | null>(null)
</script>

<template>
  <MobilePage title="Sorunlar">
    <van-skeleton v-if="isLoading" :row="5" />
    <van-empty v-else-if="!issues?.length" :description="NO_OPEN_ISSUES">
      <template #image><CircleCheck :size="48" class="issues__empty-icon" /></template>
      <p v-if="lastResolvedText(resolved)" class="issues__empty-detail">{{ lastResolvedText(resolved) }}</p>
    </van-empty>
    <IssueCard v-for="post in issues" v-else :key="post.id" :post="post" :viewer-id="user?.id"
      @resolve="resolving = $event" @open-site="router.push({ name: 'siteFeed', params: { siteId: $event } })"
      @open-photos="(urls, index) => showImagePreview({ images: urls, startPosition: index, closeable: true })" />
    <van-cell-group v-if="resolved?.length" inset>
      <van-cell :title="resolvedLinkText(resolved)" is-link :to="{ name: 'resolvedIssues' }" />
    </van-cell-group>
    <ResolveIssueSheet v-model="resolving" />
  </MobilePage>
</template>

<style scoped>
.issues__empty-icon {
  color: var(--status-success);
}

.issues__empty-detail {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-align: center;
}
</style>
