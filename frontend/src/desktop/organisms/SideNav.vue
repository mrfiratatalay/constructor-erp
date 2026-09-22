<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronsUpDown } from 'lucide-vue-next'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useLogout } from '@/core/auth/useLogout'
import { switchPlatform } from '@/core/platform'
import { ROLE_LABELS } from '@/core/team/roles'
import { navItemsFor } from '@/shared/navigation/navItems'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'
import BrandMark from '@/shared/molecules/BrandMark.vue'

const router = useRouter()
const { data: user } = useCurrentUser()
const { logout } = useLogout()

const items = computed(() => (user.value ? navItemsFor(user.value.role, 'desktop') : []))
const primary = computed(() => items.value.find((item) => item.primary))
const links = computed(() => items.value.filter((item) => !item.primary))

function onCommand(command: 'profile' | 'mobile' | 'logout') {
  if (command === 'profile') void router.push({ name: 'profile' })
  else if (command === 'mobile') switchPlatform('mobile')
  else logout()
}
</script>

<template>
  <aside class="side-nav blueprint">
    <BrandMark />
    <el-button v-if="primary" class="side-nav__primary" size="large" @click="router.push({ name: primary.route })">
      <component :is="primary.icon" :size="18" />
      <span>Gönderi ekle</span>
    </el-button>
    <nav class="side-nav__links">
      <RouterLink v-for="item in links" :key="item.route" class="side-nav__link" :to="{ name: item.route }">
        <component :is="item.icon" :size="18" />
        {{ item.label }}
      </RouterLink>
    </nav>
    <el-dropdown trigger="click" placement="top-start" @command="onCommand">
      <button class="side-nav__user" type="button">
        <UserAvatar v-if="user" :name="user.fullName" :size="36" />
        <span class="side-nav__who">
          <strong>{{ user?.fullName }}</strong>
          <span>{{ user ? ROLE_LABELS[user.role] : '' }}</span>
        </span>
        <ChevronsUpDown :size="16" />
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">Hesabım ve bildirimler</el-dropdown-item>
          <el-dropdown-item command="mobile">Mobil görünüme geç</el-dropdown-item>
          <el-dropdown-item command="logout" divided>Çıkış yap</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </aside>
</template>

<style scoped>
.side-nav {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: var(--space-5);
  height: 100vh;
  padding: var(--space-6) var(--space-4);
}

/* Element Plus düğmesi, markanın imza sarısıyla: görünüm aynı, davranış kütüphaneden. */
.side-nav__primary {
  width: 100%;
  border: 0;
  background: var(--brand-signature);
  color: var(--brand-deep);
  font-weight: var(--weight-bold);
}

/* Element Plus düğmesi içindeki ikonla yazı arasına boşluk. */
.side-nav__primary :deep(svg) {
  margin-right: var(--space-2);
}

.side-nav__primary:hover {
  background: color-mix(in srgb, var(--brand-signature), #fff 18%);
  color: var(--brand-deep);
}

.side-nav__links {
  display: grid;
  gap: 4px;
  align-content: start;
}

.side-nav__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 11px var(--space-3);
  border-radius: var(--radius-md);
  color: rgb(255 255 255 / 0.72);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.side-nav__link:hover {
  background: rgb(255 255 255 / 0.08);
  color: var(--brand-on-deep);
}

.side-nav__link.router-link-active {
  background: rgb(255 255 255 / 0.14);
  color: var(--brand-on-deep);
  box-shadow: inset 3px 0 0 var(--brand-signature);
}

.side-nav__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-2);
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: var(--radius-md);
  background: rgb(255 255 255 / 0.06);
  color: var(--brand-on-deep);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.side-nav__who {
  display: grid;
  flex: 1;
  min-width: 0;
}

.side-nav__who strong {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.side-nav__who span {
  color: rgb(255 255 255 / 0.6);
  font-size: var(--text-xs);
}
</style>
