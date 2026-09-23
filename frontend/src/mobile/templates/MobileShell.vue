<script setup lang="ts">
import { useRoute } from 'vue-router'
import MobileTabbar from '@/mobile/organisms/MobileTabbar.vue'

const route = useRoute()
</script>

<template>
  <div class="mobile-shell">
    <RouterView />
    <MobileTabbar v-if="!route.meta.public" />
  </div>
</template>

<style scoped>
.mobile-shell {
  min-height: var(--layout-app-height);
  background: var(--canvas);
}
</style>
