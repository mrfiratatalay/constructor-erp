<script setup lang="ts">
import { computed, ref } from 'vue'
import { showFailToast, showImagePreview } from 'vant'
import { MapPin } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { useListSitePhotos } from '@/core/api/generated/photos/photos'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useSiteGroup } from '@/core/sites/useSiteGroup'
import type { LeadChoice } from '@/core/sites/useSiteLeads'
import { SITE_STATUS } from '@/core/sites/siteStatus'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import SiteLeadCells from '@/mobile/molecules/SiteLeadCells.vue'
import SiteFormPopup from '@/mobile/organisms/SiteFormPopup.vue'
import SiteMemberAddSheet from '@/mobile/organisms/SiteMemberAddSheet.vue'
import LoginLinkSheet from '@/mobile/organisms/LoginLinkSheet.vue'

/**
 * Şantiye bilgisi (başlıktaki ⓘ ile alttan açılır; WhatsApp'taki "kişi bilgisi" gibi): adres, sorumlular,
 * durum ve bu haftanın fotoğrafları. Ayarlar da burada: patron şantiyeyi buradan düzenler.
 */
const show = defineModel<boolean>('show', { required: true })
const { site } = defineProps<{ site: SiteView }>()
const { data: user } = useCurrentUser()
const { saveSite, isSaving } = useSites()
const { data: photos } = useListSitePhotos(() => site.id)
const { availableMembers, issued, addMember, isSaving: isAddingMember } = useSiteGroup(() => site.id)
const editing = ref(false)
const addingMember = ref(false)
const isOwner = computed(() => user.value?.role === 'OWNER')
const hasInfoLine = computed(() => !!site.address || site.status !== 'ACTIVE')

function openPhoto(index: number) {
  const urls = (photos.value ?? []).map((photo) => photo.url ?? '')
  showImagePreview({ images: urls, startPosition: index, closeable: true })
}

async function save(form: SiteForm) {
  try {
    await saveSite(site, form)
    editing.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

async function addGroupMember(choice: LeadChoice) {
  try {
    await addMember(choice)
    addingMember.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <section class="site-info">
      <header class="site-info__head">
        <h2 class="site-info__name">{{ site.name }}</h2>
        <van-button v-if="isOwner" size="small" round plain type="primary" @click="editing = true">Düzenle</van-button>
      </header>
      <p v-if="hasInfoLine" class="site-info__line">
        <template v-if="site.address"><MapPin :size="15" />{{ site.address }}</template>
        <StatusTag v-if="site.status !== 'ACTIVE'" :tone="SITE_STATUS[site.status].tone">
          {{ SITE_STATUS[site.status].label }}
        </StatusTag>
      </p>
      <SiteLeadCells :leads="site.leads" :viewer-id="user?.id" :can-assign="isOwner" class="site-info__leads"
        @add="addingMember = true" />
      <template v-if="photos?.length">
        <h3 class="site-info__heading">Bu haftanın fotoğrafları</h3>
        <div class="site-info__photos">
          <van-image v-for="(photo, index) in photos" :key="photo.id" :src="photo.thumbnailUrl ?? photo.url ?? ''"
            fit="cover" class="site-info__photo" @click="openPhoto(index)" />
        </div>
      </template>
    </section>
    <SiteFormPopup v-model:show="editing" :site="site" :saving="isSaving" @submit="save" />
    <SiteMemberAddSheet v-model:show="addingMember" :members="availableMembers" :saving="isAddingMember"
      @submit="addGroupMember" />
    <LoginLinkSheet :issued="issued" @close="issued = null" />
  </van-popup>
</template>

<style scoped>
.site-info {
  display: grid;
  gap: var(--space-3);
  max-height: 86dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) var(--space-4);
}

.site-info__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-right: var(--space-8);
}

.site-info__name {
  flex: 1;
  margin: 0;
  font-size: var(--text-lg);
}

.site-info__line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: var(--text-muted);
}

/* Beyaz pencerede beyaz grup kaybolmasın: künye hafif zeminli bir blok. */
.site-info__leads {
  --van-cell-background: var(--surface-muted);
}

.site-info__heading {
  margin: var(--space-2) 0 0;
  color: var(--text-subtle);
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.site-info__photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.site-info__photo {
  display: block;
  overflow: hidden;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
}
</style>
