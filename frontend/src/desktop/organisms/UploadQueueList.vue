<script setup lang="ts">
import { computed } from 'vue'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'

/**
 * Gönderilemeyen mesajlar (sunucu reddetti: ör. dosya çok büyük). Bekleyen ve giden mesajlar burada değil,
 * akışta 🕓 ile durur (WhatsApp gibi); burada yalnızca kullanıcının karar vermesi gerekenler.
 */
const queue = useUploadQueue()
const failed = computed(() => queue.items.filter((item) => item.state === 'failed'))
</script>

<template>
  <div v-if="failed.length" class="upload-queue">
    <el-alert v-for="item in failed" :key="item.post.id" :closable="false" show-icon type="error"
      :title="`${item.post.siteName}: gönderilemedi`">
      <div class="upload-queue__row">
        <span>{{ item.error }}</span>
        <el-button size="small" type="danger" plain @click="queue.discard(item.post.id)">Sil</el-button>
      </div>
    </el-alert>
  </div>
</template>

<style scoped>
.upload-queue {
  display: grid;
  gap: var(--space-2);
}

.upload-queue__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
</style>
