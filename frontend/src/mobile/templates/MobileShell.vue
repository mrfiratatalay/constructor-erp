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
  min-height: 100dvh;
  background: var(--canvas);
}
</style>
