<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { TaskView } from '@/core/api/generated/model'
import { dayTitle, todayIsoDate } from '@/core/format/dates'
import type { AssigneeChoice } from '@/core/tasks/assigneeChoices'
import { TASK_PRIORITY_OPTIONS } from '@/core/tasks/taskLabels'
import { formOf, type TaskForm } from '@/core/tasks/useSiteTasks'

/**
 * Görev açma ve düzenleme penceresi; şantiye kurma penceresiyle aynı kalıp (alttan açılır): ne yapılacak,
 * ne zamana kadar, kim yapacak, ne kadar acil, varsa not. Yalnızca başlık zorunludur: "Sonra atarım" ve
 * terminsiz görev geçerli cevaplardır, patronun akışını kesmez.
 */
const show = defineModel<boolean>('show', { required: true })
const { task, choices, saving } = defineProps<{ task: TaskView | null; choices: AssigneeChoice[]; saving: boolean }>()
const emit = defineEmits<{ submit: [form: TaskForm] }>()

/** Radyo düğmesi null taşıyamaz: sorumlusuz görev boş metinle seçilir. */
const LATER = ''
const EMPTY: TaskForm = { title: '', note: null, assigneeId: null, dueDate: null, priority: 'NORMAL' }
const today = new Date()
const minDate = new Date(today.getFullYear() - 1, 0, 1)
const maxDate = new Date(today.getFullYear() + 3, 11, 31)

const form = ref<TaskForm>({ ...EMPTY })
const pickingDate = ref(false)
const dateParts = ref<string[]>([])
const assignee = computed({
  get: () => form.value.assigneeId ?? LATER,
  set: (id: string) => (form.value.assigneeId = id || null),
})
const note = computed({ get: () => form.value.note ?? '', set: (text: string) => (form.value.note = text) })

// Düzenlemede görevin bilgileriyle, açarken boş gelir.
watch(show, (open) => {
  if (open) form.value = task ? formOf(task) : { ...EMPTY }
})

function openDatePicker() {
  dateParts.value = (form.value.dueDate ?? todayIsoDate()).split('-')
  pickingDate.value = true
}

function pickDate({ selectedValues }: { selectedValues: string[] }) {
  form.value.dueDate = selectedValues.join('-')
  pickingDate.value = false
}

/** Tarih seçicinin ikinci düğmesi "Kaldır"dır: termin tek dokunuşla silinir. */
function clearDate() {
  form.value.dueDate = null
  pickingDate.value = false
}

function submit() {
  emit('submit', { ...form.value, title: form.value.title.trim(), note: form.value.note?.trim() || null })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body">
    <van-form class="task-form" @submit="submit">
      <h2 class="task-form__title">{{ task ? 'Görevi düzenle' : 'Yeni görev' }}</h2>
      <van-cell-group inset class="task-form__fields">
        <van-field v-model="form.title" label="Ne yapılacak" placeholder="Kalıp sökümü" maxlength="200"
          :rules="[{ required: true, message: 'Görevin ne olduğunu yaz' }]" />
        <van-field :model-value="form.dueDate ? dayTitle(form.dueDate) : ''" label="Termin" placeholder="İsteğe bağlı"
          readonly is-link @click="openDatePicker" />
        <van-field v-model="note" label="Not" type="textarea" rows="2" autosize maxlength="2000"
          placeholder="İsteğe bağlı" />
      </van-cell-group>
      <section v-if="choices.length" class="task-form__block">
        <strong>Kim yapacak</strong>
        <van-radio-group v-model="assignee" class="task-form__block">
          <van-radio v-for="choice in choices" :key="choice.id" :name="choice.id">{{ choice.label }}</van-radio>
          <van-radio :name="LATER">Sonra atarım</van-radio>
        </van-radio-group>
      </section>
      <section class="task-form__block">
        <strong>Öncelik</strong>
        <van-radio-group v-model="form.priority" direction="horizontal">
          <van-radio v-for="option in TASK_PRIORITY_OPTIONS" :key="option.value" :name="option.value">
            {{ option.label }}
          </van-radio>
        </van-radio-group>
      </section>
      <van-button type="primary" native-type="submit" block round :loading="saving">
        {{ task ? 'Kaydet' : 'Oluştur' }}
      </van-button>
    </van-form>
    <van-popup v-model:show="pickingDate" position="bottom" round teleport="body">
      <van-date-picker v-model="dateParts" title="Termin" :min-date="minDate" :max-date="maxDate"
        cancel-button-text="Kaldır" confirm-button-text="Seç" @confirm="pickDate" @cancel="clearDate" />
    </van-popup>
  </van-popup>
</template>

<style scoped>
.task-form {
  display: grid;
  gap: var(--space-4);
  max-height: 85dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.task-form__title {
  margin: 0;
  font-size: 18px;
}

/* Beyaz pencerede beyaz grup kaybolmasın: alanlar hafif zeminli bir blok (gönderi düzeltme penceresi gibi). */
.task-form__fields {
  --van-cell-background: var(--surface-muted);
}

.task-form__block {
  display: grid;
  gap: var(--space-3);
}
</style>
