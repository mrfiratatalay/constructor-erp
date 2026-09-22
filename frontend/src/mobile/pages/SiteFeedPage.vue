<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Info } from 'lucide-vue-next'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useIssues } from '@/core/issues/useIssues'
import { useTabbarVisible } from '@/core/navigation/useTabbarVisible'
import { useHasSiteList } from '@/core/sites/soleSite'
import { useSiteVisit } from '@/core/visits/useSiteVisit'
import SiteLeadCells from '@/mobile/molecules/SiteLeadCells.vue'
import StatusNotice from '@/mobile/molecules/StatusNotice.vue'
import FeedList from '@/mobile/organisms/FeedList.vue'
import SiteComposer from '@/mobile/organisms/SiteComposer.vue'
import SiteInfoSheet from '@/mobile/organisms/SiteInfoSheet.vue'
import UploadQueueCells from '@/mobile/organisms/UploadQueueCells.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Şantiyenin defteri: künye, varsa açık sorun şeridi, gün gün akış ve altta gönderme çubuğu. Başlıktaki ⓘ
 * şantiye bilgisini (adres, fotoğraflar, patron için Düzenle) alttan açar. Sayfa açılınca şantiye okunmuş
 * sayılır. Detay sayfasıdır: listesi olan kişide alt sekmeler gizlenir, çubuk ekranın dibine oturur.
 */
const route = useRoute()
const router = useRouter()
const siteId = computed(() => String(route.params.siteId))
const { data: site } = useGetSite(siteId)
const { data: user } = useCurrentUser()
const { issues } = useIssues(true, siteId)
const { previousSeenAt } = useSiteVisit(siteId)
const hasSiteList = useHasSiteList()
const tabbarVisible = useTabbarVisible()
const infoOpen = ref(false)
</script>

<template>
  <MobilePage :title="site?.name ?? 'Şantiye'" :back="hasSiteList" :tabbar="tabbarVisible">
    <template v-if="site" #action>
      <van-button size="small" round plain type="primary" class="site-feed__info" aria-label="Şantiye bilgileri"
        @click="infoOpen = true">
        <Info :size="18" />
      </van-button>
    </template>
    <SiteLeadCells v-if="site" :leads="site.leads" :viewer-id="user?.id" :can-assign="user?.role === 'OWNER'" />
    <StatusNotice v-if="site?.status === 'COMPLETED'" tone="calm" text="Bu şantiye tamamlandı." />
    <StatusNotice v-if="issues?.length" tone="danger" :text="`${issues.length} açık sorun`" link
      @open="router.push({ name: 'issues' })" />
    <UploadQueueCells />
    <FeedList :site-id="siteId" :seen-at="previousSeenAt" />
    <template v-if="site" #footer>
      <SiteComposer :site="{ id: site.id, name: site.name }" />
    </template>
    <SiteInfoSheet v-if="site" v-model:show="infoOpen" :site="site" />
  </MobilePage>
</template>

<style scoped>
.site-feed__info {
  width: 34px;
  padding: 0;
}
</style>
