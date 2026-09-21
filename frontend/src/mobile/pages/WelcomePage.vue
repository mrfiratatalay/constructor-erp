<script setup lang="ts">
import { switchPlatform } from '@/core/platform'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'
</script>

<template>
  <main class="welcome-page">
    <BrandLogo />
    <van-cell-group inset>
      <van-cell title="Görünüm" value="Mobil (Vant)" />
      <van-cell title="Durum" value="Kurulum tamam" />
    </van-cell-group>
    <van-button type="primary" block round @click="switchPlatform('desktop')">
      Masaüstü görünüme geç
    </van-button>
  </main>
</template>

<style scoped>
.welcome-page {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-4);
}
</style>
