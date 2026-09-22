<script setup lang="ts">
import { computed } from 'vue'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'

const queue = useUploadQueue()
const isOffline = computed(() => typeof navigator !== 'undefined' && !navigator.onLine)
</script>

<template>
  <div v-if="queue.items.length" class="upload-queue">
    <el-alert v-for="item in queue.items" :key="item.post.id" :closable="false" show-icon
      :type="item.state === 'failed' ? 'error' : item.state === 'sending' ? 'info' : 'warning'"
      :title="item.post.siteName">
      <div class="upload-queue__row">
        <span v-if="item.state === 'sending'">Gönderiliyor… %{{ Math.round(item.progress * 100) }}</span>
        <span v-else-if="item.state === 'failed'">{{ item.error }}</span>
        <span v-else>{{ isOffline ? 'İnternet yok, bağlantı gelince gönderilecek' : 'Birazdan tekrar denenecek' }}</span>
        <el-button v-if="item.state === 'failed'" size="small" type="danger" plain
          @click="queue.discard(item.post.id)">
          Sil
        </el-button>
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
