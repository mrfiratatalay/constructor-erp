<script setup lang="ts">
import { computed, ref } from 'vue'
import { showFailToast, showImagePreview } from 'vant'
import { MapPin } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { mapsHref } from '@/core/format/address'
import { siteParticipants } from '@/core/sites/participants'
import { useSiteLibrary } from '@/core/sites/useSiteLibrary'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import { useSiteTasks } from '@/core/tasks/useSiteTasks'
import SiteMediaRow from '@/mobile/molecules/SiteMediaRow.vue'
import SiteFormPopup from '@/mobile/organisms/SiteFormPopup.vue'
import SiteLibrarySheet from '@/mobile/organisms/SiteLibrarySheet.vue'
import SiteParticipants from '@/mobile/organisms/SiteParticipants.vue'
import SitePhotoHeader from '@/mobile/organisms/SitePhotoHeader.vue'

/**
 * Şantiye bilgisi, WhatsApp'taki grup bilgisi gibi: büyük fotoğraf, ad, "Şantiye · N katılımcı", adres
 * (dokununca harita), medya ve belgeler, görevler, katılımcılar. Herkes buradan düzenler ve kişi ekler; kişileri
 * düzeltmek, patron yapmak ve çıkarmak patronun işidir.
 */
const show = defineModel<boolean>('show', { required: true })
const { site } = defineProps<{ site: SiteView }>()
const { data: user } = useCurrentUser()
const { saveSite, isSaving } = useSites()
const library = useSiteLibrary(() => site.id)
const { open: openTasks } = useSiteTasks(() => site.id)
const editing = ref(false)
const libraryOpen = ref(false)
const participants = computed(() => siteParticipants(site, user.value))

async function attempt(work: () => Promise<unknown>) {
  await work().catch((error) => showFailToast(errorMessage(error)))
}

const save = (form: SiteForm) =>
  attempt(async () => {
    await saveSite(site, form)
    editing.value = false
  })

function openStripItem(index: number) {
  const item = library.strip.value[index]
  if (!item) return
  if (item.kind === 'VIDEO') return void window.open(item.url ?? '', '_blank')
  const urls = library.photoUrls.value
  showImagePreview({ images: urls, startPosition: Math.max(0, urls.indexOf(item.url ?? '')), closeable: true })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <section class="site-info">
      <SitePhotoHeader :site="site" />
      <header class="site-info__head">
        <h2>{{ site.name }}</h2>
        <p>Şantiye · {{ participants.length }} katılımcı{{ site.status === 'COMPLETED' ? ' · Tamamlandı' : '' }}</p>
        <a v-if="site.address" :href="mapsHref(site.address)" target="_blank" rel="noopener" class="site-info__address">
          <MapPin :size="15" />{{ site.address }}
        </a>
        <van-button size="small" round plain type="primary" @click="editing = true">Düzenle</van-button>
      </header>
      <SiteMediaRow :count="library.count.value" :strip="library.strip.value" @open="libraryOpen = true"
        @open-photo="openStripItem" />
      <van-cell-group inset class="site-info__tasks">
        <van-cell title="Görevler" :value="openTasks.length ? `${openTasks.length} açık` : ''" is-link
          :to="{ name: 'siteTasks', params: { siteId: site.id } }" @click="show = false" />
      </van-cell-group>
      <h3 class="site-info__heading">Katılımcılar · {{ participants.length }}</h3>
      <SiteParticipants :site="site" />
    </section>
    <SiteFormPopup v-model:show="editing" :site="site" :saving="isSaving" @submit="save" />
    <SiteLibrarySheet v-model:show="libraryOpen" :site-id="site.id" />
  </van-popup>
</template>

<style scoped>
.site-info {
  display: grid;
  gap: var(--space-4);
  max-height: 90dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) var(--space-4);
}

.site-info__head {
  display: grid;
  gap: var(--space-1);
  justify-items: center;
  text-align: center;
}

.site-info__head h2 {
  margin: 0;
  font-size: var(--text-xl);
}

.site-info__head p {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.site-info__address {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--brand-primary);
  font-size: var(--text-sm);
  text-decoration: none;
}

.site-info__tasks {
  --van-cell-background: var(--surface-muted);
}

.site-info__heading {
  margin: var(--space-2) 0 0;
  color: var(--text-subtle);
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
