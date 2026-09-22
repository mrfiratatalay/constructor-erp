<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSites } from '@/core/sites/useSites'
import SiteFilter from '@/desktop/molecules/SiteFilter.vue'
import FeedColumn from '@/desktop/organisms/FeedColumn.vue'
import PushPromptAlert from '@/desktop/organisms/PushPromptAlert.vue'
import UploadQueueList from '@/desktop/organisms/UploadQueueList.vue'
import DesktopPage from '@/desktop/templates/DesktopPage.vue'

const router = useRouter()
const { sites } = useSites()
const siteId = ref<string | undefined>()
</script>

<template>
  <DesktopPage title="Akış" subtitle="Sahadan gelen her şey, en yeniden eskiye.">
    <template #actions>
      <SiteFilter v-if="(sites?.length ?? 0) > 1" v-model="siteId" :sites="sites ?? []" />
      <el-button type="primary" @click="router.push({ name: 'compose', query: siteId ? { site: siteId } : {} })">
        Gönderi ekle
      </el-button>
    </template>
    <PushPromptAlert message="Sahadan sorun gelince bu bilgisayara bildirim gelsin." />
    <UploadQueueList />
    <FeedColumn :site-id="siteId" :show-site="!siteId" />
  </DesktopPage>
</template>
