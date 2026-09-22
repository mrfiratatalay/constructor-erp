<script setup lang="ts">
import { CircleCheck } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { dateTime } from '@/core/format/dates'

/** Yalnızca görüntü: çözülmüş sorunun kim tarafından, ne zaman ve hangi notla kapatıldığı. */
const { post } = defineProps<{ post: PostView }>()
</script>

<template>
  <footer v-if="post.resolution" class="issue-resolved">
    <CircleCheck :size="18" />
    <div>
      <p class="issue-resolved__line">
        Çözüldü · {{ post.resolution.resolvedByName }} · {{ dateTime(post.resolution.resolvedAt) }}
      </p>
      <p v-if="post.resolution.note" class="issue-resolved__note">{{ post.resolution.note }}</p>
    </div>
  </footer>
</template>

<style scoped>
.issue-resolved {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--status-success-bg);
  color: var(--status-success);
}

.issue-resolved__line {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
}

.issue-resolved__note {
  margin: 2px 0 0;
  color: var(--text-strong);
  font-size: var(--text-sm);
}
</style>
