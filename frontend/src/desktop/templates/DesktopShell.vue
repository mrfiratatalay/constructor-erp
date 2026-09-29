<script setup lang="ts">
import tr from 'element-plus/es/locale/lang/tr'
import { useRoute } from 'vue-router'
import RenewalBanner from '@/desktop/organisms/RenewalBanner.vue'
import SideNav from '@/desktop/organisms/SideNav.vue'

const route = useRoute()
</script>

<template>
  <el-config-provider :locale="tr">
    <RouterView v-if="route.meta.public || route.meta.lockedOnly" />
    <!-- Tam ekran uygulama çerçevesi (WhatsApp Masaüstü gibi): sayfa kaymaz, ekranlar kendi içinde kayar. -->
    <div v-else class="desktop-shell">
      <SideNav />
      <main class="desktop-shell__main">
        <RouterView />
      </main>
      <RenewalBanner />
    </div>
  </el-config-provider>
</template>

<style scoped>
.desktop-shell {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  height: var(--layout-app-height);
  overflow: hidden;
  background: var(--canvas);
}

.desktop-shell__main {
  min-width: 0;
  height: var(--layout-app-height);
  overflow: hidden;
}
</style>
