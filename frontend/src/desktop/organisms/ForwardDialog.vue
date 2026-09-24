<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { usePostActions } from '@/core/posts/usePostActions'
import { sitesInListOrder } from '@/core/today/siteRow'
import { useToday } from '@/core/today/useToday'
import ListRow from '@/desktop/molecules/ListRow.vue'
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
  await forwardPost(target, siteId).then(
    () => ElMessage.success(`${siteName} şantiyesine iletildi`),
    (error) => ElMessage.error(errorMessage(error)),
  )
}
</script>

<template>
  <el-dialog :model-value="post !== null" title="İlet" width="420px"
    @update:model-value="(open: boolean) => !open && (post = null)">
    <el-scrollbar max-height="60vh">
      <ListRow v-for="site in sites" :key="site.siteId" @select="forwardTo(site.siteId, site.name)">
        <template #leading><SiteAvatar :photo-url="site.photoThumbnailUrl" :size="40" /></template>
        <template #title>{{ site.name }}</template>
      </ListRow>
    </el-scrollbar>
  </el-dialog>
</template>
