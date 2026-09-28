<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EllipsisVertical } from 'lucide-vue-next'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useComposer } from '@/core/posts/useComposer'
import { callablePeople, participantLine } from '@/core/sites/participants'
import { siteTabsFor, useSiteTab } from '@/core/sites/useSiteTab'
import { useSiteVisit } from '@/core/visits/useSiteVisit'
import CallButton from '@/mobile/molecules/CallButton.vue'
import SiteTabs from '@/mobile/molecules/SiteTabs.vue'
import StatusNotice from '@/mobile/molecules/StatusNotice.vue'
import FeedList from '@/mobile/organisms/FeedList.vue'
import FieldComposer from '@/mobile/organisms/FieldComposer.vue'
import FieldList from '@/mobile/organisms/FieldList.vue'
import ProductionTab from '@/mobile/organisms/ProductionTab.vue'
import SiteComposer from '@/mobile/organisms/SiteComposer.vue'
import SiteInfoSheet from '@/mobile/organisms/SiteInfoSheet.vue'
import SiteSearchSheet from '@/mobile/organisms/SiteSearchSheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import SiteHeading from '@/shared/molecules/SiteHeading.vue'

/**
 * Şantiyenin içi, WhatsApp'ta bir grubun içi gibi: solda geri, fotoğraf, ad ve "Musa, Sen" (dokununca bilgi);
 * sağda 📞 (tek kişiyi doğrudan arar, çok kişide liste) ve ⋮ (Şantiye bilgisi, Bu şantiyede ara; telefonda yer
 * dar, 🔍 dışarı çıkmaz). Başlığın altında sekmeler: Sohbet, Saha (günlük) ve patron, şef, depo sorumlusunda
 * İmalat (yazma çubuğu yok); /santiyeler/:id, /saha ve /imalat bu sayfadır. Sohbet ve Saha'nın taslağı ayrıdır. Sayfa açılınca şantiye
 * okunmuş sayılır; alt sekmeler gizlenir. Sohbetin ＋ menüsündeki Yoklama günün yoklama mesajını atar ve sohbette
 * ona gider: çalışan mesajdan katılır.
 */
const route = useRoute()
const siteId = computed(() => String(route.params.siteId))
const { data: site } = useGetSite(siteId)
const { data: user } = useCurrentUser()
const { previousSeenAt } = useSiteVisit(siteId)
const { tab, open: openTab } = useSiteTab()
const target = () => (site.value ? { id: site.value.id, name: site.value.name } : undefined)
const composer = useComposer(target)
const fieldComposer = useComposer(target, { fieldUpdate: true })
const infoOpen = ref(false)
const searchOpen = ref(false)
const moreOpen = ref(false)

const callable = computed(() => (site.value ? callablePeople(site.value, user.value) : []))
const tabs = computed(() => siteTabsFor(user.value?.role))
const MORE = [{ name: 'Şantiye bilgisi', key: 'info' }, { name: 'Bu şantiyede ara', key: 'search' }]

function onMore(action: { key: string }) {
  moreOpen.value = false
  if (action.key === 'info') infoOpen.value = true
  else searchOpen.value = true
}

/** Aramada bulunan mesaja sohbette gidilir: akış adresteki ?mesaj=… ile o mesajı bulur. */
const openFound = (postId: string) => openTab('chat', postId)
</script>

<template>
  <MobilePage :title="site?.name ?? 'Şantiye'" back :tabbar="false" :bottom="tab === 'chat'">
    <template v-if="site" #heading>
      <SiteHeading :site="site" :line="participantLine(site, user)" :size="38" @open="infoOpen = true" />
    </template>
    <template v-if="site" #action>
      <CallButton :people="callable" />
      <van-button size="small" round plain class="site-feed__action site-feed__more" aria-label="Diğer"
        @click="moreOpen = true">
        <EllipsisVertical :size="18" />
      </van-button>
    </template>
    <template #subbar><SiteTabs :active="tab" :tabs="tabs" @change="openTab" /></template>
    <StatusNotice v-if="site?.status === 'COMPLETED'" tone="neutral" text="Bu şantiye tamamlandı." />
    <FeedList v-if="tab === 'chat'" :site-id="siteId" :seen-at="previousSeenAt"
      @reply="composer.replyTo.value = $event" />
    <ProductionTab v-else-if="tab === 'production'" :site-id="siteId" />
    <FieldList v-else-if="site" :site="site" />
    <template v-if="site && tab !== 'production'" #footer>
      <SiteComposer v-if="tab === 'chat'" :composer="composer" :site-name="site.name" />
      <FieldComposer v-else :composer="fieldComposer" />
    </template>
    <SiteInfoSheet v-if="site" v-model:show="infoOpen" :site="site" />
    <SiteSearchSheet v-model:show="searchOpen" :site-id="siteId" @open="openFound" />
    <van-action-sheet v-model:show="moreOpen" :actions="MORE" cancel-text="Vazgeç" teleport="body"
      @select="onMore" />
  </MobilePage>
</template>

<style scoped>
.site-feed__action {
  width: 34px;
  padding: 0;
  margin-left: var(--space-2);
}

.site-feed__more {
  border: 0;
}
</style>
