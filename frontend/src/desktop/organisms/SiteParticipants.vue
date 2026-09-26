<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { siteParticipants, type Participant } from '@/core/sites/participants'
import type { MemberForm } from '@/core/team/memberForm'
import type { PersonAction } from '@/core/team/personMenu'
import { usePeople } from '@/core/team/usePeople'
import ParticipantList from '@/desktop/molecules/ParticipantList.vue'
import JoinLinkDialog from '@/desktop/organisms/JoinLinkDialog.vue'
import LoginLinkDialog from '@/desktop/organisms/LoginLinkDialog.vue'
import MemberFormDialog from '@/desktop/organisms/MemberFormDialog.vue'

/**
 * Şantiyenin katılımcıları: herkes kişi ekler (firmanın bağlantısı); patron giriş linki gönderir, düzeltir, patron
 * yapar, firmadan çıkarır. Herkes her şantiyede olduğu için liste her şantiyede aynıdır; ayrı bir Ekip ekranı yoktur.
 */
const { site } = defineProps<{ site: SiteView }>()
const { data: user } = useCurrentUser()
const people = usePeople()
const { issued, isSaving } = people
const isOwner = computed(() => user.value?.role === 'OWNER')
const participants = computed(() => siteParticipants(site, user.value))
const adding = ref(false)
const editing = ref<Participant | null>(null)
const editOpen = computed({ get: () => editing.value !== null, set: (open) => !open && (editing.value = null) })

async function attempt(work: () => Promise<unknown>, done?: string) {
  await work().then(() => done && ElMessage.success(done), (error) => ElMessage.error(errorMessage(error)))
}

const confirm = (title: string, message: string, confirmButtonText: string) =>
  ElMessageBox.confirm(message, title, { confirmButtonText, cancelButtonText: 'Vazgeç', type: 'warning' })
    .then(() => true, () => false)

/** Patron olan kişileri yönetir ve bağlantıyı sıfırlar; onay penceresi bunu söyler. */
async function toggleRole(person: Participant) {
  const toOwner = person.role !== 'OWNER'
  const title = `${person.fullName} ${toOwner ? 'patron' : 'şef'} olsun mu?`
  const message = toOwner
    ? 'Kişileri düzeltir, patron yapar ve firmadan çıkarır; bağlantıyı sıfırlar.'
    : 'Görmeye, yazmaya ve şantiye kurmaya devam eder; kişileri yönetemez.'
  if (await confirm(title, message, toOwner ? 'Patron yap' : 'Şef yap')) {
    await attempt(() => people.toggleRole(person), toOwner ? 'Patron yapıldı' : 'Şef yapıldı')
  }
}

/** Çıkarılan kişi hiçbir yere giremez; yazdıkları yerinde kalır. Aynı numarayla bağlantıdan yeniden katılabilir. */
async function remove(person: Participant) {
  const message = 'Hiçbir şantiyeyi göremez, uygulamaya giremez. Yazdıkları yerinde kalır.'
  if (await confirm(`${person.fullName} firmadan çıkarılsın mı?`, message, 'Çıkar')) {
    await attempt(() => people.remove(person), 'Çıkarıldı')
  }
}

const HANDLERS: Record<PersonAction, (person: Participant) => unknown> = {
  loginLink: (person) => attempt(() => people.sendLoginLink(person)),
  edit: (person) => (editing.value = person),
  toggleRole,
  remove,
}

const save = (form: MemberForm) => attempt(async () => {
  if (editing.value) await people.edit(editing.value, form)
  editing.value = null
}, 'Kaydedildi')
</script>

<template>
  <ParticipantList :participants="participants" :can-manage="isOwner" @add="adding = true"
    @act="(action, person) => void HANDLERS[action](person)" />
  <JoinLinkDialog v-model:show="adding" />
  <MemberFormDialog v-model:show="editOpen" :person="editing" :saving="isSaving" @submit="save" />
  <LoginLinkDialog :issued="issued" @close="issued = null" />
</template>
