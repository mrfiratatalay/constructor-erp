<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Info, Phone, TriangleAlert } from 'lucide-vue-next'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { firstName } from '@/core/format/names'
import { telHref } from '@/core/format/phone'
import { useIssues } from '@/core/issues/useIssues'
import { leadNames } from '@/core/sites/siteNames'
import { useSiteVisit } from '@/core/visits/useSiteVisit'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import FeedColumn from '@/desktop/organisms/FeedColumn.vue'
import SiteComposerBar from '@/desktop/organisms/SiteComposerBar.vue'
import SiteInfoDrawer from '@/desktop/organisms/SiteInfoDrawer.vue'
import UploadQueueList from '@/desktop/organisms/UploadQueueList.vue'

/**
 * Sağ panelde seçili şantiye: tek satırlık künye (ad · sorumlu · 📞 · ⓘ), gün gün defter ve altta gönderme
 * çubuğu. Açılınca şantiye okunmuş sayılır; önceki bakıştan sonra gelenler çizgiyle ayrılır.
 */
const { siteId } = defineProps<{ siteId: string }>()
const router = useRouter()
const { data: site } = useGetSite(() => siteId)
const { data: user } = useCurrentUser()
const { issues } = useIssues(true, () => siteId)
const { previousSeenAt } = useSiteVisit(() => siteId)
const infoOpen = ref(false)
/** Kişi kendini aramaz. */
const callable = computed(() => (site.value?.leads ?? []).filter((lead) => lead.phone && lead.id !== user.value?.id))
</script>

<template>
  <DetailPane>
    <template #header>
      <div class="workspace__head">
        <span class="workspace__title">
          <strong>{{ site?.name }}</strong>
          <span v-if="site">{{ leadNames(site.leads) }}</span>
        </span>
        <el-button v-if="issues?.length" type="danger" plain @click="router.push({ name: 'issues' })">
          <TriangleAlert :size="15" class="workspace__icon" />{{ issues.length }} açık sorun
        </el-button>
        <el-button v-for="lead in callable" :key="lead.id" tag="a" :href="telHref(lead.phone!)"
          class="workspace__call">
          <Phone :size="15" class="workspace__icon" />{{ firstName(lead.fullName) }}
        </el-button>
        <el-button circle aria-label="Şantiye bilgileri" @click="infoOpen = true"><Info :size="18" /></el-button>
      </div>
    </template>
    <UploadQueueList />
    <FeedColumn :site-id="siteId" :seen-at="previousSeenAt" />
    <template v-if="site" #footer>
      <SiteComposerBar :site="{ id: site.id, name: site.name }" />
    </template>
  </DetailPane>
  <SiteInfoDrawer v-if="site" v-model:open="infoOpen" :site="site" />
</template>

<style scoped>
.workspace__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.workspace__title {
  display: grid;
  flex: 1;
  min-width: 0;
}

.workspace__title strong {
  overflow: hidden;
  font-size: var(--text-md);
  font-weight: var(--weight-black);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace__title span {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.workspace__icon {
  margin-right: 6px;
}

.workspace__call {
  text-decoration: none;
}
</style>
