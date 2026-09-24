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
  <el-dialog :model-value="post !== null" title="Mesaj bilgisi" width="420px"
    @update:model-value="(open: boolean) => !open && (post = null)">
    <el-skeleton v-if="isLoading" :rows="3" animated />
    <section v-if="seen.length" class="post-info">
      <h3><TickMark tick="seen" /> Gördü</h3>
      <p v-for="receipt in seen" :key="receipt.userId" class="post-info__row">
        <UserAvatar :name="receipt.fullName" :size="32" /><span>{{ receipt.fullName }}</span>
        <small>{{ dateTime(receipt.seenAt!) }}</small>
      </p>
    </section>
    <section v-if="notSeen.length" class="post-info">
      <h3><TickMark tick="sent" /> Henüz görmedi</h3>
      <p v-for="receipt in notSeen" :key="receipt.userId" class="post-info__row">
        <UserAvatar :name="receipt.fullName" :size="32" /><span>{{ receipt.fullName }}</span>
      </p>
    </section>
  </el-dialog>
</template>

<style scoped>
.post-info {
  display: grid;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.post-info h3 {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.post-info__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
}

.post-info__row span {
  flex: 1;
}

.post-info__row small {
  color: var(--text-muted);
}
</style>
