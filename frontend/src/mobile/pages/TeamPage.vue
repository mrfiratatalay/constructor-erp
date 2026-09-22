<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MemberView } from '@/core/api/generated/model'
import { useSites } from '@/core/sites/useSites'
import { useTeam, type MemberForm } from '@/core/team/useTeam'
import LoginLinkSheet from '@/mobile/organisms/LoginLinkSheet.vue'
import MemberActionSheet from '@/mobile/organisms/MemberActionSheet.vue'
import MemberFormPopup from '@/mobile/organisms/MemberFormPopup.vue'
import MemberList from '@/mobile/organisms/MemberList.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

const { members, isLoading, issuedLink, saveMember, sendNewLink, setActive, isSaving } = useTeam()
const { sites } = useSites()
const formOpen = ref(false)
const editing = ref<MemberView | null>(null)
const selected = ref<MemberView | null>(null)

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
  editing.value = member
  formOpen.value = true
}

async function onSubmit(form: MemberForm) {
  if (await attempt(() => saveMember(editing.value, form))) formOpen.value = false
}
</script>

<template>
  <MobilePage title="Ekip">
    <template #action>
      <van-button size="small" type="primary" round @click="openForm(null)">Kişi ekle</van-button>
    </template>
    <MemberList :members="members ?? []" :sites="sites ?? []" :loading="isLoading" @select="selected = $event" />
    <MemberFormPopup v-model:show="formOpen" :member="editing" :sites="sites ?? []" :saving="isSaving"
      @submit="onSubmit" />
    <MemberActionSheet :member="selected" @close="selected = null" @edit="openForm($event)"
      @new-link="attempt(() => sendNewLink($event))"
      @toggle-active="attempt(() => setActive($event, !$event.active))" />
    <LoginLinkSheet :issued="issuedLink" @close="issuedLink = null" />
  </MobilePage>
</template>
