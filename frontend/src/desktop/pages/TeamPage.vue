<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { MemberView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useSites } from '@/core/sites/useSites'
import { useTeam, type MemberForm } from '@/core/team/useTeam'
import ListHeader from '@/desktop/molecules/ListHeader.vue'
import LoginLinkDialog from '@/desktop/organisms/LoginLinkDialog.vue'
import MemberDetail from '@/desktop/organisms/MemberDetail.vue'
import MemberFormDialog from '@/desktop/organisms/MemberFormDialog.vue'
import MemberList from '@/desktop/organisms/MemberList.vue'
import SplitView from '@/desktop/templates/SplitView.vue'

/**
 * Ekip, öteki ana ekranlarla aynı düzende: solda liste, sağda seçili kişi. Kişi eklenince sağda o açılır
 * ve giriş linki gönderilmeye hazır bekler: işe alırken yapılan asıl iş budur.
 */
const { members, isLoading, issuedLink, saveMember, sendNewLink, setActive, isSaving } = useTeam()
const { sites } = useSites()
const { data: user } = useCurrentUser()
const formOpen = ref(false)
const editing = ref<MemberView | null>(null)
const chosenId = ref<string | null>(null)

const active = computed(() => (members.value ?? []).filter((member) => member.active))
const inactive = computed(() => (members.value ?? []).filter((member) => !member.active))
const selected = computed(
  () => members.value?.find((member) => member.id === chosenId.value) ?? active.value[0] ?? null,
)

// Yeni kişi kaydedilince (ya da link yeniden üretilince) sağda o kişi açılır.
watch(issuedLink, (issued) => issued && (chosenId.value = issued.member.id))

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

/** Erişimi kapatmak onay ister; yeniden açmak istemez. */
async function toggleActive(member: MemberView) {
  if (member.active) {
    const confirmed = await ElMessageBox.confirm(
      `${member.fullName} artık uygulamaya giremez; açık oturumları da kapanır.`, 'Erişim kapatılsın mı?',
      { confirmButtonText: 'Erişimi kapat', cancelButtonText: 'Vazgeç', type: 'warning' },
    ).then(() => true, () => false)
    if (!confirmed) return
  }
  await attempt(() => setActive(member, !member.active))
}
</script>

<template>
  <SplitView>
    <template #list-header>
      <ListHeader title="Ekip" :meta="members ? `${active.length} kişi` : undefined">
        <template #action>
          <el-button circle type="primary" aria-label="Kişi ekle" @click="openForm(null)"><Plus :size="18" /></el-button>
        </template>
      </ListHeader>
    </template>
    <template #list>
      <el-skeleton v-if="isLoading" :rows="4" animated class="team__skeleton" />
      <MemberList v-else :active="active" :inactive="inactive" :selected-id="selected?.id ?? null"
        @select="chosenId = $event" />
    </template>
    <template #detail>
      <MemberDetail v-if="selected" :key="selected.id" :member="selected" :sites="sites ?? []"
        :is-self="selected.id === user?.id" @edit="openForm" @new-link="attempt(() => sendNewLink($event))"
        @toggle-active="toggleActive" />
      <el-empty v-else-if="!isLoading" description="Henüz kimse yok. ＋ ile ilk kişiyi ekle." class="team__empty" />
    </template>
  </SplitView>
  <MemberFormDialog v-model:show="formOpen" :member="editing" :sites="sites ?? []" :saving="isSaving"
    @submit="onSubmit" />
  <LoginLinkDialog :issued="issuedLink" @close="issuedLink = null" />
</template>

<style scoped>
.team__skeleton {
  padding: var(--space-4);
}

.team__empty {
  margin: auto;
}
</style>
