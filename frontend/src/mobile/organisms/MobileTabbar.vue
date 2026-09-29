<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteName } from '@/core/navigation/routeTable'
import { useTabbarVisible } from '@/core/navigation/useTabbarVisible'
import { useWorkspace } from '@/core/tenant/useWorkspace'
import { mainNavItems, navRouteOf, platformNavItems } from '@/shared/navigation/navItems'

/** Alt sekmeler: platform sayfalarında platform menüsü, firmanın çalışma alanında firmanın menüsü. */
const route = useRoute()
const { viewer } = useWorkspace()
const visible = useTabbarVisible()
const items = computed(() => {
  if (route.meta.platform) return platformNavItems('mobile')
  return viewer.value ? mainNavItems(viewer.value, 'mobile') : []
})
/** Seçili sekme adresten gelir: şantiye sayfası "Şantiyeler" sekmesini yakar. */
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
