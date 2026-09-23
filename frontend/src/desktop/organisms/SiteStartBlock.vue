<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { SiteLead, SiteView } from '@/core/api/generated/model'
import { leadNames } from '@/core/sites/siteNames'
import { useSiteInvite } from '@/core/team/useSiteInvite'
import LoginLinkDialog from '@/desktop/organisms/LoginLinkDialog.vue'
import FeedStartNote from '@/shared/molecules/FeedStartNote.vue'

/**
 * Akışın başı: şantiyenin kurulduğunu ve sorumlusunu söyleyen gri satırlar. Şantiyede henüz hiç gönderi
 * yoksa (empty) patronun oradaki tek işi görünür: sorumluya WhatsApp'tan davet linki.
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
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <FeedStartNote :lines="lines" />
  <el-button v-for="lead in invitable" :key="lead.id" type="primary" plain :loading="isInviting"
    class="site-start__invite" @click="invite(lead)">
    Davet linki gönder: {{ lead.fullName }}
  </el-button>
  <LoginLinkDialog :issued="issued" @close="issued = null" />
</template>

<style scoped>
.site-start__invite {
  justify-self: center;
}
</style>
