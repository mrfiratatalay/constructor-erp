<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu } from 'lucide-vue-next'
import { useCurrentUser } from '@/core/auth/currentUser'
import type { RouteName } from '@/core/navigation/routeTable'
import { useNavMenu } from '@/core/navigation/useNavMenu'
import { useWorkspace } from '@/core/tenant/useWorkspace'
import { ROLE_LABELS } from '@/core/team/roles'
import UserPanel from '@/desktop/organisms/UserPanel.vue'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'
import WorkspaceBrand from '@/shared/molecules/WorkspaceBrand.vue'
import { mainNavItems, navRouteOf, type NavItem } from '@/shared/navigation/navItems'

/**
 * Sol menü, Gmail'deki gibi ☰ ile açılır ve kapanır (ne zaman yana kaydığı, ne zaman üstüne kaydığı:
 * useNavMenu). Açıkken ikonların yanında adları yazar (TASARIM.md İlke 2); kapalıyken ince şerittir, ad
 * üstüne gelince ipucu olarak çıkar. Seçili öğe sarı arka planla ayrılır. Üstte firmanın kimliği (logosu, adı), en altta kişinin
 * kendisi: Hesabım panelini açar.
 */
const route = useRoute()
const router = useRouter()
const { data: user } = useCurrentUser()
const { open, floating, toggle, closeFloating } = useNavMenu()
const { viewer, workspace } = useWorkspace()
const items = computed<NavItem[]>(() => (viewer.value ? mainNavItems(viewer.value, 'desktop') : []))
/** Seçili öğe adresten gelir: şantiye sayfası da "Şantiyeler"i yakar. */
const active = computed(() => navRouteOf(route.name as RouteName))

function go(item: NavItem) {
  closeFloating()
  void router.push({ name: item.route })
}
</script>

<template>
  <div class="side-nav" :class="{ 'side-nav--open': open, 'side-nav--floating': floating }">
    <div v-if="floating" class="side-nav__scrim" aria-hidden="true" @click="closeFloating" />
    <aside class="side-nav__panel blueprint">
      <header class="side-nav__top">
        <button type="button" class="side-nav__item" :aria-label="open ? 'Menüyü kapat' : 'Menüyü aç'"
          :aria-expanded="open" @click="toggle">
          <Menu :size="22" />
        </button>
        <WorkspaceBrand v-if="workspace" :name="workspace.name" :logo-url="workspace.logoUrl" :compact="!open" />
      </header>
      <nav class="side-nav__items" aria-label="Ana menü">
        <el-tooltip v-for="item in items" :key="item.route" :content="item.label" placement="right" :disabled="open">
          <button type="button" class="side-nav__item" :class="{ 'side-nav__item--active': active === item.route }"
            :aria-label="item.label" :aria-current="active === item.route ? 'page' : undefined" @click="go(item)">
            <component :is="item.icon" :size="22" />
            <span v-if="open" class="side-nav__label">{{ item.label }}</span>
          </button>
        </el-tooltip>
      </nav>
      <el-popover trigger="click" placement="right-end" :width="300">
        <template #reference>
          <button class="side-nav__user" type="button" aria-label="Hesabım">
            <UserAvatar v-if="user" :name="user.fullName" :size="40" />
            <span v-if="open && user" class="side-nav__who">
              <strong>{{ user.fullName }}</strong>
              <small>{{ ROLE_LABELS[user.role] }}</small>
            </span>
          </button>
        </template>
        <UserPanel />
      </el-popover>
    </aside>
  </div>
</template>

<style scoped>
/* Yer tutucu: grid'de menünün kapladığı genişlik. Açık menü geniş pencerede yer kaplar, içerik yana kayar. */
.side-nav {
  position: relative;
  z-index: 20;
  width: var(--layout-nav-width);
  height: var(--layout-app-height);
  transition: width 0.2s ease;
}

.side-nav--open:not(.side-nav--floating) {
  width: var(--layout-nav-width-open);
}

.side-nav__panel {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 1;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-5);
  width: 100%;
  padding: var(--space-4) 14px;
  overflow: hidden;
  transition: width 0.2s ease;
}

/* Dar pencerede açık menü içeriğin üstüne kayar; arkası kararır, boşluğa tıklayınca kapanır. */
.side-nav--floating .side-nav__panel {
  width: var(--layout-nav-width-open);
  box-shadow: var(--shadow-deep);
}

.side-nav__scrim {
  position: fixed;
  inset: 0;
  background: rgb(15 23 42 / 0.35);
}

.side-nav__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.side-nav--open .side-nav__top {
  flex-direction: row;
  gap: var(--space-2);
}

.side-nav__items {
  display: grid;
  align-content: start;
  gap: var(--space-2);
}

/* İkon kapalıyken de açıkken de aynı yerde durur: menü açılınca göz ikonları yeniden aramaz. */
.side-nav__item {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-3);
  width: 44px;
  height: 44px;
  padding: 0 11px;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: rgb(255 255 255 / 0.72);
  font: inherit;
  font-weight: var(--weight-semibold);
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.12s;
}

.side-nav--open .side-nav__items .side-nav__item {
  width: 100%;
}

.side-nav__item:hover {
  background: rgb(255 255 255 / 0.1);
  color: var(--brand-on-deep);
}

/* Sarı zemin üzerinde lacivert ikon ve yazı aktif menüyü belirginleştirir. */
.side-nav__item--active,
.side-nav__item--active:hover {
  background: var(--brand-signature);
  color: var(--brand-deep);
}

.side-nav__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
  padding: 2px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--brand-on-deep);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.side-nav__who {
  display: grid;
  min-width: 0;
  white-space: nowrap;
}

.side-nav__who strong {
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-nav__who small {
  color: rgb(255 255 255 / 0.72);
  font-size: var(--text-sm);
}
</style>
