<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import MobileTabbar from '@/mobile/organisms/MobileTabbar.vue'

const route = useRoute()
// Demonun kenar düğmesi (rol değiştir, sıfırla) yalnızca demo derlemesinde yüklenir; gerçek pakete girmez.
const DemoBubble =
  import.meta.env.MODE === 'demo' ? defineAsyncComponent(() => import('@/mobile/organisms/DemoBubble.vue')) : null
</script>

<template>
  <div class="mobile-shell">
    <RouterView />
    <MobileTabbar v-if="!route.meta.public && !route.meta.lockedOnly" />
    <component :is="DemoBubble" v-if="DemoBubble && !route.meta.public" />
  </div>
</template>

<style scoped>
.mobile-shell {
  min-height: var(--layout-app-height);
  background: var(--canvas);
}
</style>
