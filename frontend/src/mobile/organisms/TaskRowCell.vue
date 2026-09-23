<script setup lang="ts">
import { computed } from 'vue'
import type { TaskView } from '@/core/api/generated/model'
import { dueLabel } from '@/core/tasks/dueLabel'
import { priorityTag, TASK_STATUS } from '@/core/tasks/taskLabels'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

/**
 * Görev listesindeki satır: başlık, altında kime verildiği ve ne zamana kadar. "Yapılacak" her açık görevin
 * varsayılanıdır, yazılmaz; yalnızca "Devam ediyor", termin ve sıradan sapan öncelik etiket olur (İlke 3).
 * Bütün satır dokunulur, görevin ayrıntısı alttan açılır.
 */
const { task } = defineProps<{ task: TaskView }>()
const emit = defineEmits<{ open: [task: TaskView] }>()

const due = computed(() => dueLabel(task))
const priority = computed(() => priorityTag(task.priority))
const inProgress = computed(() => task.status === 'IN_PROGRESS')
const hasMeta = computed(() => !!task.assignee || inProgress.value || !!due.value || !!priority.value)
</script>

<template>
  <van-cell clickable class="task-row" @click="emit('open', task)">
    <template #title>
      <span class="task-row__title" :class="{ 'task-row__title--done': task.status === 'DONE' }">{{ task.title }}</span>
    </template>
    <template v-if="hasMeta" #label>
      <span class="task-row__meta">
        <span v-if="task.assignee" class="task-row__who">{{ task.assignee.fullName }}</span>
        <StatusTag v-if="inProgress" :tone="TASK_STATUS.IN_PROGRESS.tone">{{ TASK_STATUS.IN_PROGRESS.label }}</StatusTag>
        <StatusTag v-if="due" :tone="due.tone">{{ due.label }}</StatusTag>
        <StatusTag v-if="priority" :tone="priority.tone">{{ priority.label }}</StatusTag>
      </span>
    </template>
  </van-cell>
</template>

<style scoped>
/* Uzun başlık satırı taşırmasın (bkz. SiteRowCell: Vant'ın başlık sütunu içeriği kadar genişler). */
.task-row :deep(.van-cell__title) {
  min-width: 0;
}

.task-row__title {
  font-weight: var(--weight-semibold);
}

/* Tamamlanan görev okunur kalır ama geri planda durur; üstü çizili değil, çünkü iş iptal edilmedi. */
.task-row__title--done {
  color: var(--text-muted);
}

.task-row__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1) var(--space-2);
  margin-top: 2px;
}

.task-row__who {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
