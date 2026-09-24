<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { SiteLead, SiteView } from '@/core/api/generated/model'
import { useSiteInvite } from '@/core/team/useSiteInvite'
import LoginLinkDialog from '@/desktop/organisms/LoginLinkDialog.vue'

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
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
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
