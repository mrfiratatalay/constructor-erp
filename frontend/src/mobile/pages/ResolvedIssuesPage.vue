<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showImagePreview } from 'vant'
import { useIssues } from '@/core/issues/useIssues'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import PostCard from '@/shared/organisms/PostCard.vue'

/** Geçmiş kayıt, günlük iş değil: Sorunlar'ın altından açılır. Kim, ne zaman, nasıl çözdü kartta yazar. */
const router = useRouter()
const { issues, isLoading } = useIssues(false, undefined)
</script>

<template>
  <MobilePage title="Çözülen sorunlar" back>
    <van-skeleton v-if="isLoading" :row="5" avatar />
    <van-empty v-else-if="!issues?.length" description="Henüz çözülen sorun yok." />
    <PostCard v-for="post in issues" v-else :key="post.id" :post="post" show-site
      @open-site="router.push({ name: 'siteFeed', params: { siteId: $event } })"
      @open-photos="(urls, index) => showImagePreview({ images: urls, startPosition: index, closeable: true })" />
  </MobilePage>
</template>
