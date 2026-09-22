<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import { HardHat, Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { useCurrentUser } from '@/core/auth/currentUser'
import { dayTitle } from '@/core/format/dates'
import { useSoleSiteRedirect } from '@/core/sites/soleSite'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import { siteRows } from '@/core/today/siteRow'
import { summarizeToday } from '@/core/today/todaySummary'
import { useToday } from '@/core/today/useToday'
import StatusNotice from '@/mobile/molecules/StatusNotice.vue'
import PushPromptCell from '@/mobile/organisms/PushPromptCell.vue'
import SiteFormPopup from '@/mobile/organisms/SiteFormPopup.vue'
import SiteRowCell from '@/mobile/organisms/SiteRowCell.vue'
import UploadQueueCells from '@/mobile/organisms/UploadQueueCells.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Ana ekran: bir durum cümlesi ve aşağı doğru daralan şantiye listesi. Başlık yerine yoğunluk ayırır.
 * Şantiye ekleme başlıktaki ＋ (patron); tamamlananlar listenin sonunda, istenince açılır.
 */
const router = useRouter()
const { data: user } = useCurrentUser()
const { today, isLoading } = useToday()
const { sites: allSites, saveSite, isSaving } = useSites()
useSoleSiteRedirect()

const rows = computed(() => siteRows(today.value?.sites ?? []))
const completed = computed(() => (allSites.value ?? []).filter((site) => site.status === 'COMPLETED'))
const summary = computed(() => (today.value?.sites.length ? summarizeToday(today.value) : null))
const isOwner = computed(() => user.value?.role === 'OWNER')
const adding = ref(false)
const showCompleted = ref(false)
const open = (siteId: string) => router.push({ name: 'siteFeed', params: { siteId } })

async function add(form: SiteForm) {
  try {
    await saveSite(null, form)
    adding.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <MobilePage :title="user?.companyName ?? 'Şantiyeler'" brand>
    <template #action>
      <span class="sites__date">{{ today ? dayTitle(today.date) : '' }}</span>
      <van-button v-if="isOwner" round size="small" class="sites__add" aria-label="Şantiye ekle" @click="adding = true">
        <Plus :size="18" />
      </van-button>
    </template>
    <van-skeleton v-if="isLoading" :row="6" />
    <StatusNotice v-if="summary" :tone="summary.tone" :text="summary.text" :link="summary.toIssues"
      @open="router.push({ name: 'issues' })" />
    <UploadQueueCells />
    <van-cell-group v-if="rows.length" inset>
      <SiteRowCell v-for="row in rows" :key="row.site.siteId" :site="row.site" :density="row.density" @open="open" />
    </van-cell-group>
    <van-empty v-else-if="today"
      :description="isOwner ? 'Aktif şantiye yok. Yukarıdaki ＋ ile ilk şantiyeni ekle.' : 'Sana henüz bir şantiye atanmadı.'">
      <template #image><HardHat :size="48" class="sites__empty-icon" /></template>
    </van-empty>
    <van-cell-group v-if="completed.length" inset>
      <van-cell :title="`Tamamlanan ${completed.length} şantiye`" is-link
        :arrow-direction="showCompleted ? 'up' : 'down'" @click="showCompleted = !showCompleted" />
      <template v-if="showCompleted">
        <van-cell v-for="site in completed" :key="site.id" :title="site.name" is-link @click="open(site.id)" />
      </template>
    </van-cell-group>
    <!-- Hatırlatma ana içeriğin önüne geçmez: şantiyeler ilk ekranda görünsün. -->
    <PushPromptCell message="Sorunlar için bildirim al" />
    <SiteFormPopup v-model:show="adding" :site="null" :saving="isSaving" @submit="add" />
  </MobilePage>
</template>

<style scoped>
.sites__date {
  margin-right: var(--space-2);
}

/* Lacivert başlıkta beyaz ikon düğmesi. */
.sites__add {
  width: 32px;
  padding: 0;
  border: 0;
  background: rgb(255 255 255 / 0.16);
  color: var(--brand-on-deep);
}

.sites__empty-icon {
  color: var(--text-subtle);
}
</style>
