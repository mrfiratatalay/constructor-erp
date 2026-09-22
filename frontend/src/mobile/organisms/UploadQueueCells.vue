<script setup lang="ts">
import { computed } from 'vue'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'

/** Telefonda bekleyen gönderiler: gidiyor, internet bekliyor ya da gönderilemedi. Kuyruk boşsa görünmez. */
const queue = useUploadQueue()
const isOffline = computed(() => typeof navigator !== 'undefined' && !navigator.onLine)

function describe(state: string, progress: number): string {
  if (state === 'sending') return `Gönderiliyor… %${Math.round(progress * 100)}`
  if (state === 'failed') return 'Gönderilemedi'
  return isOffline.value ? 'İnternet yok, bağlantı gelince gönderilecek' : 'Birazdan tekrar denenecek'
}
</script>

<template>
  <van-cell-group v-if="queue.items.length" inset>
    <van-cell v-for="item in queue.items" :key="item.post.id" :title="item.post.siteName"
      :label="item.state === 'failed' ? item.error ?? undefined : describe(item.state, item.progress)">
      <template #value>
        <van-button v-if="item.state === 'failed'" size="small" type="danger" plain
          @click="queue.discard(item.post.id)">
          Sil
        </van-button>
        <van-loading v-else-if="item.state === 'sending'" size="18" />
        <van-tag v-else type="warning" plain>Bekliyor</van-tag>
      </template>
    </van-cell>
  </van-cell-group>
</template>
