<script setup lang="ts">
import tr from 'element-plus/es/locale/lang/tr'
import { useRoute } from 'vue-router'
import PlatformNav from '@/desktop/organisms/PlatformNav.vue'
import RenewalBanner from '@/desktop/organisms/RenewalBanner.vue'
import SideNav from '@/desktop/organisms/SideNav.vue'

/**
 * Üç yüzey, üç çerçeve: tanıtım/giriş/kurulum ve kilit ekranı kendi yerleşimiyle tam sayfa; platform yönetimi ürünün
 * menüsüyle; firmanın çalışma alanı firmanın menüsüyle (WhatsApp Masaüstü gibi: sayfa kaymaz, ekranlar kendi içinde).
 */
const route = useRoute()
</script>

<template>
  <el-config-provider :locale="tr">
    <RouterView v-if="route.meta.public || route.meta.lockedOnly" />
    <div v-else-if="route.meta.platform" class="desktop-shell">
      <PlatformNav />
      <main class="desktop-shell__main">
        <RouterView />
      </main>
    </div>
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
