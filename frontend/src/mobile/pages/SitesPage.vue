<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import { HardHat, Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useSoleSiteRedirect } from '@/core/sites/soleSite'
import { useSiteCreation, type NewSiteForm } from '@/core/sites/useSiteCreation'
import { useSites } from '@/core/sites/useSites'
import { sitesByRecency } from '@/core/today/siteRow'
import { useToday } from '@/core/today/useToday'
import NewSitePopup from '@/mobile/organisms/NewSitePopup.vue'
import SiteRowCell from '@/mobile/organisms/SiteRowCell.vue'
import UploadQueueCells from '@/mobile/organisms/UploadQueueCells.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Ana ekran: WhatsApp'ın sohbet listesi. Tek tip satır, son haber gelen üstte; özet cümlesi, sessizlik
 * uyarısı ve yoğunluk kademesi yok — ekranda ne varsa okunur, öğrenilecek bir işaret yok.
 * Şantiye ekleme başlıktaki ＋ (patron); kurulan şantiyenin içine doğrudan düşülür.
 */
const router = useRouter()
const { data: user } = useCurrentUser()
const { today, isLoading } = useToday()
const { sites: allSites } = useSites()
const { leads, createSite, isSaving } = useSiteCreation()
useSoleSiteRedirect()

const rows = computed(() => sitesByRecency(today.value?.sites ?? []))
const completed = computed(() => (allSites.value ?? []).filter((site) => site.status === 'COMPLETED'))
const isOwner = computed(() => user.value?.role === 'OWNER')
const adding = ref(false)
const showCompleted = ref(false)
const open = (siteId: string) => router.push({ name: 'siteFeed', params: { siteId } })

async function add(form: NewSiteForm) {
  try {
    const site = await createSite(form)
    adding.value = false
    await open(site.id)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <MobilePage :title="user?.companyName ?? 'Şantiyeler'" brand>
    <template #action>
      <van-button v-if="isOwner" round size="small" class="sites__add" aria-label="Şantiye ekle" @click="adding = true">
        <Plus :size="18" />
      </van-button>
    </template>
    <van-skeleton v-if="isLoading" :row="6" />
    <UploadQueueCells />
    <van-cell-group v-if="rows.length" inset>
      <SiteRowCell v-for="site in rows" :key="site.siteId" :site="site" @open="open" />
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
    <NewSitePopup v-model:show="adding" :leads="leads" :saving="isSaving" @submit="add" />
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

.sites__empty-icon {
  color: var(--text-subtle);
}
</style>
