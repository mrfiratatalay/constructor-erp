<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { leadNames } from '@/core/sites/siteNames'
import { SITE_STATUS } from '@/core/sites/siteStatus'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import FeedColumn from '@/desktop/organisms/FeedColumn.vue'
import SiteFormDialog from '@/desktop/organisms/SiteFormDialog.vue'
import DesktopPage from '@/desktop/templates/DesktopPage.vue'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import UploadQueueList from '@/desktop/organisms/UploadQueueList.vue'

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
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <DesktopPage :title="site?.name ?? 'Şantiye'">
    <template #actions>
      <el-button v-if="user?.role === 'OWNER'" @click="editing = true">Düzenle</el-button>
      <el-button type="primary" @click="$router.push({ name: 'compose', query: { site: siteId } })">
        Gönderi ekle
      </el-button>
    </template>
    <p v-if="site" class="site-feed__meta">
      <StatusTag :tone="SITE_STATUS[site.status].tone">{{ SITE_STATUS[site.status].label }}</StatusTag>
      <span>{{ site.address ?? 'Adres girilmedi' }} · {{ leadNames(site.leads) }}</span>
    </p>
    <UploadQueueList />
    <FeedColumn :site-id="siteId" :show-site="false" />
    <SiteFormDialog v-model:show="editing" :site="site ?? null" :saving="isSaving" @submit="onSave" />
  </DesktopPage>
</template>

<style scoped>
.site-feed__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  color: var(--text-muted);
}
</style>
