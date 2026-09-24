<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { siteParticipants, type Participant } from '@/core/sites/participants'
import { useSiteGroup } from '@/core/sites/useSiteGroup'
import type { MemberForm } from '@/core/team/memberForm'
import ParticipantList from '@/desktop/molecules/ParticipantList.vue'
import LoginLinkDialog from '@/desktop/organisms/LoginLinkDialog.vue'
import MemberFormDialog from '@/desktop/organisms/MemberFormDialog.vue'
import SiteMemberAddDialog from '@/desktop/organisms/SiteMemberAddDialog.vue'

/**
 * Şantiyenin katılımcıları ve patronun onlarla işleri, WhatsApp'taki grup katılımcıları gibi: ekle (davet
 * bağlantısı ya da firmadan), giriş linki gönder, düzelt, çıkar. Ayrı bir Ekip ekranı yoktur.
 */
const { site } = defineProps<{ site: SiteView }>()
const { data: user } = useCurrentUser()
const { availableMembers, issued, findMember, addMember, removeMember, editMember, sendLoginLink, leavesApp, isSaving } =
  useSiteGroup(() => site.id)
const isOwner = computed(() => user.value?.role === 'OWNER')
const participants = computed(() => siteParticipants(site, user.value))
const adding = ref(false)
const editOpen = ref(false)
const editingId = ref<string | null>(null)
const editing = computed(() => (editingId.value ? findMember(editingId.value) : null))

async function attempt(work: () => Promise<unknown>) {
  await work().catch((error) => ElMessage.error(errorMessage(error)))
}

function startEdit(participant: Participant) {
  editingId.value = participant.id
  editOpen.value = true
}

const add = (memberId: string) => attempt(async () => {
  await addMember(memberId)
  adding.value = false
})

const save = (form: MemberForm) => attempt(async () => {
  if (editingId.value) await editMember(editingId.value, form)
  editOpen.value = false
})

/** Son şantiyesinden çıkan uygulamadan da çıkar; pencere bunu açıkça söyler. */
async function remove(participant: Participant) {
  const message = leavesApp(participant.id)
    ? 'Başka şantiyesi olmadığı için uygulamaya da giremeyecek.'
    : 'Bu şantiyeyi artık göremez; öbür şantiyeleri kalır.'
  const confirmed = await ElMessageBox.confirm(message, `${participant.name} şantiyeden çıkarılsın mı?`, {
    confirmButtonText: 'Çıkar', cancelButtonText: 'Vazgeç', type: 'warning', confirmButtonClass: 'el-button--danger',
  }).then(() => true, () => false)
  if (confirmed) await attempt(() => removeMember(participant.id))
}
</script>

<template>
  <ParticipantList :participants="participants" :can-manage="isOwner" @add="adding = true"
    @link="attempt(() => sendLoginLink($event.id))" @edit="startEdit" @remove="remove" />
  <SiteMemberAddDialog v-model:show="adding" :site="site" :members="availableMembers" :saving="isSaving" @add="add" />
  <MemberFormDialog v-model:show="editOpen" :member="editing" :saving="isSaving" @submit="save" />
  <LoginLinkDialog :issued="issued" @close="issued = null" />
</template>
