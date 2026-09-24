<script setup lang="ts">
import { Check, CheckCheck, Clock3 } from 'lucide-vue-next'
import type { Tick } from '@/core/posts/ticks'

/** Kendi mesajındaki tik: 🕓 henüz gitmedi, ✓ gitti, mavi ✓✓ herkes gördü (WhatsApp gibi). */
const { tick, size = 16 } = defineProps<{ tick: Tick; size?: number }>()

const LABELS: Record<Tick, string> = { pending: 'Henüz gitmedi', sent: 'Gitti', seen: 'Herkes gördü' }
</script>

<template>
  <span class="tick-mark" :class="`tick-mark--${tick}`" :title="LABELS[tick]" :aria-label="LABELS[tick]">
    <Clock3 v-if="tick === 'pending'" :size="size - 3" />
    <Check v-else-if="tick === 'sent'" :size="size" />
    <CheckCheck v-else :size="size" />
  </span>
</template>

<style scoped>
.tick-mark {
  display: inline-flex;
  flex: none;
  vertical-align: -3px;
  color: var(--text-subtle);
}

/* WhatsApp'taki mavi: markanın laciverti değil, "görüldü"nün kendi rengi. */
.tick-mark--seen {
  color: #34b7f1;
}
</style>
