<script setup lang="ts">
import { computed } from 'vue'
import type { TaskView } from '@/core/api/generated/model'
import { dueLabel } from '@/core/tasks/dueLabel'
import { priorityTag, statusTag } from '@/core/tasks/taskLabels'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'

/**
 * Görev listesindeki satır; şantiye ve ekip listelerindeki satırın aynısı: başlık, sağda termin, altında kime
 * verildiği. "Yapılacak" varsayılandır, yazılmaz; "Devam ediyor", "Kontrolde", "Eksik var" ve sıradan sapan
 * öncelik etiket olur.
 */
const { task, selected = false } = defineProps<{ task: TaskView; selected?: boolean }>()
const emit = defineEmits<{ select: [] }>()

const due = computed(() => dueLabel(task))
const priority = computed(() => priorityTag(task.priority))
const status = computed(() => statusTag(task.status))
const hasDetail = computed(() => !!task.assignee || !!status.value || !!priority.value)
</script>

<template>
  <ListRow :selected="selected" @select="emit('select')">
    <template #title>
      <span :class="{ 'task-row__title--done': task.status === 'DONE' }">{{ task.title }}</span>
    </template>
    <template #meta>
      <StatusTag v-if="due" :tone="due.tone">{{ due.label }}</StatusTag>
    </template>
    <template v-if="hasDetail">
      <span v-if="task.assignee">{{ task.assignee.fullName }}</span>
      <StatusTag v-if="status" :tone="status.tone">{{ status.label }}</StatusTag>
      <StatusTag v-if="priority" :tone="priority.tone">{{ priority.label }}</StatusTag>
    </template>
  </ListRow>
</template>

<style scoped>
/* Tamamlanan görev okunur kalır ama geri planda durur; üstü çizili değil, çünkü iş iptal edilmedi. */
.task-row__title--done {
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
}
</style>
