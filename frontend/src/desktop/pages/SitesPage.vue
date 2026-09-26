<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { HardHat, Plus, Search, UserPlus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { PostView, SiteToday } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useSitePins } from '@/core/pins/useSitePins'
import { useSearch } from '@/core/search/useSearch'
import { useSiteCreation, type NewSiteForm } from '@/core/sites/useSiteCreation'
import { useSites } from '@/core/sites/useSites'
import { sitesInListOrder } from '@/core/today/siteRow'
import { useToday } from '@/core/today/useToday'
import ListHeader from '@/desktop/molecules/ListHeader.vue'
import WelcomePane from '@/desktop/molecules/WelcomePane.vue'
import JoinLinkDialog from '@/desktop/organisms/JoinLinkDialog.vue'
import NewSiteDialog from '@/desktop/organisms/NewSiteDialog.vue'
import SearchResults from '@/desktop/organisms/SearchResults.vue'
import SiteList from '@/desktop/organisms/SiteList.vue'
import SiteTasksPanel from '@/desktop/organisms/SiteTasksPanel.vue'
import SiteWorkspace from '@/desktop/organisms/SiteWorkspace.vue'
import SplitView from '@/desktop/templates/SplitView.vue'

/**
 * Şantiyeler, WhatsApp Masaüstü gibi: solda firma adı, arama ve liste (sabitlenenler üstte); sağda seçili
 * şantiye ya da sade karşılama. /santiyeler, /santiyeler/:id, /santiyeler/:id/saha ve /santiyeler/:id/gorevler
 * aynı sayfadır: liste yerinde kalır, yalnızca sağ taraf değişir. Hiçbiri seçili değilken hiçbir şantiye okunmuş
 * sayılmaz. Başlıktaki ＋, WhatsApp'taki "Yeni sohbet" gibi tek kapıdır: Yeni şantiye · Kişi ekle.
 */
const route = useRoute()
const router = useRouter()
const { data: user } = useCurrentUser()
const { today, isLoading } = useToday()
const { sites: allSites } = useSites()
const { createSite, isSaving } = useSiteCreation()
const { togglePin } = useSitePins()

const selectedId = computed(() => (route.params.siteId ? String(route.params.siteId) : null))
const ordered = computed(() => sitesInListOrder(today.value?.sites ?? []))
const search = useSearch(ordered)
const completed = computed(() => (allSites.value ?? []).filter((site) => site.status === 'COMPLETED'))
const adding = ref(false)
const inviting = ref(false)

function onAdd(command: 'site' | 'people') {
  if (command === 'site') adding.value = true
  else inviting.value = true
}

async function add(form: NewSiteForm) {
  try {
    const site = await createSite(form)
    adding.value = false
    await router.push({ name: 'siteFeed', params: { siteId: site.id } })
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

async function pin(site: SiteToday) {
  await togglePin(site).catch((error) => ElMessage.error(errorMessage(error)))
}

const openPost = (post: PostView) =>
  router.push({ name: 'siteFeed', params: { siteId: post.site.id }, query: { mesaj: post.id } })
</script>

<template>
  <SplitView>
    <template #list-header>
      <ListHeader :title="user?.companyName ?? 'Şantiyeler'">
        <template #action>
          <el-dropdown trigger="click" placement="bottom-end" @command="onAdd">
            <el-button circle type="primary" aria-label="Ekle"><Plus :size="18" /></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="site" :icon="HardHat">Yeni şantiye</el-dropdown-item>
                <el-dropdown-item command="people" :icon="UserPlus">Kişi ekle</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <el-input v-model="search.text.value" placeholder="Ara" clearable class="sites__search">
          <template #prefix><Search :size="16" /></template>
        </el-input>
      </ListHeader>
    </template>
    <template #list>
      <SearchResults v-if="search.isActive.value" :sites="search.matchingSites.value" :posts="search.posts.value"
        :searching="search.isSearching.value" @open-post="openPost" />
      <template v-else>
        <el-skeleton v-if="isLoading" :rows="6" animated class="sites__skeleton" />
        <SiteList v-else :sites="ordered" :selected-id="selectedId" :completed="completed" :viewer-id="user?.id"
          @pin="pin" />
        <el-empty v-if="today && !today.sites.length" :image-size="72"
          description="Aktif şantiye yok.">
          <el-button type="primary" @click="adding = true">İlk şantiyeni kur</el-button>
        </el-empty>
      </template>
    </template>
    <template #detail>
      <!-- /santiyeler/:id/gorevler: sağda akışın yerine şantiyenin görevleri (liste yerinde kalır). -->
      <SiteTasksPanel v-if="selectedId && route.name === 'siteTasks'" :key="`tasks-${selectedId}`"
        :site-id="selectedId" />
      <SiteWorkspace v-else-if="selectedId" :key="selectedId" :site-id="selectedId" />
      <WelcomePane v-else :company-name="user?.companyName" />
    </template>
  </SplitView>
  <NewSiteDialog v-model:show="adding" :saving="isSaving" @submit="add" />
  <JoinLinkDialog v-model:show="inviting" />
</template>

<style scoped>
.sites__skeleton {
  padding: var(--space-4);
}

.sites__search :deep(.el-input__wrapper) {
  border-radius: 999px;
  background: var(--surface-muted);
  box-shadow: none;
}
</style>
