<script setup lang="ts">
import { ref } from 'vue'
import { useSites } from '@/core/sites/useSites'
import SiteFilter from '@/mobile/molecules/SiteFilter.vue'
import FeedList from '@/mobile/organisms/FeedList.vue'
import PushPromptCell from '@/mobile/organisms/PushPromptCell.vue'
import UploadQueueCells from '@/mobile/organisms/UploadQueueCells.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

const { sites } = useSites()
const siteId = ref<string | undefined>()
</script>

<template>
  <MobilePage title="Akış">
    <SiteFilter v-if="(sites?.length ?? 0) > 1" v-model="siteId" :sites="sites ?? []" />
    <PushPromptCell message="Yeni sorunlar ve akşam hatırlatmaları telefonuna gelsin." />
    <UploadQueueCells />
    <FeedList :site-id="siteId" :show-site="!siteId" />
  </MobilePage>
</template>
