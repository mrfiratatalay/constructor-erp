<script setup lang="ts">
import { computed } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { dateTime } from '@/core/format/dates'
import { usePostInfo } from '@/core/posts/usePostInfo'
import TickMark from '@/shared/atoms/TickMark.vue'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/** Mesaj bilgisi (WhatsApp'ta "Bilgi"): kim, ne zaman gördü; kim henüz görmedi. */
const post = defineModel<PostView | null>({ required: true })
const { seen, notSeen, isLoading } = usePostInfo(computed(() => post.value?.id ?? null))
</script>

<template>
  <van-popup :show="post !== null" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @update:show="(open: boolean) => !open && (post = null)">
    <section class="post-info">
      <h2 class="post-info__title">Mesaj bilgisi</h2>
      <van-loading v-if="isLoading" size="20" />
      <van-cell-group v-if="seen.length" inset>
        <template #title><span class="post-info__group"><TickMark tick="seen" /> Gördü</span></template>
        <van-cell v-for="receipt in seen" :key="receipt.userId" :title="receipt.fullName"
          :value="dateTime(receipt.seenAt!)" center>
          <template #icon><UserAvatar :name="receipt.fullName" :size="36" class="post-info__avatar" /></template>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-if="notSeen.length" inset>
        <template #title><span class="post-info__group"><TickMark tick="sent" /> Henüz görmedi</span></template>
        <van-cell v-for="receipt in notSeen" :key="receipt.userId" :title="receipt.fullName" center>
          <template #icon><UserAvatar :name="receipt.fullName" :size="36" class="post-info__avatar" /></template>
        </van-cell>
      </van-cell-group>
    </section>
  </van-popup>
</template>

<style scoped>
.post-info {
  display: grid;
  gap: var(--space-3);
  max-height: 80dvh;
  overflow-y: auto;
  padding: var(--space-6) 0 var(--space-4);
}

.post-info__title {
  margin: 0;
  padding: 0 var(--space-4);
  font-size: var(--text-lg);
}

.post-info__group {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.post-info__avatar {
  margin-right: var(--space-3);
}
</style>
