<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { MemberView } from '@/core/api/generated/model'
import { useSites } from '@/core/sites/useSites'
import { useTeam, type MemberForm } from '@/core/team/useTeam'
import LoginLinkDialog from '@/desktop/organisms/LoginLinkDialog.vue'
import MemberFormDialog from '@/desktop/organisms/MemberFormDialog.vue'
import MemberTable from '@/desktop/organisms/MemberTable.vue'
import DesktopPage from '@/desktop/templates/DesktopPage.vue'

const { members, isLoading, issuedLink, saveMember, sendNewLink, setActive, isSaving } = useTeam()
const { sites } = useSites()
const formOpen = ref(false)
const editing = ref<MemberView | null>(null)

/** Hatalar tek yerden, kullanıcının anlayacağı Türkçe mesajla gösterilir. */
async function attempt(action: () => Promise<unknown>) {
  try {
    await action()
    return true
  } catch (error) {
    ElMessage.error(errorMessage(error))
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
  <DesktopPage title="Ekip">
    <template #actions>
      <el-button type="primary" @click="openForm(null)">Kişi ekle</el-button>
    </template>
    <MemberTable :members="members ?? []" :sites="sites ?? []" :loading="isLoading" @edit="openForm($event)"
      @new-link="attempt(() => sendNewLink($event))"
      @toggle-active="attempt(() => setActive($event, !$event.active))" />
    <MemberFormDialog v-model:show="formOpen" :member="editing" :sites="sites ?? []" :saving="isSaving"
      @submit="onSubmit" />
    <LoginLinkDialog :issued="issuedLink" @close="issuedLink = null" />
  </DesktopPage>
</template>
