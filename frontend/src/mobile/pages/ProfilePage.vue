<script setup lang="ts">
import { useCurrentUser } from '@/core/auth/currentUser'
import { useLogout } from '@/core/auth/useLogout'
import { switchPlatform } from '@/core/platform'
import { PUSH_STATE_TEXT } from '@/core/push/pushStateText'
import { usePush } from '@/core/push/usePush'
import { ROLE_LABELS } from '@/core/team/roles'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'
import InstallGuide from '@/shared/molecules/InstallGuide.vue'

const { data: user } = useCurrentUser()
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
