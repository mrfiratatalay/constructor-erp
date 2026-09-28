<script setup lang="ts">
import { Users } from 'lucide-vue-next'

/**
 * Listede henüz kimse yokken: kütüphanenin hazır çizimi yerine uygulamanın geri kalanındaki ince çizgi ikon ve ne
 * yapılacağını söyleyen tek cümle.
 */
</script>

<template>
  <el-card shadow="never">
    <el-empty description="Listede henüz kimse yok. Sağ üstteki düğmeyle kişi ya da taşeron ekip ekle.">
      <template #image>
        <el-icon :size="64" color="var(--el-color-info-light-5)"><Users :stroke-width="1.5" /></el-icon>
      </template>
    </el-empty>
  </el-card>
</template>
