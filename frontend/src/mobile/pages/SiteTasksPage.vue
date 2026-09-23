<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
import { ListChecks } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { TaskView, TaskViewStatus } from '@/core/api/generated/model'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { assigneeChoices } from '@/core/tasks/assigneeChoices'
import { canDeleteTask } from '@/core/tasks/taskPermissions'
import { useSiteTasks, type TaskForm } from '@/core/tasks/useSiteTasks'
import TaskFormPopup from '@/mobile/organisms/TaskFormPopup.vue'
import TaskRowCell from '@/mobile/organisms/TaskRowCell.vue'
import TaskSheet from '@/mobile/organisms/TaskSheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Şantiyenin görevleri; WhatsApp'ta grup bilgisindeki "Medya, bağlantılar ve belgeler" gibi ayrı bir sayfa.
 * Açık görevler termine göre, tamamlananlar en altta "Tamamlanan N görev" olarak (şantiye listesi gibi).
 * Göreve dokununca ayrıntısı alttan açılır; durum orada tek dokunuşla değişir.
 */
const route = useRoute()
const siteId = computed(() => String(route.params.siteId))
const { data: site } = useGetSite(siteId)
const { data: user } = useCurrentUser()
const { open, done, isLoading, isSaving, createTask, saveTask, moveTask, deleteTask } = useSiteTasks(siteId)
const choices = computed(() => (site.value ? assigneeChoices(site.value, user.value) : []))
const formOpen = ref(false)
const editing = ref<TaskView | null>(null)
const selectedId = ref<string | null>(null)
const showDone = ref(false)
/** Panel hep güncel görevi gösterir: durum değişince liste yenilenir, panel de. */
const selected = computed(() => [...open.value, ...done.value].find((task) => task.id === selectedId.value) ?? null)

/** Hatalar tek yerden, kullanıcının anlayacağı Türkçe mesajla gösterilir. */
async function attempt(action: () => Promise<unknown>) {
  try {
    await action()
    return true
  } catch (error) {
    showFailToast(errorMessage(error))
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

/** Silmek onay ister: görev ve bilgileri kalıcı olarak gider. */
async function remove(task: TaskView) {
  const confirmed = await showConfirmDialog({
    title: 'Görev silinsin mi?',
    message: `"${task.title}" kalıcı olarak silinir.`,
    confirmButtonText: 'Sil',
    confirmButtonColor: 'var(--status-danger)',
    cancelButtonText: 'Vazgeç',
  }).then(() => true, () => false)
  if (!confirmed) return
  selectedId.value = null
  if (await attempt(() => deleteTask(task))) showSuccessToast('Silindi')
}
</script>

<template>
  <MobilePage title="Görevler" :subtitle="site?.name ?? ''" back>
    <template #action>
      <van-button size="small" type="primary" round @click="openForm(null)">Görev ekle</van-button>
    </template>
    <van-skeleton v-if="isLoading" :row="4" />
    <van-cell-group v-else-if="open.length" inset>
      <TaskRowCell v-for="task in open" :key="task.id" :task="task" @open="selectedId = task.id" />
    </van-cell-group>
    <van-empty v-else-if="!done.length" description="Henüz görev yok. Yukarıdaki düğmeyle ilk görevi aç.">
      <template #image><ListChecks :size="48" class="tasks__empty-icon" /></template>
    </van-empty>
    <van-cell-group v-if="done.length" inset>
      <van-cell :title="`Tamamlanan ${done.length} görev`" is-link :arrow-direction="showDone ? 'up' : 'down'"
        @click="showDone = !showDone" />
      <template v-if="showDone">
        <TaskRowCell v-for="task in done" :key="task.id" :task="task" @open="selectedId = task.id" />
      </template>
    </van-cell-group>
    <TaskSheet :task="selected" :can-delete="!!selected && canDeleteTask(selected, user)" @close="selectedId = null"
      @edit="openForm" @move="move" @delete="remove" />
    <TaskFormPopup v-model:show="formOpen" :task="editing" :choices="choices" :saving="isSaving" @submit="onSubmit" />
  </MobilePage>
</template>

<style scoped>
.tasks__empty-icon {
  color: var(--text-subtle);
}
</style>
