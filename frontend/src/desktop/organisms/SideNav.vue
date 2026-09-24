<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCurrentUser } from '@/core/auth/currentUser'
import type { RouteName } from '@/core/navigation/routeTable'
import UserPanel from '@/desktop/organisms/UserPanel.vue'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'
import BrandMark from '@/shared/molecules/BrandMark.vue'
import { mainNavItems, manageNavItems, navRouteOf, type NavItem } from '@/shared/navigation/navItems'

/**
 * Sol şerit, WhatsApp Masaüstü'nün en soldaki ince şeridi gibi: yalnızca ikonlar (üstüne gelince adı ipucu
 * olarak çıkar), seçili olan baret sarısında. İki öğe için geniş menü yer israfıydı; kazanılan yer listeye ve
 * akışa gider. En altta kişinin kendisi: Hesabım panelini açar.
 */
const route = useRoute()
const router = useRouter()
const { data: user } = useCurrentUser()

const items = computed<NavItem[]>(() =>
  user.value ? [...mainNavItems(user.value.role, 'desktop'), ...manageNavItems(user.value.role)] : [],
)
/** Seçili öğe adresten gelir: şantiye sayfası da "Şantiyeler"i yakar. */
const active = computed(() => navRouteOf(route.name as RouteName))
</script>

<template>
  <aside class="side-nav blueprint">
    <BrandMark compact class="side-nav__brand" />
    <nav class="side-nav__items" aria-label="Ana menü">
      <el-tooltip v-for="item in items" :key="item.route" :content="item.label" placement="right">
        <button type="button" class="side-nav__item" :class="{ 'side-nav__item--active': active === item.route }"
          :aria-label="item.label" :aria-current="active === item.route ? 'page' : undefined"
          @click="router.push({ name: item.route })">
          <component :is="item.icon" :size="22" />
        </button>
      </el-tooltip>
    </nav>
    <el-popover trigger="click" placement="right-end" :width="300">
      <template #reference>
        <button class="side-nav__user" type="button" aria-label="Hesabım">
          <UserAvatar v-if="user" :name="user.fullName" :size="40" />
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
  justify-items: center;
  gap: var(--space-5);
  width: var(--layout-nav-width);
  height: var(--layout-app-height);
  padding: var(--space-4) 0;
}

.side-nav__items {
  display: grid;
  align-content: start;
  gap: var(--space-2);
}

.side-nav__item {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: rgb(255 255 255 / 0.72);
  cursor: pointer;
  transition: background 0.12s;
}

.side-nav__item:hover {
  background: rgb(255 255 255 / 0.1);
  color: var(--brand-on-deep);
}

/*
 * Seçili öğe baret sarısıyla dolu: "neredeyim" tek bakışta. İkon lacivert, beyaz değil: sarı üstünde beyaz
 * okunmaz. Logodaki KŞ rozetiyle aynı ikili (sarı zemin, lacivert harf).
 */
.side-nav__item--active,
.side-nav__item--active:hover {
  background: var(--brand-signature);
  color: var(--brand-deep);
}

.side-nav__user {
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}
</style>
