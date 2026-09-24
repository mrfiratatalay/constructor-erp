<script setup lang="ts">
import { computed } from 'vue'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'

/**
 * Gönderilemeyen mesajlar (sunucu reddetti: ör. dosya çok büyük). Bekleyen ve giden mesajlar burada değil,
 * şantiyenin akışında 🕓 ile durur (WhatsApp gibi); burada yalnızca kullanıcının karar vermesi gerekenler.
 */
const queue = useUploadQueue()
const failed = computed(() => queue.items.filter((item) => item.state === 'failed'))
</script>

<template>
  <van-cell-group v-if="failed.length" inset>
    <van-cell v-for="item in failed" :key="item.post.id" :title="`${item.post.siteName}: gönderilemedi`"
      :label="item.error ?? undefined">
      <template #value>
        <van-button size="small" type="danger" plain @click="queue.discard(item.post.id)">Sil</van-button>
      </template>
    </van-cell>
  </van-cell-group>
</template>
