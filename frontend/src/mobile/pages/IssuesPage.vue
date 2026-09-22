<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showImagePreview } from 'vant'
import { CircleCheck } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { useIssues } from '@/core/issues/useIssues'
import { useSites } from '@/core/sites/useSites'
import SiteFilter from '@/mobile/molecules/SiteFilter.vue'
import ResolveIssueSheet from '@/mobile/organisms/ResolveIssueSheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import PostCard from '@/shared/organisms/PostCard.vue'

const router = useRouter()
const { sites } = useSites()
const tab = ref(0)
const siteId = ref<string | undefined>()
const { issues, isLoading } = useIssues(() => tab.value === 0, siteId)
const resolving = ref<PostView | null>(null)

const emptyText = computed(() =>
  tab.value === 0 ? 'Açık sorun yok. Şu an bekleyen bir iş görünmüyor.' : 'Henüz çözülen sorun yok.',
)
</script>

<template>
  <MobilePage title="Sorunlar">
    <!-- Sekme ve süzgeç tek bir başlık kartı: aralarındaki boşluk kopukluk gibi duruyordu. -->
    <div class="issues__filters">
      <van-tabs v-model:active="tab" shrink>
        <van-tab title="Açık" />
        <van-tab title="Çözülen" />
      </van-tabs>
      <SiteFilter v-if="(sites?.length ?? 0) > 1" v-model="siteId" :sites="sites ?? []" />
    </div>
    <van-skeleton v-if="isLoading" :row="5" avatar />
    <van-empty v-else-if="!issues?.length" :description="emptyText">
      <template #image><CircleCheck :size="48" class="issues__empty-icon" /></template>
    </van-empty>
    <PostCard v-for="post in issues" v-else :key="post.id" :post="post" :show-site="!siteId"
      @open-site="router.push({ name: 'siteFeed', params: { siteId: $event } })"
      @open-photos="(urls, index) => showImagePreview({ images: urls, startPosition: index, closeable: true })">
      <template #action>
        <van-button type="success" size="small" round block plain @click="resolving = post">
          Çözüldü olarak işaretle
        </van-button>
      </template>
    </PostCard>
    <ResolveIssueSheet v-model="resolving" />
  </MobilePage>
</template>

<style scoped>
.issues__filters {
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--surface);
}

.issues__empty-icon {
  color: var(--status-success);
}
</style>
