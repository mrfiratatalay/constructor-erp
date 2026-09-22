<script setup lang="ts">
import tr from 'element-plus/es/locale/lang/tr'
import { useRoute } from 'vue-router'
import SideNav from '@/desktop/organisms/SideNav.vue'

const route = useRoute()
</script>

<template>
  <el-config-provider :locale="tr">
    <RouterView v-if="route.meta.public" />
    <div v-else class="desktop-shell">
      <SideNav class="desktop-shell__side" />
      <main class="desktop-shell__main">
        <RouterView />
      </main>
    </div>
  </el-config-provider>
</template>

<style scoped>
.desktop-shell {
  display: grid;
  grid-template-columns: 248px 1fr;
  min-height: 100vh;
  background: var(--canvas);
}

.desktop-shell__side {
  position: sticky;
  top: 0;
}

.desktop-shell__main {
  padding: var(--space-8) clamp(var(--space-6), 3vw, var(--space-10));
  overflow-x: hidden;
}
</style>
