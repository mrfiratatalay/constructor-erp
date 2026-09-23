<script setup lang="ts">
import { computed } from 'vue'
import { showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { SiteLead, SiteView } from '@/core/api/generated/model'
import { leadNames } from '@/core/sites/siteNames'
import { useSiteInvite } from '@/core/team/useSiteInvite'
import LoginLinkSheet from '@/mobile/organisms/LoginLinkSheet.vue'
import FeedStartNote from '@/shared/molecules/FeedStartNote.vue'

/**
 * Akışın başı: şantiyenin kurulduğunu ve sorumlusunu söyleyen gri satırlar. Şantiyede henüz hiç gönderi
 * yoksa (empty) patronun oradaki tek işi görünür: sorumluya WhatsApp'tan davet linki. Yeni kurulan
 * şantiye böylece boş kalmaz; ilk gönderi gelince düğme kendiliğinden kaybolur.
 */
const { site, empty, canInvite } = defineProps<{ site: SiteView; empty: boolean; canInvite: boolean }>()
const { issued, inviteLead, isInviting } = useSiteInvite()

const lines = computed(() => {
  if (site.leads.length) return ['Şantiye oluşturuldu', `Sorumlu: ${leadNames(site.leads)}`]
  return ['Şantiye oluşturuldu']
})
const invitable = computed(() => (canInvite && empty ? site.leads : []))

async function invite(lead: SiteLead) {
  try {
    await inviteLead(lead)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <FeedStartNote :lines="lines" />
  <van-button v-for="lead in invitable" :key="lead.id" round block plain type="primary" :loading="isInviting"
    class="site-start__invite" @click="invite(lead)">
    Davet linki gönder: {{ lead.fullName }}
  </van-button>
  <LoginLinkSheet :issued="issued" @close="issued = null" />
</template>

<style scoped>
.site-start__invite {
  margin-top: var(--space-3);
}
</style>
