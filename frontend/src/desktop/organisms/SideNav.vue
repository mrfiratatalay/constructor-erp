<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useNavCollapse } from '@/core/navigation/navCollapse'
import type { RouteName } from '@/core/navigation/routeTable'
import { ROLE_LABELS } from '@/core/team/roles'
import UserPanel from '@/desktop/organisms/UserPanel.vue'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'
import BrandMark from '@/shared/molecules/BrandMark.vue'
import { mainNavItems, manageNavItems, navRouteOf } from '@/shared/navigation/navItems'

/**
 * Sol menü. Element Plus'ın daralma özelliğiyle ikonlara iner (64px); daralmışken ikonun üstünde ad
 * ipucu olarak çıkar. Tercih hatırlanır. En altta kullanıcı düğmesi Hesabım panelini açar.
 */
const route = useRoute()
const router = useRouter()
const { data: user } = useCurrentUser()
const { collapsed, toggle } = useNavCollapse()

const main = computed(() => (user.value ? mainNavItems(user.value.role, 'desktop') : []))
const manage = computed(() => (user.value ? manageNavItems(user.value.role) : []))
/** Seçili menü adresten gelir: şantiye sayfası da "Şantiyeler" menüsünü yakar. */
const active = computed(() => navRouteOf(route.name as RouteName))
</script>

<template>
  <aside class="side-nav blueprint" :class="{ 'side-nav--collapsed': collapsed }">
    <header class="side-nav__top">
      <BrandMark :compact="collapsed" />
      <el-button text circle class="side-nav__toggle" :aria-label="collapsed ? 'Menüyü aç' : 'Menüyü daralt'"
        @click="toggle">
        <PanelLeftOpen v-if="collapsed" :size="18" />
        <PanelLeftClose v-else :size="18" />
      </el-button>
    </header>
    <el-menu :default-active="active" :collapse="collapsed" :collapse-transition="false" class="side-nav__menu"
      @select="(name: string) => router.push({ name })">
      <el-menu-item v-for="item in main" :key="item.route" :index="item.route">
        <el-icon :size="18"><component :is="item.icon" /></el-icon>
        <template #title>{{ item.label }}</template>
      </el-menu-item>
      <!-- Ayda bir yapılan işler günlük menüden ayrı bir grupta durur. -->
      <el-menu-item-group v-if="manage.length" class="side-nav__group">
        <template #title>{{ collapsed ? '' : 'Yönetim' }}</template>
        <el-menu-item v-for="item in manage" :key="item.route" :index="item.route">
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <template #title>{{ item.label }}</template>
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>
    <el-popover trigger="click" placement="right-end" :width="300">
      <template #reference>
        <button class="side-nav__user" type="button" aria-label="Hesabım">
          <UserAvatar v-if="user" :name="user.fullName" :size="36" />
          <span v-if="!collapsed" class="side-nav__who">
            <strong>{{ user?.fullName }}</strong>
            <span>{{ user ? ROLE_LABELS[user.role] : '' }}</span>
          </span>
        </button>
      </template>
      <UserPanel />
    </el-popover>
  </aside>
</template>

<style scoped>
.side-nav {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-5);
  width: 232px;
  height: 100vh;
  padding: var(--space-5) var(--space-3);
}

.side-nav--collapsed {
  width: 72px;
}

.side-nav__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding-left: var(--space-1);
}

.side-nav--collapsed .side-nav__top {
  flex-direction: column;
  padding-left: 0;
}

.side-nav__toggle {
  color: rgb(255 255 255 / 0.72);
}

.side-nav__toggle:hover {
  background: rgb(255 255 255 / 0.1);
  color: var(--brand-on-deep);
}

/* Element Plus menüsü koyu lacivert zeminde: renkler kütüphanenin kendi değişkenlerinden verilir. */
.side-nav__menu {
  --el-menu-bg-color: transparent;
  --el-menu-hover-bg-color: rgb(255 255 255 / 0.08);
  --el-menu-text-color: rgb(255 255 255 / 0.72);
  --el-menu-active-color: var(--brand-deep);
  --el-menu-item-height: 44px;
  --el-menu-item-font-size: var(--text-base);
  --el-menu-base-level-padding: var(--space-3);
  --el-menu-border-color: transparent;
  align-content: start;
  border-right: 0;
}

.side-nav__menu :deep(.el-menu-item) {
  margin-bottom: 4px;
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
}

/*
 * Seçili menü baret sarısıyla dolu: "neredeyim" tek bakışta. Yazı lacivert, beyaz değil: sarı üstünde beyaz
 * ~1,5:1 kontrastla okunmaz, lacivert ~11:1. Logodaki KŞ rozetiyle aynı ikili (sarı zemin, lacivert harf).
 */
.side-nav__menu :deep(.el-menu-item.is-active),
.side-nav__menu :deep(.el-menu-item.is-active:hover) {
  background: var(--brand-signature);
  font-weight: var(--weight-bold);
}

.side-nav__menu :deep(.el-menu-item-group__title) {
  padding: var(--space-5) var(--space-3) var(--space-2);
  color: rgb(255 255 255 / 0.45);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Daralmışken grup başlığı yerine ince bir ayraç. */
.side-nav--collapsed .side-nav__menu :deep(.el-menu-item-group__title) {
  height: 1px;
  margin: var(--space-4) var(--space-2);
  padding: 0;
  background: rgb(255 255 255 / 0.14);
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

.side-nav--collapsed .side-nav__user {
  justify-content: center;
  padding: var(--space-1);
  border-color: transparent;
  background: transparent;
}

.side-nav__who {
  display: grid;
  flex: 1;
  min-width: 0;
}

.side-nav__who strong {
  overflow: hidden;
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.side-nav__who span {
  color: rgb(255 255 255 / 0.6);
  font-size: var(--text-xs);
}
</style>
