<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pin } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { postSummary } from '@/core/posts/postPreview'

/**
 * Sabit mesaj şeridi, WhatsApp'taki gibi akışın üstünde. Birden çok sabit mesaj varsa şeride her dokunuşta
 * o mesaja gidilir ve şerit sıradakine geçer ("1/2").
 */
const { pinned } = defineProps<{ pinned: PostView[] }>()
const emit = defineEmits<{ open: [postId: string] }>()
const index = ref(0)
watch(() => pinned.length, () => (index.value = 0))

const current = computed(() => pinned[index.value % Math.max(pinned.length, 1)])

function openCurrent() {
  if (!current.value) return
  emit('open', current.value.id)
  index.value = (index.value + 1) % pinned.length
}
</script>

<template>
  <button v-if="current" type="button" class="pinned-banner" @click="openCurrent">
    <Pin :size="16" class="pinned-banner__icon" />
    <span class="pinned-banner__text">
      <strong>{{ current.author.fullName }}</strong>
      <span>{{ postSummary(current) }}</span>
    </span>
    <span v-if="pinned.length > 1" class="pinned-banner__count">{{ (index % pinned.length) + 1 }}/{{ pinned.length }}</span>
  </button>
</template>

<style scoped>
.pinned-banner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-2) var(--space-4);
  border: 0;
  border-bottom: 1px solid var(--border-soft);
  background: var(--surface);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.pinned-banner__icon {
  flex: none;
  color: var(--brand-primary);
}

.pinned-banner__text {
  display: grid;
  flex: 1;
  min-width: 0;
}

.pinned-banner__text strong {
  font-size: var(--text-xs);
}

.pinned-banner__text span {
  overflow: hidden;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pinned-banner__count {
  flex: none;
  color: var(--text-subtle);
  font-size: var(--text-xs);
}
</style>
