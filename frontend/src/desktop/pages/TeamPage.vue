<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
 * Ekip, Şantiyeler'le aynı düzende: solda liste, sağda kişi bilgisi. /ekip ve /ekip/:id aynı sayfadır;
 * kişi seçili değilken ilk kişi görünür. Kişi eklenince sağda o açılır, giriş linki WhatsApp'a hazır bekler.
 */
const route = useRoute()
const router = useRouter()
const { members, findMember, isLoading, issuedLink, saveMember, sendNewLink, removeMember, isSaving } = useTeam()
const { sites } = useSites()
const { data: user } = useCurrentUser()
const formOpen = ref(false)
const editing = ref<MemberView | null>(null)

const routeId = computed(() => (route.params.memberId ? String(route.params.memberId) : null))
const selected = computed(() => (routeId.value ? findMember(routeId.value) : null) ?? members.value[0] ?? null)

/** Hatalar tek yerden, kullanıcının anlayacağı Türkçe mesajla gösterilir. */
async function attempt(action: () => Promise<unknown>) {
  try {
    await action()
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

function openForm(member: MemberView | null) {
  editing.value = member
  formOpen.value = true
}

const onSubmit = (form: MemberForm) =>
  attempt(async () => {
    const saved = await saveMember(editing.value, form)
    formOpen.value = false
    await router.push({ name: 'teamMember', params: { memberId: saved.id } })
  })

async function remove(member: MemberView) {
  const confirmed = await ElMessageBox.confirm(
    'Uygulamaya artık giremez ve bütün şantiyelerden çıkar. Yazdıkları şantiyelerde kalır.',
    `${member.fullName} ekipten çıkarılsın mı?`,
    { confirmButtonText: 'Ekipten çıkar', cancelButtonText: 'Vazgeç', type: 'warning',
      confirmButtonClass: 'el-button--danger' },
  ).then(() => true, () => false)
  if (!confirmed) return
  await attempt(async () => {
    await removeMember(member)
    await router.replace({ name: 'team' })
  })
}
</script>

<template>
  <SplitView>
    <template #list-header>
      <ListHeader title="Ekip">
        <template #action>
          <el-button circle type="primary" aria-label="Kişi ekle" @click="openForm(null)"><Plus :size="18" /></el-button>
        </template>
      </ListHeader>
    </template>
    <template #list>
      <el-skeleton v-if="isLoading" :rows="4" animated class="team__skeleton" />
      <MemberList v-else :members="members" :sites="sites ?? []" :selected-id="selected?.id ?? null" />
    </template>
    <template #detail>
      <MemberDetail v-if="selected" :key="selected.id" :member="selected" :sites="sites ?? []"
        :is-self="selected.id === user?.id" @edit="openForm" @new-link="attempt(() => sendNewLink($event))"
        @remove="remove" />
      <el-empty v-else-if="!isLoading" description="Henüz kimse yok. ＋ ile ilk kişiyi ekle." class="team__empty" />
    </template>
  </SplitView>
  <MemberFormDialog v-model:show="formOpen" :member="editing" :saving="isSaving" @submit="onSubmit" />
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
