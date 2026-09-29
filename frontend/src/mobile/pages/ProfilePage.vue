<script setup lang="ts">
import { useCurrentUser } from '@/core/auth/currentUser'
import { useLogout } from '@/core/auth/useLogout'
import { switchPlatform } from '@/core/platform'
import { PUSH_STATE_TEXT } from '@/core/push/pushStateText'
import { usePush } from '@/core/push/usePush'
import { ROLE_LABELS } from '@/core/team/roles'
import { useWorkspace } from '@/core/tenant/useWorkspace'
import { useWorkspaceSwitch } from '@/core/tenant/useWorkspaceSwitch'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'
import InstallGuide from '@/shared/molecules/InstallGuide.vue'

const { data: user } = useCurrentUser()
const { workspace, otherWorkspaces, isPlatformAdmin } = useWorkspace()
const { switchTo } = useWorkspaceSwitch()
const { logout, isPending } = useLogout()
const push = usePush()

function togglePush(on: boolean) {
  void (on ? push.enable() : push.disable())
}
</script>

<template>
  <MobilePage title="Hesabım">
    <van-cell-group inset>
      <van-cell center :title="user?.fullName" :label="user ? `${ROLE_LABELS[user.role]} · ${user.companyName}` : ''">
        <template #icon>
          <UserAvatar v-if="user" :name="user.fullName" :size="44" class="profile__avatar" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group v-if="workspace" inset title="Firma">
      <van-cell center :title="workspace.name" :label="user?.role === 'OWNER' ? 'Firma bilgileri ve abonelik' : ''"
        :is-link="user?.role === 'OWNER'" :to="user?.role === 'OWNER' ? { name: 'company' } : undefined">
        <template #icon>
          <CompanyLogo :name="workspace.name" :logo-url="workspace.logoUrl" :size="36" class="profile__avatar" />
        </template>
      </van-cell>
      <van-cell v-for="option in otherWorkspaces" :key="option.companyId" center :title="option.name"
        label="Bu firmaya geç" is-link @click="switchTo(option.companyId)">
        <template #icon>
          <CompanyLogo :name="option.name" :logo-url="option.logoUrl" :size="36" class="profile__avatar" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group v-if="isPlatformAdmin" inset>
      <van-cell title="Platform yönetimi" label="Firmalar, abonelikler, başvurular" is-link
        :to="{ name: 'platformDashboard' }" />
    </van-cell-group>

    <van-cell-group inset title="Bildirimler">
      <van-cell center title="Bu cihazda bildirimler" :label="PUSH_STATE_TEXT[push.state.value]">
        <template #right-icon>
          <van-switch :model-value="push.state.value === 'on'" :loading="push.busy.value"
            :disabled="!['on', 'off'].includes(push.state.value)" @update:model-value="togglePush" />
        </template>
      </van-cell>
      <van-cell v-if="push.state.value === 'installFirst'">
        <template #title><InstallGuide /></template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset>
      <van-cell title="Masaüstü görünüme geç" is-link @click="switchPlatform('desktop')" />
    </van-cell-group>

    <van-button block round :loading="isPending" @click="logout">Çıkış yap</van-button>
  </MobilePage>
</template>

<style scoped>
.profile__avatar {
  margin-right: var(--space-3);
}
</style>
