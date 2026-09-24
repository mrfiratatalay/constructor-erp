<script setup lang="ts">
import { computed, ref } from 'vue'
import { showConfirmDialog, showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { siteParticipants, type Participant } from '@/core/sites/participants'
import { useSiteGroup } from '@/core/sites/useSiteGroup'
import type { MemberForm } from '@/core/team/memberForm'
import ParticipantCells from '@/mobile/molecules/ParticipantCells.vue'
import LoginLinkSheet from '@/mobile/organisms/LoginLinkSheet.vue'
import MemberFormPopup from '@/mobile/organisms/MemberFormPopup.vue'
import SiteMemberAddSheet from '@/mobile/organisms/SiteMemberAddSheet.vue'

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
  await work().catch((error) => showFailToast(errorMessage(error)))
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
  const confirmed = await showConfirmDialog({
    title: `${participant.name} şantiyeden çıkarılsın mı?`,
    message: leavesApp(participant.id)
      ? 'Başka şantiyesi olmadığı için uygulamaya da giremeyecek.'
      : 'Bu şantiyeyi artık göremez; öbür şantiyeleri kalır.',
    confirmButtonText: 'Çıkar',
    confirmButtonColor: 'var(--status-danger)',
    cancelButtonText: 'Vazgeç',
  }).then(() => true, () => false)
  if (confirmed) await attempt(() => removeMember(participant.id))
}
</script>

<template>
  <ParticipantCells :participants="participants" :can-manage="isOwner" @add="adding = true"
    @link="attempt(() => sendLoginLink($event.id))" @edit="startEdit" @remove="remove" />
  <SiteMemberAddSheet v-model:show="adding" :site="site" :members="availableMembers" :saving="isSaving" @add="add" />
  <MemberFormPopup v-model:show="editOpen" :member="editing" :saving="isSaving" @submit="save" />
  <LoginLinkSheet :issued="issued" @close="issued = null" />
</template>
