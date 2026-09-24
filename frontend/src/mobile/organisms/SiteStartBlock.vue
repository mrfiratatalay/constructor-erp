<script setup lang="ts">
import { computed } from 'vue'
import { showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { SiteLead, SiteView } from '@/core/api/generated/model'
import { useSiteInvite } from '@/core/team/useSiteInvite'
import LoginLinkSheet from '@/mobile/organisms/LoginLinkSheet.vue'

/**
 * Yeni şantiyenin boş akışında patronun tek işi: katılımcılara WhatsApp'tan davet linki. Kuruldu ve eklendi
 * satırları akışın kendisindedir (sistem satırları); ilk mesaj gelince düğmeler kendiliğinden kaybolur.
 */
const { site, empty, canInvite } = defineProps<{ site: SiteView; empty: boolean; canInvite: boolean }>()
const { issued, inviteLead, isInviting } = useSiteInvite()
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
  <van-button v-for="lead in invitable" :key="lead.id" round block plain type="primary" :loading="isInviting"
    class="site-start__invite" @click="invite(lead)">
    Davet linki gönder: {{ lead.fullName }}
  </van-button>
  <LoginLinkSheet :issued="issued" @close="issued = null" />
</template>

<style scoped>
.site-start__invite {
  margin-top: var(--space-2);
}
</style>
