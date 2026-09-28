<script setup lang="ts">
import type { PostView } from '@/core/api/generated/model'
import { useTaskCard } from '@/core/tasks/useTaskCard'
import StatusTag from '@/desktop/atoms/StatusTag.vue'

/**
 * Sohbetteki görev kartı: 📋 GÖREV, ne yapılacak, 👤 kim, 🕐 ne zaman ve durumu (zincir ilerledikçe değişir).
 * İşin sorumlusu teslim edilebilir işte büyük "✅ İŞİ TESLİM ET"i görür: teslim penceresi iş seçili açılır.
 * Görev okunana kadar (ya da görev silindiyse) mesajın kendi yazısı görünür: baloncuk boş kalmaz.
 */
const { post } = defineProps<{ post: PostView }>()
const emit = defineEmits<{ deliver: [taskId: string] }>()
const { task, card } = useTaskCard(() => post)
</script>

<template>
  <el-space v-if="card && task" direction="vertical" alignment="flex-start" :size="4" class="task-card"
    data-testid="task-card">
    <el-text tag="b" size="small" type="info">📋 GÖREV</el-text>
    <el-text tag="b" size="large">{{ card.what }}</el-text>
    <el-text v-if="card.who">{{ card.who }}</el-text>
    <el-text v-if="card.when">{{ card.when }}</el-text>
    <StatusTag :tone="card.status.tone">{{ card.status.label }}</StatusTag>
    <el-button v-if="card.canDeliver" type="success" size="large" @click="emit('deliver', task.id)">
      ✅ İŞİ TESLİM ET
    </el-button>
  </el-space>
  <el-text v-else>{{ post.body }}</el-text>
</template>

<style scoped>
.task-card {
  min-width: 220px;
  padding: var(--space-1) 0;
}
</style>
