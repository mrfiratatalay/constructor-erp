<script setup lang="ts">
import { useCurrentUser } from '@/core/auth/currentUser'
import { PUSH_STATE_TEXT } from '@/core/push/pushStateText'
import { usePush } from '@/core/push/usePush'
import { ROLE_LABELS } from '@/core/team/roles'
import DesktopPage from '@/desktop/templates/DesktopPage.vue'

const { data: user } = useCurrentUser()
const push = usePush()

function togglePush(on: string | number | boolean) {
  void (on ? push.enable() : push.disable())
}
</script>

<template>
  <DesktopPage title="Hesabım">
    <el-descriptions v-if="user" :column="1" border class="profile">
      <el-descriptions-item label="Ad">{{ user.fullName }}</el-descriptions-item>
      <el-descriptions-item label="Rol">{{ ROLE_LABELS[user.role] }}</el-descriptions-item>
      <el-descriptions-item label="Firma">{{ user.companyName }}</el-descriptions-item>
      <el-descriptions-item label="Bildirimler">
        <div class="profile__push">
          <el-switch :model-value="push.state.value === 'on'" :loading="push.busy.value"
            :disabled="!['on', 'off'].includes(push.state.value)" @change="togglePush" />
          <span>{{ PUSH_STATE_TEXT[push.state.value] }}</span>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </DesktopPage>
</template>

<style scoped>
.profile {
  max-width: 640px;
}

.profile__push {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>
