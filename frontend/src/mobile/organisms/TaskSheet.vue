<script setup lang="ts">
import { computed } from 'vue'
import type { TaskView, TaskViewStatus } from '@/core/api/generated/model'
import { dateTime, dayTitle } from '@/core/format/dates'
import { dueLabel } from '@/core/tasks/dueLabel'
import { TASK_PRIORITY, TASK_STATUS_OPTIONS } from '@/core/tasks/taskLabels'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

/**
 * Göreve dokununca alttan açılan ayrıntı (ekipteki kişi paneliyle aynı kalıp): durum tek dokunuşla
 * değişir; kim, ne zamana kadar, öncelik, not ve kimin açtığı yazar. Olmayan bilgi satırı hiç çıkmaz.
 * Düzenle formu açar; Sil en altta ve kırmızıdır, yalnızca açan kişi ve patron görür.
 */
const { task, canDelete } = defineProps<{ task: TaskView | null; canDelete: boolean }>()
const emit = defineEmits<{
  close: []
  edit: [task: TaskView]
  move: [task: TaskView, status: TaskViewStatus]
  delete: [task: TaskView]
}>()

const due = computed(() => (task ? dueLabel(task) : null))
</script>

<template>
  <van-popup :show="task !== null" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @update:show="(open: boolean) => !open && emit('close')">
    <section v-if="task" class="task-sheet">
      <h2 class="task-sheet__title">{{ task.title }}</h2>
      <van-radio-group :model-value="task.status" direction="horizontal" class="task-sheet__status"
        @update:model-value="(status: TaskViewStatus) => emit('move', task!, status)">
        <van-radio v-for="option in TASK_STATUS_OPTIONS" :key="option.value" :name="option.value">
          {{ option.label }}
        </van-radio>
      </van-radio-group>
      <van-cell-group inset class="task-sheet__group">
        <van-cell v-if="task.assignee" title="Kim yapacak" :value="task.assignee.fullName" />
        <van-cell v-if="task.dueDate" title="Termin" :value="dayTitle(task.dueDate)">
          <template v-if="due" #label><StatusTag :tone="due.tone">{{ due.label }}</StatusTag></template>
        </van-cell>
        <van-cell v-if="task.priority !== 'NORMAL'" title="Öncelik" :value="TASK_PRIORITY[task.priority]" />
        <van-cell title="Açan" :value="task.createdBy.fullName" :label="dateTime(task.createdAt)" />
      </van-cell-group>
      <p v-if="task.note" class="task-sheet__note">{{ task.note }}</p>
      <van-button round block @click="emit('edit', task)">Düzenle</van-button>
      <van-button v-if="canDelete" round block plain type="danger" @click="emit('delete', task)">Görevi sil</van-button>
    </section>
  </van-popup>
</template>

<style scoped>
.task-sheet {
  display: grid;
  gap: var(--space-3);
  max-height: 86dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) var(--space-4);
}

.task-sheet__title {
  margin: 0;
  padding-right: var(--space-8);
  font-size: var(--text-lg);
}

.task-sheet__status {
  gap: var(--space-2) 0;
}

/* Beyaz pencerede beyaz grup kaybolmasın: bölüm hafif zeminli bir blok (kişi paneli gibi). */
.task-sheet__group {
  --van-cell-background: var(--surface-muted);
}

/* Not, yazıldığı gibi okunur: satır sonları korunur. */
.task-sheet__note {
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--surface-muted);
  white-space: pre-wrap;
}
</style>
