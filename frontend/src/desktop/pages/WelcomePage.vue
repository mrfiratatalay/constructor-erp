<script setup lang="ts">
import { switchPlatform } from '@/core/platform'
</script>

<template>
  <el-card class="welcome-page" shadow="never">
    <template #header>Kurulum tamam</template>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Görünüm">Masaüstü (Element Plus)</el-descriptions-item>
    </el-descriptions>
    <el-button class="welcome-page__action" type="primary" @click="switchPlatform('mobile')">
      Mobil görünüme geç
    </el-button>
  </el-card>
</template>

<style scoped>
.welcome-page {
  max-width: 560px;
}

.welcome-page__action {
  margin-top: var(--space-4);
}
</style>
