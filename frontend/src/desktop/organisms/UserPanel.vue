<script setup lang="ts">
import { ChevronRight, LogOut } from 'lucide-vue-next'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useLogout } from '@/core/auth/useLogout'
import { switchPlatform } from '@/core/platform'
import { PUSH_STATE_TEXT } from '@/core/push/pushStateText'
import { usePush } from '@/core/push/usePush'
import { ROLE_LABELS } from '@/core/team/roles'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Masaüstünde Hesabım ayrı bir sayfa değil, kullanıcı düğmesinin açtığı panel: kim olduğun,
 * bildirimler, mobil görünüm ve çıkış. Üç satır bilgi ve bir anahtar için sayfa değiştirmeye gerek yok.
 */
const { data: user } = useCurrentUser()
const { logout, isPending } = useLogout()
const push = usePush()

function togglePush(on: string | number | boolean) {
  void (on ? push.enable() : push.disable())
}
</script>

<template>
  <div v-if="user" class="user-panel">
    <header class="user-panel__who">
      <UserAvatar :name="user.fullName" :size="40" />
      <span>
        <strong>{{ user.fullName }}</strong>
        <span>{{ ROLE_LABELS[user.role] }} · {{ user.companyName }}</span>
      </span>
    </header>
    <el-divider />
    <div class="user-panel__row">
      <span>
        Bildirimler
        <small>{{ PUSH_STATE_TEXT[push.state.value] }}</small>
      </span>
      <el-switch :model-value="push.state.value === 'on'" :loading="push.busy.value"
        :disabled="!['on', 'off'].includes(push.state.value)" @change="togglePush" />
    </div>
    <el-button text class="user-panel__action" @click="switchPlatform('mobile')">
      Mobil görünüme geç <ChevronRight :size="16" />
    </el-button>
    <el-divider />
    <el-button text class="user-panel__action" :loading="isPending" @click="logout">
      <LogOut :size="16" class="user-panel__icon" /> Çıkış yap
    </el-button>
  </div>
</template>

<style scoped>
.user-panel {
  display: grid;
  gap: var(--space-2);
}

.user-panel__who {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.user-panel__who > span,
.user-panel__row > span {
  display: grid;
  min-width: 0;
}

.user-panel__who span span,
.user-panel__row small {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.user-panel :deep(.el-divider) {
  margin: var(--space-1) 0;
}

.user-panel__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 0 var(--space-3);
}

.user-panel__action {
  justify-content: space-between;
  width: 100%;
  margin: 0;
}

.user-panel__icon {
  margin-right: var(--space-2);
}
</style>
