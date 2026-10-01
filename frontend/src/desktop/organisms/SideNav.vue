<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRight, Menu } from 'lucide-vue-next'
import { useCurrentUser } from '@/core/auth/currentUser'
import type { RouteName } from '@/core/navigation/routeTable'
import { useNavMenu } from '@/core/navigation/useNavMenu'
import { useWorkspace } from '@/core/tenant/useWorkspace'
import { ROLE_LABELS } from '@/core/team/roles'
import SideNavAccount from '@/desktop/molecules/SideNavAccount.vue'
import UserPanel from '@/desktop/organisms/UserPanel.vue'
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
const workItems = computed(() => items.value.filter((item) => !item.section))
const managementItems = computed(() => items.value.filter((item) => item.section === 'management'))
const accountOpen = ref(false)
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
        <span v-if="open && workItems.length" class="side-nav__section-label">Günlük işler</span>
        <el-tooltip v-for="item in workItems" :key="item.route" :content="item.label" placement="right" :disabled="open">
          <button type="button" class="side-nav__item" :class="{ 'side-nav__item--active': active === item.route }"
            :aria-label="item.label" :aria-current="active === item.route ? 'page' : undefined" @click="go(item)">
            <component :is="item.icon" :size="22" />
            <span v-if="open" class="side-nav__label">{{ item.label }}</span>
          </button>
        </el-tooltip>
      </nav>
      <footer class="side-nav__footer">
        <nav v-if="managementItems.length" class="side-nav__management" aria-label="Firma yönetimi">
          <el-tooltip v-for="item in managementItems" :key="item.route" :content="item.label" placement="right" :disabled="open">
            <button type="button" class="side-nav__item" :class="{ 'side-nav__item--active': active === item.route }"
              :aria-label="item.label" :aria-current="active === item.route ? 'page' : undefined" @click="go(item)">
              <span class="side-nav__management-icon"><component :is="item.icon" :size="19" /></span>
              <span v-if="open" class="side-nav__label">{{ item.label }}</span>
              <ChevronRight v-if="open" :size="14" class="side-nav__trailing" aria-hidden="true" />
            </button>
          </el-tooltip>
        </nav>
        <el-popover v-if="user" v-model:visible="accountOpen" trigger="click" placement="right-end" :width="300">
          <template #reference>
            <SideNavAccount :name="user.fullName" :role-label="ROLE_LABELS[user.role]" :expanded="open" :active="accountOpen" />
          </template>
          <UserPanel />
        </el-popover>
      </footer>
    </aside>
  </div>
</template>

<style scoped src="./sideNav.css"></style>
