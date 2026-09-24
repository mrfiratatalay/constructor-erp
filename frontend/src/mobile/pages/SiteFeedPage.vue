<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EllipsisVertical, Phone } from 'lucide-vue-next'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { telHref } from '@/core/format/phone'
import { useComposer } from '@/core/posts/useComposer'
import { firstCallable, participantLine } from '@/core/sites/participants'
import { useSiteVisit } from '@/core/visits/useSiteVisit'
import StatusNotice from '@/mobile/molecules/StatusNotice.vue'
import FeedList from '@/mobile/organisms/FeedList.vue'
import SiteComposer from '@/mobile/organisms/SiteComposer.vue'
import SiteInfoSheet from '@/mobile/organisms/SiteInfoSheet.vue'
import SiteSearchSheet from '@/mobile/organisms/SiteSearchSheet.vue'
import SiteStartBlock from '@/mobile/organisms/SiteStartBlock.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import SiteHeading from '@/shared/molecules/SiteHeading.vue'

/**
 * Şantiyenin içi, WhatsApp'ta bir grubun içi gibi: solda geri, fotoğraf, ad ve "Musa, Sen" (dokununca bilgi);
 * sağda 📞 ve ⋮ (Şantiye bilgisi, Bu şantiyede ara). Ortada akış, altta gönderme çubuğu. Sayfa açılınca
 * şantiye okunmuş sayılır; alt sekmeler gizlenir.
 */
const route = useRoute()
const router = useRouter()
const siteId = computed(() => String(route.params.siteId))
const { data: site } = useGetSite(siteId)
const { data: user } = useCurrentUser()
const { previousSeenAt } = useSiteVisit(siteId)
const composer = useComposer(() => (site.value ? { id: site.value.id, name: site.value.name } : undefined))
const infoOpen = ref(false)
const searchOpen = ref(false)
const moreOpen = ref(false)

const isOwner = computed(() => user.value?.role === 'OWNER')
const callable = computed(() => (site.value ? firstCallable(site.value, user.value) : null))
const MORE = [{ name: 'Şantiye bilgisi', key: 'info' }, { name: 'Bu şantiyede ara', key: 'search' }]

function onMore(action: { key: string }) {
  moreOpen.value = false
  if (action.key === 'info') infoOpen.value = true
  else searchOpen.value = true
}

/** Aramada bulunan mesaja gidilir: akış adresteki ?mesaj=… ile o mesajı bulur. */
const openFound = (postId: string) => router.replace({ query: { mesaj: postId } })
</script>

<template>
  <MobilePage :title="site?.name ?? 'Şantiye'" back :tabbar="false" bottom>
    <template v-if="site" #heading>
      <SiteHeading :site="site" :line="participantLine(site, user)" :size="38" @open="infoOpen = true" />
    </template>
    <template v-if="site" #action>
      <van-button v-if="callable" size="small" round plain type="primary" class="site-feed__action" aria-label="Ara"
        tag="a" :href="telHref(callable.phone!)">
        <Phone :size="17" />
      </van-button>
      <van-button size="small" round plain class="site-feed__action site-feed__more" aria-label="Diğer"
        @click="moreOpen = true">
        <EllipsisVertical :size="18" />
      </van-button>
    </template>
    <StatusNotice v-if="site?.status === 'COMPLETED'" tone="neutral" text="Bu şantiye tamamlandı." />
    <FeedList :site-id="siteId" :seen-at="previousSeenAt" @reply="composer.replyTo.value = $event">
      <template #start="{ empty }">
        <SiteStartBlock v-if="site" :site="site" :empty="empty" :can-invite="isOwner" />
      </template>
    </FeedList>
    <template v-if="site" #footer>
      <SiteComposer :composer="composer" :site-name="site.name" />
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
