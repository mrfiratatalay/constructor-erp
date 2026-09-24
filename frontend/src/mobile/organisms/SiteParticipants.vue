<script setup lang="ts">
import { computed, ref } from 'vue'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { siteParticipants, type Participant } from '@/core/sites/participants'
import type { MemberForm } from '@/core/team/memberForm'
import type { PersonAction } from '@/core/team/personMenu'
import { usePeople } from '@/core/team/usePeople'
import ParticipantCells from '@/mobile/molecules/ParticipantCells.vue'
import JoinLinkSheet from '@/mobile/organisms/JoinLinkSheet.vue'
import LoginLinkSheet from '@/mobile/organisms/LoginLinkSheet.vue'
import MemberFormPopup from '@/mobile/organisms/MemberFormPopup.vue'

/**
 * Şantiyenin katılımcıları ve patronun onlarla işleri: kişi ekle (firmanın bağlantısı), giriş linki gönder,
 * düzelt, patron yap, firmadan çıkar. Herkes her şantiyede olduğu için liste her şantiyede aynıdır; ayrı bir Ekip
 * ekranı yoktur.
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
  await work().then(() => done && showSuccessToast(done), (error) => showFailToast(errorMessage(error)))
}

const confirm = (title: string, message: string, confirmButtonText: string) =>
  showConfirmDialog({ title, message, confirmButtonText, cancelButtonText: 'Vazgeç' }).then(() => true, () => false)

/** Patron olan şantiye kurar, kişileri yönetir; onay penceresi bunu söyler. */
async function toggleRole(person: Participant) {
  const toOwner = person.role !== 'OWNER'
  const title = `${person.fullName} ${toOwner ? 'patron' : 'şef'} olsun mu?`
  const message = toOwner
    ? 'Şantiye kurar, kişileri düzeltir ve çıkarır, bağlantıyı paylaşır.'
    : 'Görmeye ve yazmaya devam eder; şantiye kuramaz, kişileri yönetemez.'
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
  <ParticipantCells :participants="participants" :can-manage="isOwner" @add="adding = true"
    @act="(action, person) => void HANDLERS[action](person)" />
  <JoinLinkSheet v-model:show="adding" />
  <MemberFormPopup v-model:show="editOpen" :person="editing" :saving="isSaving" @submit="save" />
  <LoginLinkSheet :issued="issued" @close="issued = null" />
</template>
