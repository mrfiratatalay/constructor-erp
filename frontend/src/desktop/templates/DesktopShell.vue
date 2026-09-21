<script setup lang="ts">
import tr from 'element-plus/es/locale/lang/tr'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'
</script>

<template>
  <el-config-provider :locale="tr">
    <el-container class="desktop-shell">
      <el-header class="desktop-shell__header">
        <BrandLogo />
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<style scoped>
.desktop-shell {
  min-height: 100vh;
}

.desktop-shell__header {
  display: flex;
  align-items: center;
  background: var(--surface);
  border-bottom: 1px solid var(--el-border-color-light);
}
</style>
