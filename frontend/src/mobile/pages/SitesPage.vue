<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import { HardHat, Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { PostView, SiteToday } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useSitePins } from '@/core/pins/useSitePins'
import { useSearch } from '@/core/search/useSearch'
import { useSiteCreation, type NewSiteForm } from '@/core/sites/useSiteCreation'
import { useSites } from '@/core/sites/useSites'
import { sitesInListOrder } from '@/core/today/siteRow'
import { useToday } from '@/core/today/useToday'
import NewSitePopup from '@/mobile/organisms/NewSitePopup.vue'
import SearchResults from '@/mobile/organisms/SearchResults.vue'
import SiteRowCell from '@/mobile/organisms/SiteRowCell.vue'
import UploadQueueCells from '@/mobile/organisms/UploadQueueCells.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Ana ekran: WhatsApp'ın sohbet listesi. Başlıkta firma adı ve ＋ (patron), altında arama; sabitlenenler üstte,
 * sonra akışında en son bir şey olan. Satıra uzun basınca 📌 Sabitle. Tamamlananlar listenin sonunda.
 */
const router = useRouter()
const { data: user } = useCurrentUser()
const { today, isLoading } = useToday()
const { sites: allSites } = useSites()
const { people, createSite, isSaving } = useSiteCreation()
const { togglePin } = useSitePins()

const rows = computed(() => sitesInListOrder(today.value?.sites ?? []))
const search = useSearch(rows)
const completed = computed(() => (allSites.value ?? []).filter((site) => site.status === 'COMPLETED'))
const isOwner = computed(() => user.value?.role === 'OWNER')
const adding = ref(false)
const showCompleted = ref(false)
const menuFor = ref<SiteToday | null>(null)
const open = (siteId: string) => router.push({ name: 'siteFeed', params: { siteId } })
const openPost = (post: PostView) => router.push({ name: 'siteFeed', params: { siteId: post.site.id }, query: { mesaj: post.id } })
const menuActions = computed(() => [{ name: menuFor.value?.pinnedAt ? 'Sabitlemeyi kaldır' : '📌 Sabitle' }])

async function add(form: NewSiteForm) {
  try {
    const site = await createSite(form)
    adding.value = false
    await open(site.id)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

async function pin() {
  const site = menuFor.value
  menuFor.value = null
  if (site) await togglePin(site).catch((error) => showFailToast(errorMessage(error)))
}
</script>

<template>
  <MobilePage :title="user?.companyName ?? 'Şantiyeler'" brand>
    <template #action>
      <van-button v-if="isOwner" round size="small" class="sites__add" aria-label="Şantiye ekle" @click="adding = true">
        <Plus :size="18" />
      </van-button>
    </template>
    <van-search v-model="search.text.value" shape="round" placeholder="Ara" class="sites__search" />
    <SearchResults v-if="search.isActive.value" :sites="search.matchingSites.value" :posts="search.posts.value"
      :searching="search.isSearching.value" @open-site="open" @open-post="openPost" />
    <template v-else>
      <van-skeleton v-if="isLoading" :row="6" avatar />
      <UploadQueueCells />
      <van-cell-group v-if="rows.length" inset>
        <SiteRowCell v-for="site in rows" :key="site.siteId" :site="site" :viewer-id="user?.id" @open="open"
          @menu="menuFor = $event" />
      </van-cell-group>
      <van-empty v-else-if="today" :description="isOwner ? 'Aktif şantiye yok. İlk şantiyeni kur.' : 'Sana henüz bir şantiye atanmadı.'">
        <template #image><HardHat :size="48" class="sites__empty-icon" /></template>
        <van-button v-if="isOwner" round type="primary" @click="adding = true">İlk şantiyeni kur</van-button>
      </van-empty>
      <van-cell-group v-if="completed.length" inset>
        <van-cell :title="`Tamamlanan ${completed.length} şantiye`" is-link
          :arrow-direction="showCompleted ? 'up' : 'down'" @click="showCompleted = !showCompleted" />
        <template v-if="showCompleted">
          <van-cell v-for="site in completed" :key="site.id" :title="site.name" is-link @click="open(site.id)" />
        </template>
      </van-cell-group>
    </template>
    <van-action-sheet :show="menuFor !== null" :actions="menuActions" :description="menuFor?.name"
      cancel-text="Vazgeç" teleport="body" @select="pin" @update:show="(shown: boolean) => !shown && (menuFor = null)" />
    <NewSitePopup v-model:show="adding" :people="people" :saving="isSaving" @submit="add" />
  </MobilePage>
</template>

<style scoped>
/* Lacivert başlıkta beyaz ikon düğmesi. */
.sites__add {
  width: 32px;
  padding: 0;
  border: 0;
  background: rgb(255 255 255 / 0.16);
  color: var(--brand-on-deep);
}

/* WhatsApp'taki gibi beyaz, yuvarlak arama kutusu; gri zeminde sınırı belli olsun. */
.sites__search {
  padding: 0;
  background: transparent;
}

.sites__search :deep(.van-search__content) {
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.sites__empty-icon {
  color: var(--text-subtle);
}
</style>
