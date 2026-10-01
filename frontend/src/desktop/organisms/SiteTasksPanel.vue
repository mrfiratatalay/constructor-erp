<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChevronLeft, ListChecks } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { TaskView, TaskViewStatus } from '@/core/api/generated/model'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { assigneeChoices } from '@/core/tasks/assigneeChoices'
import { canDeleteTask } from '@/core/tasks/taskPermissions'
import { useSiteTasks, type TaskForm } from '@/core/tasks/useSiteTasks'
import { confirmAction } from '@/desktop/confirmAction'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import TaskDrawer from '@/desktop/organisms/TaskDrawer.vue'
import TaskFormDialog from '@/desktop/organisms/TaskFormDialog.vue'
import TaskRow from '@/desktop/organisms/TaskRow.vue'

/**
 * Sağ panelde şantiyenin görevleri (akışın yerine açılır; ‹ akışa döner). Açık görevler termine göre,
 * tamamlananlar altta "Tamamlanan N görev" olarak, şantiye listesiyle aynı kalıpta. Göreve tıklayınca
 * ayrıntısı sağdan çekmece olarak açılır; durum orada tek tıkla değişir.
 */
const { siteId } = defineProps<{ siteId: string }>()
const router = useRouter()
const { data: site } = useGetSite(() => siteId)
const { data: user } = useCurrentUser()
const { open, done, isLoading, isSaving, createTask, saveTask, moveTask, deleteTask } = useSiteTasks(() => siteId)
const choices = computed(() => (site.value ? assigneeChoices(site.value, user.value) : []))
const formOpen = ref(false)
const editing = ref<TaskView | null>(null)
const selectedId = ref<string | null>(null)
const showDone = ref(false)
/** Çekmece hep güncel görevi gösterir: durum değişince liste yenilenir, çekmece de. */
const selected = computed(() => [...open.value, ...done.value].find((task) => task.id === selectedId.value) ?? null)

/** Hatalar tek yerden, kullanıcının anlayacağı Türkçe mesajla gösterilir. */
async function attempt(action: () => Promise<unknown>) {
  try {
    await action()
    return true
  } catch (error) {
    ElMessage.error(errorMessage(error))
    return false
  }
}

function openForm(task: TaskView | null) {
  selectedId.value = null
  editing.value = task
  formOpen.value = true
}

async function onSubmit(form: TaskForm) {
  const target = editing.value
  if (await attempt(() => (target ? saveTask(target, form) : createTask(form)))) formOpen.value = false
}

function move(task: TaskView, status: TaskViewStatus) {
  void attempt(() => moveTask(task, status))
}

/** Silmek onay ister: görev ve bilgileri kalıcı olarak gider. Vazgeçmek hata değildir. */
async function remove(task: TaskView) {
  const confirmed = await confirmAction({ title: 'Görev silinsin mi?', message: `"${task.title}" kalıcı olarak silinir.`, confirm: 'Sil' })
  if (!confirmed) return
  selectedId.value = null
  if (await attempt(() => deleteTask(task))) ElMessage.success('Silindi')
}
</script>

<template>
  <DetailPane>
    <template #header>
      <div class="site-tasks__head">
        <el-button circle aria-label="Şantiyeye dön" @click="router.push({ name: 'siteFeed', params: { siteId } })">
          <ChevronLeft :size="18" />
        </el-button>
        <span class="site-tasks__title">
          <strong>Görevler</strong>
          <span>{{ site?.name }}</span>
        </span>
        <el-button type="primary" @click="openForm(null)">Görev ekle</el-button>
      </div>
    </template>
    <el-skeleton v-if="isLoading" :rows="4" animated />
    <div v-else-if="open.length" class="site-tasks__list">
      <TaskRow v-for="task in open" :key="task.id" :task="task" :selected="task.id === selectedId"
        @select="selectedId = task.id" />
    </div>
    <el-empty v-else-if="!done.length" :image-size="72" description="Henüz görev yok. Görev ekle ile ilk görevi aç.">
      <template #image><ListChecks :size="56" class="site-tasks__empty-icon" /></template>
    </el-empty>
    <template v-if="done.length">
      <el-button text class="site-tasks__more" @click="showDone = !showDone">
        Tamamlanan {{ done.length }} görev {{ showDone ? '⌃' : '›' }}
      </el-button>
      <div v-if="showDone" class="site-tasks__list">
        <TaskRow v-for="task in done" :key="task.id" :task="task" :selected="task.id === selectedId"
          @select="selectedId = task.id" />
      </div>
    </template>
  </DetailPane>
  <TaskDrawer :task="selected" :can-delete="!!selected && canDeleteTask(selected, user)" @close="selectedId = null"
    @edit="openForm" @move="move" @delete="remove" />
  <TaskFormDialog v-model:show="formOpen" :task="editing" :choices="choices" :saving="isSaving" @submit="onSubmit" />
</template>

<style scoped>
.site-tasks__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.site-tasks__title {
  display: grid;
  flex: 1;
  min-width: 0;
}

.site-tasks__title strong {
  font-size: var(--text-md);
  font-weight: var(--weight-black);
}

.site-tasks__title span {
  overflow: hidden;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Satırlar tek bir beyaz blokta: şantiye listesindeki satırların aynısı, panelin gri zemininde. */
.site-tasks__list {
  overflow: hidden;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}

.site-tasks__more {
  justify-self: start;
  padding: var(--space-2) var(--space-4);
}

.site-tasks__empty-icon {
  color: var(--border-strong);
}
</style>
