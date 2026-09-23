<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Info, Phone } from 'lucide-vue-next'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { telHref } from '@/core/format/phone'
import { useTabbarVisible } from '@/core/navigation/useTabbarVisible'
import { leadNames } from '@/core/sites/siteNames'
import { useHasSiteList } from '@/core/sites/soleSite'
import { useSiteVisit } from '@/core/visits/useSiteVisit'
import StatusNotice from '@/mobile/molecules/StatusNotice.vue'
import FeedList from '@/mobile/organisms/FeedList.vue'
import SiteComposer from '@/mobile/organisms/SiteComposer.vue'
import SiteInfoSheet from '@/mobile/organisms/SiteInfoSheet.vue'
import SiteStartBlock from '@/mobile/organisms/SiteStartBlock.vue'
import UploadQueueCells from '@/mobile/organisms/UploadQueueCells.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Şantiyenin akışı; WhatsApp'ta bir grubun içi gibi: başlıkta ad ve sorumlu, sağda 📞 ile ⓘ, altta
 * gönderme çubuğu, ortada eskiden yeniye akan gönderiler. Künye ayrı bir kart değil başlığın kendisidir:
 * akışın tepesi artık geçmişin başıdır, orada duran bilgi bir daha görünmez.
 * Sayfa açılınca şantiye okunmuş sayılır; listesi olan kişide alt sekmeler gizlenir.
 */
const route = useRoute()
const siteId = computed(() => String(route.params.siteId))
const { data: site } = useGetSite(siteId)
const { data: user } = useCurrentUser()
const { previousSeenAt } = useSiteVisit(siteId)
const hasSiteList = useHasSiteList()
const tabbarVisible = useTabbarVisible()
const infoOpen = ref(false)

const isOwner = computed(() => user.value?.role === 'OWNER')
/** Kişi kendini aramaz; başlıktaki 📞 ilk telefonu olan sorumluya gider, ötekiler ⓘ çekmecesinde. */
const callable = computed(() =>
  (site.value?.leads ?? []).find((lead) => lead.phone && lead.id !== user.value?.id),
)
</script>

<template>
  <!-- Sorumlu yoksa alt satır hiç yazılmaz: olumsuz bilgi künyede yer kaplamaz (akışın başında söylenir). -->
  <MobilePage :title="site?.name ?? 'Şantiye'" :subtitle="site?.leads.length ? leadNames(site.leads) : ''"
    :back="hasSiteList" :tabbar="tabbarVisible" bottom>
    <template v-if="site" #action>
      <van-button v-if="callable" size="small" round plain type="primary" class="site-feed__action" aria-label="Ara"
        tag="a" :href="telHref(callable.phone!)">
        <Phone :size="17" />
      </van-button>
      <van-button size="small" round plain type="primary" class="site-feed__action" aria-label="Şantiye bilgileri"
        @click="infoOpen = true">
        <Info :size="17" />
      </van-button>
    </template>
    <StatusNotice v-if="site?.status === 'COMPLETED'" tone="neutral" text="Bu şantiye tamamlandı." />
    <UploadQueueCells />
    <FeedList :site-id="siteId" :seen-at="previousSeenAt">
      <template #start="{ empty }">
        <SiteStartBlock v-if="site" :site="site" :empty="empty" :can-invite="isOwner" />
      </template>
    </FeedList>
    <template v-if="site" #footer>
      <SiteComposer :site="{ id: site.id, name: site.name }" />
    </template>
    <SiteInfoSheet v-if="site" v-model:show="infoOpen" :site="site" />
  </MobilePage>
</template>

<style scoped>
.site-feed__action {
  width: 34px;
  padding: 0;
  margin-left: var(--space-2);
}
</style>
