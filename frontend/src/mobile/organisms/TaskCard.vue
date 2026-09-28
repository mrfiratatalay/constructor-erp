<script setup lang="ts">
import type { PostView } from '@/core/api/generated/model'
import { useTaskCard } from '@/core/tasks/useTaskCard'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

/**
 * Sohbetteki görev kartı: 📋 GÖREV, ne yapılacak, 👤 kim, 🕐 ne zaman ve durumu (zincir ilerledikçe değişir).
 * İşin sorumlusu teslim edilebilir işte büyük "✅ İŞİ TESLİM ET"i görür: teslim sayfası iş seçili açılır.
 * Görev okunana kadar (ya da görev silindiyse) mesajın kendi yazısı görünür: baloncuk boş kalmaz.
 */
const { post } = defineProps<{ post: PostView }>()
const emit = defineEmits<{ deliver: [taskId: string] }>()
const { task, card } = useTaskCard(() => post)
</script>

<template>
  <van-space v-if="card && task" direction="vertical" :size="4" class="task-card" data-testid="task-card">
    <span class="task-card__label">📋 GÖREV</span>
    <strong class="task-card__what">{{ card.what }}</strong>
    <span v-if="card.who" class="task-card__line">{{ card.who }}</span>
    <span v-if="card.when" class="task-card__line">{{ card.when }}</span>
    <StatusTag :tone="card.status.tone">{{ card.status.label }}</StatusTag>
    <van-button v-if="card.canDeliver" type="success" block round @click="emit('deliver', task.id)">
      ✅ İŞİ TESLİM ET
    </van-button>
  </van-space>
  <span v-else>{{ post.body }}</span>
</template>

<style scoped>
.task-card {
  width: min(250px, 100%);
  padding: var(--space-1) 0;
}

.task-card__label {
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}

.task-card__what {
  font-size: var(--text-lg);
}

.task-card__line {
  font-size: var(--text-sm);
}
</style>
