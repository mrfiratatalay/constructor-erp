<script setup lang="ts">
import { computed, ref } from 'vue'
import { showConfirmDialog, showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MemberView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useSites } from '@/core/sites/useSites'
import { useTeam, type MemberForm } from '@/core/team/useTeam'
import LoginLinkSheet from '@/mobile/organisms/LoginLinkSheet.vue'
import MemberFormPopup from '@/mobile/organisms/MemberFormPopup.vue'
import MemberList from '@/mobile/organisms/MemberList.vue'
import MemberSheet from '@/mobile/organisms/MemberSheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/** Ekip: liste; kişiye dokununca alttan kişi paneli (masaüstündeki sağ panelin aynısı) açılır. */
const { members, isLoading, issuedLink, saveMember, sendNewLink, setActive, isSaving } = useTeam()
const { sites } = useSites()
const { data: user } = useCurrentUser()
const formOpen = ref(false)
const editing = ref<MemberView | null>(null)
const selectedId = ref<string | null>(null)
/** Panel hep güncel kişiyi gösterir: düzenleme ya da erişim değişince liste yenilenir, panel de. */
const selected = computed(() => members.value?.find((member) => member.id === selectedId.value) ?? null)

/** Hatalar tek yerden, kullanıcının anlayacağı Türkçe mesajla gösterilir. */
async function attempt(action: () => Promise<unknown>) {
  try {
    await action()
    return true
  } catch (error) {
    showFailToast(errorMessage(error))
    return false
  }
}

function openForm(member: MemberView | null) {
  selectedId.value = null
  editing.value = member
  formOpen.value = true
}

async function onSubmit(form: MemberForm) {
  if (await attempt(() => saveMember(editing.value, form))) formOpen.value = false
}

function sendLink(member: MemberView) {
  selectedId.value = null
  void attempt(() => sendNewLink(member))
}

/** Erişimi kapatmak onay ister; yeniden açmak istemez. */
async function toggleActive(member: MemberView) {
  if (member.active) {
    const confirmed = await showConfirmDialog({
      title: 'Erişim kapatılsın mı?',
      message: `${member.fullName} artık uygulamaya giremez; açık oturumları da kapanır.`,
      confirmButtonText: 'Erişimi kapat',
      confirmButtonColor: 'var(--status-danger)',
      cancelButtonText: 'Vazgeç',
    }).then(() => true, () => false)
    if (!confirmed) return
  }
  await attempt(() => setActive(member, !member.active))
}
</script>

<template>
  <MobilePage title="Ekip" back>
    <template #action>
      <van-button size="small" type="primary" round @click="openForm(null)">Kişi ekle</van-button>
    </template>
    <MemberList :members="members ?? []" :sites="sites ?? []" :loading="isLoading"
      @select="selectedId = $event.id" />
    <MemberSheet :member="selected" :sites="sites ?? []" :is-self="selected?.id === user?.id"
      @close="selectedId = null" @edit="openForm" @new-link="sendLink" @toggle-active="toggleActive" />
    <MemberFormPopup v-model:show="formOpen" :member="editing" :sites="sites ?? []" :saving="isSaving"
      @submit="onSubmit" />
    <LoginLinkSheet :issued="issuedLink" @close="issuedLink = null" />
  </MobilePage>
</template>
