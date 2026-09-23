<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { MapPin } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { useListSitePhotos } from '@/core/api/generated/photos/photos'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useSiteGroup } from '@/core/sites/useSiteGroup'
import type { LeadChoice } from '@/core/sites/useSiteLeads'
import { SITE_STATUS } from '@/core/sites/siteStatus'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import LeadContacts from '@/desktop/molecules/LeadContacts.vue'
import LoginLinkDialog from '@/desktop/organisms/LoginLinkDialog.vue'
import SiteFormDialog from '@/desktop/organisms/SiteFormDialog.vue'
import SiteMemberAddDialog from '@/desktop/organisms/SiteMemberAddDialog.vue'

/**
 * Şantiye bilgisi (WhatsApp'taki "kişi bilgisi" gibi): adres, sorumlular, durum ve bu haftanın fotoğrafları.
 * Ayarlar da burada: patron şantiyeyi buradan düzenler, ayrı bir ayarlar sayfası yoktur.
 */
const open = defineModel<boolean>('open', { required: true })
const { site } = defineProps<{ site: SiteView }>()
const { data: user } = useCurrentUser()
const { saveSite, isSaving } = useSites()
const { data: photos } = useListSitePhotos(() => site.id)
const { availableMembers, issued, addMember, isSaving: isAddingMember } = useSiteGroup(() => site.id)
const editing = ref(false)
const addingMember = ref(false)
const viewerIndex = ref<number | null>(null)
const isOwner = computed(() => user.value?.role === 'OWNER')
const hasInfoLine = computed(() => !!site.address || site.status !== 'ACTIVE')
const hasLeadBlock = computed(() => site.leads.length > 0 || isOwner.value)
const photoUrls = computed(() => (photos.value ?? []).map((photo) => photo.url ?? ''))

async function save(form: SiteForm) {
  try {
    await saveSite(site, form)
    editing.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

async function addGroupMember(choice: LeadChoice) {
  try {
    await addMember(choice)
    addingMember.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-drawer v-model="open" size="380px" :with-header="false">
    <div class="site-info">
      <header class="site-info__head">
        <h2 class="site-info__name">{{ site.name }}</h2>
        <el-button v-if="isOwner" @click="editing = true">Düzenle</el-button>
      </header>
      <p v-if="hasInfoLine" class="site-info__line">
        <template v-if="site.address"><MapPin :size="15" />{{ site.address }}</template>
        <StatusTag v-if="site.status !== 'ACTIVE'" :tone="SITE_STATUS[site.status].tone">
          {{ SITE_STATUS[site.status].label }}
        </StatusTag>
      </p>
      <template v-if="hasLeadBlock">
        <el-divider content-position="left">Katılımcılar</el-divider>
        <LeadContacts :leads="site.leads" :viewer-id="user?.id" :can-assign="isOwner" @add="addingMember = true" />
      </template>
      <template v-if="photos?.length">
        <el-divider content-position="left">Bu haftanın fotoğrafları</el-divider>
        <div class="site-info__photos">
          <el-image v-for="(photo, index) in photos" :key="photo.id" :src="photo.thumbnailUrl ?? photo.url ?? ''"
            fit="cover" lazy class="site-info__photo" @click="viewerIndex = index" />
        </div>
      </template>
    </div>
    <el-image-viewer v-if="viewerIndex !== null" :url-list="photoUrls" :initial-index="viewerIndex" teleported
      @close="viewerIndex = null" />
    <SiteFormDialog v-model:show="editing" :site="site" :saving="isSaving" @submit="save" />
    <SiteMemberAddDialog v-model:show="addingMember" :members="availableMembers" :saving="isAddingMember"
      @submit="addGroupMember" />
    <LoginLinkDialog :issued="issued" @close="issued = null" />
  </el-drawer>
</template>

<style scoped>
.site-info {
  display: grid;
  gap: var(--space-3);
}

.site-info__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.site-info__name {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.site-info__line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: var(--text-muted);
}

.site-info__photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.site-info__photo {
  display: block;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
  cursor: zoom-in;
}
</style>
