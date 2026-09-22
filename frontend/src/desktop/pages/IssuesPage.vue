<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useIssues } from '@/core/issues/useIssues'
import { useSites } from '@/core/sites/useSites'
import SiteFilter from '@/desktop/molecules/SiteFilter.vue'
import { useResolvePrompt } from '@/desktop/resolvePrompt'
import DesktopPage from '@/desktop/templates/DesktopPage.vue'
import PostCard from '@/shared/organisms/PostCard.vue'

const router = useRouter()
const { sites } = useSites()
const tab = ref('Açık')
const siteId = ref<string | undefined>()
const { issues, isLoading } = useIssues(() => tab.value === 'Açık', siteId)
const promptResolve = useResolvePrompt()
const viewer = ref<{ urls: string[]; index: number } | null>(null)

const emptyText = computed(() =>
  tab.value === 'Açık' ? 'Açık sorun yok. Şu an bekleyen bir iş görünmüyor.' : 'Henüz çözülen sorun yok.',
)
</script>

<template>
  <DesktopPage title="Sorunlar" subtitle="Açık sorunlar çözülene kadar burada kalır.">
    <template #actions>
      <el-segmented v-model="tab" :options="['Açık', 'Çözülen']" />
      <SiteFilter v-if="(sites?.length ?? 0) > 1" v-model="siteId" :sites="sites ?? []" />
    </template>
    <div class="issues__list">
      <el-skeleton v-if="isLoading" :rows="5" animated />
      <el-empty v-else-if="!issues?.length" :description="emptyText" />
      <PostCard v-for="post in issues" v-else :key="post.id" :post="post" :show-site="!siteId"
        @open-site="router.push({ name: 'siteFeed', params: { siteId: $event } })"
        @open-photos="(urls, index) => (viewer = { urls, index })">
        <template #action>
          <el-button type="success" plain @click="promptResolve(post)">Çözüldü olarak işaretle</el-button>
        </template>
      </PostCard>
    </div>
    <el-image-viewer v-if="viewer" :url-list="viewer.urls" :initial-index="viewer.index" teleported
      @close="viewer = null" />
  </DesktopPage>
</template>

<style scoped>
.issues__list {
  display: grid;
  gap: var(--space-3);
  max-width: 680px;
}
</style>
