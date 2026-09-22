<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentUser } from '@/core/auth/currentUser'
import { navItemsFor } from '@/shared/navigation/navItems'

const { data: user } = useCurrentUser()
const items = computed(() => (user.value ? navItemsFor(user.value.role, 'mobile') : []))
</script>

<template>
  <van-tabbar v-if="items.length" route safe-area-inset-bottom>
    <van-tabbar-item v-for="item in items" :key="item.route" :to="{ name: item.route }">
      <template #icon="{ active }">
        <!-- Ana eylem ortada, yükseltilmiş ve marka renginde: başparmak ilk ona gider. -->
        <span v-if="item.primary" class="tabbar-plus" :class="{ 'tabbar-plus--active': active }">
          <component :is="item.icon" :size="26" />
        </span>
        <component :is="item.icon" v-else :size="22" />
      </template>
      <span :class="{ 'tabbar-label--hidden': item.primary }">{{ item.label }}</span>
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
.tabbar-plus {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-top: -22px;
  border: 4px solid var(--surface);
  border-radius: 18px;
  background: var(--brand-primary);
  color: var(--brand-on-primary);
  box-shadow: var(--shadow-deep);
}

.tabbar-plus--active {
  background: var(--brand-deep);
}

.tabbar-label--hidden {
  display: none;
}
</style>
