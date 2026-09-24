<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showConfirmDialog, showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MemberView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useSites } from '@/core/sites/useSites'
import { useTeam, type MemberForm } from '@/core/team/useTeam'
import LoginLinkSheet from '@/mobile/organisms/LoginLinkSheet.vue'
import MemberFormPopup from '@/mobile/organisms/MemberFormPopup.vue'
import MemberProfile from '@/mobile/organisms/MemberProfile.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Kişi bilgisi, WhatsApp'taki gibi tam sayfa: kendi adresi var (/ekip/:id), telefonun geri hareketi listeye
 * döner, şantiye bilgisindeki katılımcılardan da buraya gelinir. Sağ üstte Düzenle.
 */
const route = useRoute()
const router = useRouter()
const { findMember, isLoading, issuedLink, saveMember, sendNewLink, removeMember, isSaving } = useTeam()
const { sites } = useSites()
const { data: user } = useCurrentUser()
const member = computed(() => findMember(String(route.params.memberId)))
const editing = ref(false)

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

async function onSubmit(form: MemberForm) {
  const existing = member.value
  if (existing && (await attempt(() => saveMember(existing, form)))) editing.value = false
}

async function remove(target: MemberView) {
  const confirmed = await showConfirmDialog({
    title: `${target.fullName} ekipten çıkarılsın mı?`,
    message: 'Uygulamaya artık giremez ve bütün şantiyelerden çıkar. Yazdıkları şantiyelerde kalır.',
    confirmButtonText: 'Ekipten çıkar',
    confirmButtonColor: 'var(--status-danger)',
    cancelButtonText: 'Vazgeç',
  }).then(() => true, () => false)
  if (confirmed && (await attempt(() => removeMember(target)))) await router.replace({ name: 'team' })
}
</script>

<template>
  <MobilePage title="Kişi bilgisi" back :tabbar="false">
    <template #action>
      <van-button v-if="member" size="small" plain round @click="editing = true">Düzenle</van-button>
    </template>
    <van-skeleton v-if="isLoading" avatar avatar-size="96px" :row="3" />
    <MemberProfile v-else-if="member" :member="member" :sites="sites ?? []" :is-self="member.id === user?.id"
      @new-link="attempt(() => sendNewLink($event))" @remove="remove" />
    <van-empty v-else description="Bu kişi ekipte değil." />
    <MemberFormPopup v-model:show="editing" :member="member" :saving="isSaving" @submit="onSubmit" />
    <LoginLinkSheet :issued="issuedLink" @close="issuedLink = null" />
  </MobilePage>
</template>
