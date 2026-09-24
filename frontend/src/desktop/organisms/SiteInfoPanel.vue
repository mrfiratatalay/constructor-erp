<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MapPin, X } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { mapsHref } from '@/core/format/address'
import { siteParticipants, type Participant } from '@/core/sites/participants'
import { useSiteGroup } from '@/core/sites/useSiteGroup'
import { useSiteLibrary } from '@/core/sites/useSiteLibrary'
import type { LeadChoice } from '@/core/sites/useSiteLeads'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import { useSiteTasks } from '@/core/tasks/useSiteTasks'
import ParticipantList from '@/desktop/molecules/ParticipantList.vue'
import LoginLinkDialog from '@/desktop/organisms/LoginLinkDialog.vue'
import SiteFormDialog from '@/desktop/organisms/SiteFormDialog.vue'
import SiteLibraryPanel from '@/desktop/organisms/SiteLibraryPanel.vue'
import SiteMemberAddDialog from '@/desktop/organisms/SiteMemberAddDialog.vue'
import SitePhotoHeader from '@/desktop/organisms/SitePhotoHeader.vue'

/**
 * Şantiye bilgisi, WhatsApp Masaüstü'ndeki gibi akışın sağında panel: fotoğraf, ad, "Şantiye · N katılımcı",
 * adres (tıklayınca harita), medya ve belgeler, görevler, katılımcılar. Akış kararmaz; ikisi yan yana okunur.
 */
const { site } = defineProps<{ site: SiteView }>()
const emit = defineEmits<{ close: [] }>()
const router = useRouter()
const { data: user } = useCurrentUser()
const { saveSite, isSaving } = useSites()
const { availableMembers, issued, addMember, removeMember, isSaving: isAddingMember } = useSiteGroup(() => site.id)
const library = useSiteLibrary(() => site.id)
const { open: openTasks } = useSiteTasks(() => site.id)
const editing = ref(false)
const addingMember = ref(false)
const showingLibrary = ref(false)
const isOwner = computed(() => user.value?.role === 'OWNER')
const participants = computed(() => siteParticipants(site, user.value))

async function attempt(work: () => Promise<unknown>) {
  await work().catch((error) => ElMessage.error(errorMessage(error)))
}

const save = (form: SiteForm) =>
  attempt(async () => {
    await saveSite(site, form)
    editing.value = false
  })

const add = (choice: LeadChoice) =>
  attempt(async () => {
    await addMember(choice)
    addingMember.value = false
  })

async function remove(participant: Participant) {
  const confirmed = await ElMessageBox.confirm('Bu şantiyeyi artık göremez; öbür şantiyeleri kalır.',
    `${participant.name} şantiyeden çıkarılsın mı?`, { confirmButtonText: 'Çıkar', cancelButtonText: 'Vazgeç',
      type: 'warning', confirmButtonClass: 'el-button--danger' }).then(() => true, () => false)
  if (confirmed) await attempt(() => removeMember(participant.id))
}
</script>

<template>
  <aside class="info-panel">
    <header class="info-panel__bar">
      <el-button text circle aria-label="Kapat" @click="emit('close')"><X :size="18" /></el-button>
      <strong>Şantiye bilgisi</strong>
    </header>
    <el-scrollbar class="info-panel__body">
      <SiteLibraryPanel v-if="showingLibrary" :site-id="site.id" @back="showingLibrary = false" />
      <div v-else class="info-panel__content">
        <SitePhotoHeader :site="site" :can-edit="isOwner" />
        <div class="info-panel__head">
          <h2>{{ site.name }}</h2>
          <p>Şantiye · {{ participants.length }} katılımcı{{ site.status === 'COMPLETED' ? ' · Tamamlandı' : '' }}</p>
          <a v-if="site.address" :href="mapsHref(site.address)" target="_blank" rel="noopener"><MapPin :size="14" />{{ site.address }}</a>
          <el-button v-if="isOwner" size="small" @click="editing = true">Düzenle</el-button>
        </div>
        <el-divider />
        <button type="button" class="info-panel__row" @click="showingLibrary = true">
          <span>Medya ve belgeler</span><small>{{ library.count.value }} ›</small>
        </button>
        <div v-if="library.strip.value.length" class="info-panel__strip">
          <img v-for="item in library.strip.value.slice(0, 4)" :key="item.id" :src="item.thumbnailUrl ?? ''" alt=""
            @click="showingLibrary = true" />
        </div>
        <button type="button" class="info-panel__row" @click="router.push({ name: 'siteTasks', params: { siteId: site.id } })">
          <span>Görevler</span><small>{{ openTasks.length ? `${openTasks.length} açık` : '' }} ›</small>
        </button>
        <el-divider content-position="left">Katılımcılar · {{ participants.length }}</el-divider>
        <ParticipantList :participants="participants" :can-manage="isOwner" @add="addingMember = true" @remove="remove"
          @view="router.push({ name: 'teamMember', params: { memberId: $event.id } })" />
      </div>
    </el-scrollbar>
    <SiteFormDialog v-model:show="editing" :site="site" :saving="isSaving" @submit="save" />
    <SiteMemberAddDialog v-model:show="addingMember" :members="availableMembers" :saving="isAddingMember" @submit="add" />
    <LoginLinkDialog :issued="issued" @close="issued = null" />
  </aside>
</template>

<style scoped>
.info-panel {
  display: flex;
  flex-direction: column;
  width: var(--layout-info-width);
  min-height: 0;
  border-left: 1px solid var(--border-soft);
  background: var(--surface);
}

.info-panel__bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-soft);
}

.info-panel__body {
  flex: 1;
  min-height: 0;
}

.info-panel__content {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-5);
}

.info-panel__head {
  display: grid;
  gap: var(--space-1);
  justify-items: center;
  text-align: center;
}

.info-panel__head h2 {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
}

.info-panel__head p {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.info-panel__head a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--brand-primary);
  font-size: var(--text-sm);
  text-decoration: none;
}

.info-panel__row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.info-panel__row small {
  color: var(--text-muted);
}

.info-panel__strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.info-panel__strip img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  object-fit: cover;
  cursor: pointer;
}
</style>
