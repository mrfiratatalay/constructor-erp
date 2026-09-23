<script setup lang="ts">
import { computed } from 'vue'
import type { TaskView, TaskViewStatus } from '@/core/api/generated/model'
import { dateTime, dayTitle } from '@/core/format/dates'
import { dueLabel } from '@/core/tasks/dueLabel'
import { TASK_PRIORITY, TASK_STATUS_OPTIONS } from '@/core/tasks/taskLabels'
import StatusTag from '@/desktop/atoms/StatusTag.vue'

/**
 * Göreve tıklayınca sağdan açılan ayrıntı; şantiye bilgi çekmecesiyle aynı kalıp. Durum tek tıkla değişir;
 * kim, ne zamana kadar, öncelik, not ve kimin açtığı yazar, olmayan bilgi satırı çıkmaz. Düzenle formu açar;
 * Sil en altta ve kırmızıdır, yalnızca açan kişi ve patron görür.
 */
const { task, canDelete } = defineProps<{ task: TaskView | null; canDelete: boolean }>()
const emit = defineEmits<{
  close: []
  edit: [task: TaskView]
  move: [task: TaskView, status: TaskViewStatus]
  delete: [task: TaskView]
}>()

const due = computed(() => (task ? dueLabel(task) : null))

function move(status: string | number | boolean | undefined) {
  if (task) emit('move', task, status as TaskViewStatus)
}
</script>

<template>
  <el-drawer :model-value="task !== null" size="380px" :with-header="false"
    @update:model-value="(open: boolean) => !open && emit('close')">
    <div v-if="task" class="task-drawer">
      <header class="task-drawer__head">
        <h2 class="task-drawer__title">{{ task.title }}</h2>
        <el-button @click="emit('edit', task)">Düzenle</el-button>
      </header>
      <el-radio-group :model-value="task.status" @change="move">
        <el-radio-button v-for="option in TASK_STATUS_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </el-radio-button>
      </el-radio-group>
      <dl class="task-drawer__facts">
        <template v-if="task.assignee">
          <dt>Kim yapacak</dt>
          <dd>{{ task.assignee.fullName }}</dd>
        </template>
        <template v-if="task.dueDate">
          <dt>Termin</dt>
          <dd>{{ dayTitle(task.dueDate) }} <StatusTag v-if="due" :tone="due.tone">{{ due.label }}</StatusTag></dd>
        </template>
        <template v-if="task.priority !== 'NORMAL'">
          <dt>Öncelik</dt>
          <dd>{{ TASK_PRIORITY[task.priority] }}</dd>
        </template>
        <dt>Açan</dt>
        <dd>{{ task.createdBy.fullName }} · {{ dateTime(task.createdAt) }}</dd>
      </dl>
      <p v-if="task.note" class="task-drawer__note">{{ task.note }}</p>
      <el-button v-if="canDelete" type="danger" text class="task-drawer__delete" @click="emit('delete', task)">
        Görevi sil
      </el-button>
    </div>
  </el-drawer>
</template>

<style scoped>
.task-drawer {
  display: grid;
  gap: var(--space-4);
  justify-items: start;
}

.task-drawer__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
}

.task-drawer__title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

/* Etiket solda, değer sağda: kişi ayrıntısındaki bölüm başlıklarıyla aynı sakin, büyük harfli etiket. */
.task-drawer__facts {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2) var(--space-4);
  width: 100%;
  margin: 0;
}

.task-drawer__facts dt {
  color: var(--text-subtle);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
}

.task-drawer__facts dd {
  margin: 0;
}

/* Not, yazıldığı gibi okunur: satır sonları korunur. */
.task-drawer__note {
  width: 100%;
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
  white-space: pre-wrap;
}

.task-drawer__delete {
  margin-left: 0;
}
</style>
