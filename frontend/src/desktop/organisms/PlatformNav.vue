<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftRight, LogOut } from 'lucide-vue-next'
import { useLogout } from '@/core/auth/useLogout'
import type { RouteName } from '@/core/navigation/routeTable'
import { useWorkspace } from '@/core/tenant/useWorkspace'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'
import BrandMark from '@/shared/molecules/BrandMark.vue'
import { navRouteOf, platformNavItems } from '@/shared/navigation/navItems'

/**
 * Platform yönetiminin sol menüsü: ürünün markası (firmanınki değil), platform sayfaları ve en altta yönetici. Hem
 * süper yönetici hem bir firmanın üyesi olan kişi buradan kendi çalışma alanına döner.
 */
const route = useRoute()
const router = useRouter()
const { context, workspace } = useWorkspace()
const { logout, isPending } = useLogout()
const items = platformNavItems('desktop')
const active = computed(() => navRouteOf(route.name as RouteName))
</script>

<template>
  <aside class="platform-nav blueprint">
    <BrandMark tagline="Platform yönetimi" />
    <nav class="platform-nav__items" aria-label="Platform menüsü">
      <button v-for="item in items" :key="item.route" type="button" class="platform-nav__item"
        :class="{ 'is-active': active === item.route }" :aria-current="active === item.route ? 'page' : undefined"
        @click="router.push({ name: item.route })">
        <component :is="item.icon" :size="20" /> {{ item.label }}
      </button>
    </nav>
    <div class="platform-nav__footer">
      <el-button v-if="workspace" text class="platform-nav__switch" @click="router.push({ name: 'sites' })">
        <ArrowLeftRight :size="16" /> {{ workspace.name }} çalışma alanı
      </el-button>
      <div class="platform-nav__who">
        <UserAvatar :name="context?.user.fullName ?? ''" :size="36" />
        <span class="platform-nav__name"><strong>{{ context?.user.fullName }}</strong><small>Süper yönetici</small></span>
        <el-button text circle :loading="isPending" aria-label="Çıkış yap" @click="logout"><LogOut :size="18" /></el-button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.platform-nav {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-6);
  width: var(--layout-nav-width-open);
  height: var(--layout-app-height);
  padding: var(--space-5) var(--space-4);
}

.platform-nav__items {
  display: grid;
  align-content: start;
  gap: var(--space-1);
}

.platform-nav__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 44px;
  padding: 0 var(--space-3);
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: rgb(255 255 255 / 0.74);
  font: inherit;
  font-weight: var(--weight-semibold);
  text-align: left;
  cursor: pointer;
}

.platform-nav__item:hover {
  background: rgb(255 255 255 / 0.1);
  color: var(--brand-on-deep);
}

.platform-nav__item.is-active {
  background: var(--brand-signature);
  color: var(--brand-deep);
}

.platform-nav__footer {
  display: grid;
  gap: var(--space-3);
}

.platform-nav__switch {
  justify-content: flex-start;
  gap: var(--space-2);
  color: rgb(255 255 255 / 0.8);
}

.platform-nav__who {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--brand-on-deep);
}

.platform-nav__name {
  display: grid;
  flex: 1;
  min-width: 0;
  font-size: var(--text-sm);
}

.platform-nav__who strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.platform-nav__who small {
  color: rgb(255 255 255 / 0.62);
}

.platform-nav__who :deep(.el-button) {
  color: rgb(255 255 255 / 0.8);
}
</style>
