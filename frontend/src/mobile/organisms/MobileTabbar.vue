<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentUser } from '@/core/auth/currentUser'
import type { RouteName } from '@/core/navigation/routeTable'
import { useTabbarVisible } from '@/core/navigation/useTabbarVisible'
import { mainNavItems, navRouteOf } from '@/shared/navigation/navItems'

const route = useRoute()
const { data: user } = useCurrentUser()
const visible = useTabbarVisible()
const items = computed(() => (user.value ? mainNavItems(user.value.role, 'mobile') : []))
/** Seçili sekme adresten gelir: şantiye sayfası "Şantiyeler", çözülenler "Sorunlar" sekmesinin altındadır. */
const active = computed(() => navRouteOf(route.name as RouteName))
</script>

<template>
  <van-tabbar v-if="visible && items.length" :model-value="active" safe-area-inset-bottom>
    <van-tabbar-item v-for="item in items" :key="item.route" :name="item.route" :to="{ name: item.route }">
      <template #icon><component :is="item.icon" :size="22" /></template>
      {{ item.label }}
    </van-tabbar-item>
  </van-tabbar>
</template>
