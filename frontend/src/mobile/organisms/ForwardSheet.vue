<script setup lang="ts">
import { computed } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { usePostActions } from '@/core/posts/usePostActions'
import { sitesInListOrder } from '@/core/today/siteRow'
import { useToday } from '@/core/today/useToday'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'

/** İlet (WhatsApp gibi): şantiyeyi seç, mesaj oraya senin adınla ve "İletildi" etiketiyle gider. */
const post = defineModel<PostView | null>({ required: true })
const { today } = useToday()
const { forwardPost } = usePostActions()
const sites = computed(() => sitesInListOrder(today.value?.sites ?? []))

async function forwardTo(siteId: string, siteName: string) {
  const target = post.value
  post.value = null
  if (!target) return
  try {
    await forwardPost(target, siteId)
    showSuccessToast(`${siteName} şantiyesine iletildi`)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup :show="post !== null" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @update:show="(open: boolean) => !open && (post = null)">
    <section class="forward-sheet">
      <h2 class="forward-sheet__title">İlet</h2>
      <van-cell-group inset>
        <van-cell v-for="site in sites" :key="site.siteId" :title="site.name" clickable center
          @click="forwardTo(site.siteId, site.name)">
          <template #icon><SiteAvatar :photo-url="site.photoThumbnailUrl" :size="40" class="forward-sheet__avatar" /></template>
        </van-cell>
      </van-cell-group>
    </section>
  </van-popup>
</template>

<style scoped>
.forward-sheet {
  display: grid;
  gap: var(--space-4);
  max-height: 80dvh;
  overflow-y: auto;
  padding: var(--space-6) 0 var(--space-4);
}

.forward-sheet__title {
  margin: 0;
  padding: 0 var(--space-4);
  font-size: var(--text-lg);
}

.forward-sheet__avatar {
  margin-right: var(--space-3);
}
</style>
