<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { TaskView } from '@/core/api/generated/model'
import type { AssigneeChoice } from '@/core/tasks/assigneeChoices'
import { TASK_PRIORITY_OPTIONS } from '@/core/tasks/taskLabels'
import { formOf, type TaskForm } from '@/core/tasks/useSiteTasks'

/**
 * Görev açma ve düzenleme penceresi; şantiye düzenleme penceresiyle aynı kalıp. Yalnızca başlık zorunludur:
 * sorumlu seçilmezse görev sonra atanır, termin boş kalabilir.
 */
const show = defineModel<boolean>('show', { required: true })
const { task, choices, saving } = defineProps<{ task: TaskView | null; choices: AssigneeChoice[]; saving: boolean }>()
const emit = defineEmits<{ submit: [form: TaskForm] }>()

const EMPTY: TaskForm = { title: '', note: null, assigneeId: null, dueDate: null, priority: 'NORMAL' }
const formRef = ref<FormInstance>()
const form = reactive<TaskForm>({ ...EMPTY })
const rules: FormRules = { title: [{ required: true, message: 'Görevin ne olduğunu yaz', trigger: 'blur' }] }

// Düzenlemede görevin bilgileriyle, açarken boş gelir.
watch(show, (open) => {
  if (open) Object.assign(form, task ? formOf(task) : EMPTY)
})

/** Temizlenen seçim kutusu ve tarih boş değer bırakır; backend'e "yok" olarak null gider. */
async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('submit', {
    ...form,
    title: form.title.trim(),
    note: form.note?.trim() || null,
    assigneeId: form.assigneeId || null,
    dueDate: form.dueDate || null,
  })
}
</script>

<template>
  <el-dialog v-model="show" :title="task ? 'Görevi düzenle' : 'Yeni görev'" width="520px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="Ne yapılacak" prop="title">
        <el-input v-model="form.title" maxlength="200" placeholder="Kalıp sökümü" />
      </el-form-item>
      <div class="task-form__row">
        <el-form-item label="Kim yapacak">
          <el-select v-model="form.assigneeId" placeholder="Sonra atarım" clearable>
            <el-option v-for="choice in choices" :key="choice.id" :label="choice.label" :value="choice.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Termin">
          <el-date-picker v-model="form.dueDate" type="date" value-format="YYYY-MM-DD" format="D MMMM YYYY"
            placeholder="İsteğe bağlı" clearable class="task-form__date" />
        </el-form-item>
      </div>
      <el-form-item label="Öncelik">
        <el-radio-group v-model="form.priority">
          <el-radio-button v-for="option in TASK_PRIORITY_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Not">
        <el-input v-model="form.note" type="textarea" :rows="3" maxlength="2000" placeholder="İsteğe bağlı" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">{{ task ? 'Kaydet' : 'Oluştur' }}</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.task-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.task-form__date {
  width: 100%;
}
</style>
