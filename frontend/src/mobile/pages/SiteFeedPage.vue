<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { showFailToast } from 'vant'
import { Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { leadNames } from '@/core/sites/siteNames'
import { SITE_STATUS } from '@/core/sites/siteStatus'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import FeedList from '@/mobile/organisms/FeedList.vue'
import SiteFormPopup from '@/mobile/organisms/SiteFormPopup.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import UploadQueueCells from '@/mobile/organisms/UploadQueueCells.vue'

const route = useRoute()
const siteId = computed(() => String(route.params.siteId))
const { data: site, refetch } = useGetSite(siteId)
const { data: user } = useCurrentUser()
const { saveSite, isSaving } = useSites()
const editing = ref(false)

async function onSave(form: SiteForm) {
  try {
    await saveSite(site.value ?? null, form)
    editing.value = false
    await refetch()
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <MobilePage :title="site?.name ?? 'Şantiye'" back>
    <template v-if="user?.role === 'OWNER'" #action>
      <van-button size="small" round plain type="primary" @click="editing = true">Düzenle</van-button>
    </template>
    <p v-if="site" class="site-feed__meta">
      <StatusTag :tone="SITE_STATUS[site.status].tone">{{ SITE_STATUS[site.status].label }}</StatusTag>
      <span>{{ leadNames(site.leads) }}</span>
    </p>
    <UploadQueueCells />
    <FeedList :site-id="siteId" :show-site="false" />
    <RouterLink class="site-feed__send" :to="{ name: 'compose', query: { site: siteId } }" aria-label="Bu şantiyeye gönder">
      <Plus :size="28" />
    </RouterLink>
    <SiteFormPopup v-model:show="editing" :site="site ?? null" :saving="isSaving" @submit="onSave" />
  </MobilePage>
</template>

<style scoped>
.site-feed__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
}

/* Bu şantiyeye doğrudan gönder: alt menünün üstünde, başparmağın altında. */
.site-feed__send {
  position: fixed;
  right: var(--space-4);
  bottom: calc(84px + env(safe-area-inset-bottom, 0px));
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--brand-primary);
  color: var(--brand-on-primary);
  box-shadow: 0 8px 20px rgb(30 64 175 / 0.35);
}
</style>
