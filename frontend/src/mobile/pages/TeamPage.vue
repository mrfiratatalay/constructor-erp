<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast } from 'vant'
import { Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { useSites } from '@/core/sites/useSites'
import { useTeam, type MemberForm } from '@/core/team/useTeam'
import LoginLinkSheet from '@/mobile/organisms/LoginLinkSheet.vue'
import MemberFormPopup from '@/mobile/organisms/MemberFormPopup.vue'
import MemberList from '@/mobile/organisms/MemberList.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Ekip: firmanın adamlarının listesi. ＋ ile eklenir; eklenince giriş linki WhatsApp'ta o kişiye gönderilmeye
 * hazır açılır. Kişiye dokununca kişi bilgisi tam sayfa açılır.
 */
const { members, isLoading, issuedLink, saveMember, isSaving } = useTeam()
const { sites } = useSites()
const formOpen = ref(false)

async function onSubmit(form: MemberForm) {
  try {
    await saveMember(null, form)
    formOpen.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <MobilePage title="Ekip" back>
    <template #action>
      <van-button size="small" type="primary" round aria-label="Kişi ekle" class="team__add" @click="formOpen = true">
        <Plus :size="18" />
      </van-button>
    </template>
    <MemberList :members="members" :sites="sites ?? []" :loading="isLoading" />
    <MemberFormPopup v-model:show="formOpen" :member="null" :saving="isSaving" @submit="onSubmit" />
    <LoginLinkSheet :issued="issuedLink" @close="issuedLink = null" />
  </MobilePage>
</template>

<style scoped>
.team__add {
  width: 36px;
  height: 36px;
  padding: 0;
}

.team__add :deep(.van-button__text) {
  display: grid;
  place-items: center;
}
</style>
