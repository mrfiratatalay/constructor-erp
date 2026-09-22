<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { HardHat, Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { useCurrentUser } from '@/core/auth/currentUser'
import { dayTitle } from '@/core/format/dates'
import { useSoleSiteRedirect } from '@/core/sites/soleSite'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import { siteRows } from '@/core/today/siteRow'
import { summarizeToday } from '@/core/today/todaySummary'
import { useToday } from '@/core/today/useToday'
import ListHeader from '@/desktop/molecules/ListHeader.vue'
import StatusNotice from '@/desktop/molecules/StatusNotice.vue'
import PushPromptAlert from '@/desktop/organisms/PushPromptAlert.vue'
import SiteFormDialog from '@/desktop/organisms/SiteFormDialog.vue'
import SiteList from '@/desktop/organisms/SiteList.vue'
import SiteWorkspace from '@/desktop/organisms/SiteWorkspace.vue'
import SplitView from '@/desktop/templates/SplitView.vue'

/**
 * Şantiyeler (WhatsApp Masaüstü gibi): solda liste, sağda seçili şantiyenin defteri. /santiyeler ve
 * /santiyeler/:id aynı sayfadır: satıra tıklayınca liste yerinde kalır, yalnızca sağ taraf değişir.
 * Hiçbiri seçili değilken hiçbir şantiye kullanıcı istemeden okunmuş sayılmaz.
 */
const route = useRoute()
const router = useRouter()
const { data: user } = useCurrentUser()
const { today, isLoading } = useToday()
const { sites: allSites, saveSite, isSaving } = useSites()
useSoleSiteRedirect()

const selectedId = computed(() => (route.name === 'siteFeed' ? String(route.params.siteId) : null))
const ordered = computed(() => siteRows(today.value?.sites ?? []).map((row) => row.site))
const completed = computed(() => (allSites.value ?? []).filter((site) => site.status === 'COMPLETED'))
const summary = computed(() => (today.value?.sites.length ? summarizeToday(today.value) : null))
const isOwner = computed(() => user.value?.role === 'OWNER')
const adding = ref(false)

async function add(form: SiteForm) {
  try {
    await saveSite(null, form)
    adding.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <SplitView>
    <template #list-header>
      <ListHeader title="Şantiyeler" :meta="today ? dayTitle(today.date) : undefined">
        <template v-if="isOwner" #action>
          <el-button circle type="primary" aria-label="Şantiye ekle" @click="adding = true"><Plus :size="18" /></el-button>
        </template>
        <StatusNotice v-if="summary" :tone="summary.tone" :text="summary.text" :link="summary.toIssues"
          @open="router.push({ name: 'issues' })" />
      </ListHeader>
    </template>
    <template #list>
      <el-skeleton v-if="isLoading" :rows="6" animated class="sites__skeleton" />
      <SiteList v-else :sites="ordered" :selected-id="selectedId" :completed="completed" />
      <el-empty v-if="today && !today.sites.length" :image-size="72"
        :description="isOwner ? 'Aktif şantiye yok. ＋ ile ilk şantiyeni ekle.' : 'Sana henüz bir şantiye atanmadı.'" />
      <PushPromptAlert message="Sorunlar için bildirim al" />
    </template>
    <template #detail>
      <SiteWorkspace v-if="selectedId" :key="selectedId" :site-id="selectedId" />
      <el-empty v-else :image-size="96" class="sites__empty">
        <template #image><HardHat :size="72" class="sites__empty-icon" /></template>
        <template #description>
          <p v-if="summary" class="sites__empty-summary">{{ summary.text }}</p>
          <p>Soldan bir şantiye seç</p>
        </template>
      </el-empty>
    </template>
  </SplitView>
  <SiteFormDialog v-model:show="adding" :site="null" :saving="isSaving" @submit="add" />
</template>

<style scoped>
.sites__skeleton {
  padding: var(--space-4);
}

.sites__empty {
  flex: 1;
}

.sites__empty-icon {
  color: var(--border-strong);
}

.sites__empty-summary {
  color: var(--text-strong);
  font-weight: var(--weight-semibold);
}
</style>
