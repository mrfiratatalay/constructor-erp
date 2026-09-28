<script setup lang="ts">
import { computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { assigneeChoices } from '@/core/tasks/assigneeChoices'
import { DUE_CHOICES, isPastDay } from '@/core/tasks/dueChoice'
import { useQuickTask } from '@/core/tasks/useQuickTask'

/**
 * Sohbetin ＋'sındaki "📋 Görev": yalnızca üç soru. Ne yapılacak? Kim yapacak? Ne zaman? (Bugün · Yarın · Tarih
 * seç). Öncelik ve not sorulmaz. Görev verilince sohbete görev kartı düşer; işin sorumlusu teslimi karttan yapar.
 */
const { site } = defineProps<{ site: SiteView }>()
const show = defineModel<boolean>('show', { required: true })
const { data: user } = useCurrentUser()
const choices = computed(() => assigneeChoices(site, user.value))
const { form, ready, reset, assign, isSaving } = useQuickTask(() => site.id)

watch(show, (open) => {
  if (open) reset()
})

async function submit() {
  if (!ready.value) return
  try {
    await assign()
    ElMessage.success('Görev verildi')
    show.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog v-model="show" title="📋 Görev" width="460px" append-to-body>
    <el-form label-position="top" @submit.prevent="submit">
      <el-form-item label="Ne yapılacak?">
        <el-input v-model="form.title" maxlength="200" placeholder="Kalıp sökülecek" aria-label="Ne yapılacak?" />
      </el-form-item>
      <el-form-item label="Kim yapacak?">
        <el-select v-model="form.assigneeId" filterable placeholder="Kişi seç" aria-label="Kim yapacak?"
          class="assign__select">
          <el-option v-for="choice in choices" :key="choice.id" :label="choice.label" :value="choice.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Ne zaman?">
        <el-space wrap>
          <el-radio-group v-model="form.due" aria-label="Ne zaman?">
            <el-radio-button v-for="choice in DUE_CHOICES" :key="choice.value" :value="choice.value">
              {{ choice.label }}
            </el-radio-button>
          </el-radio-group>
          <el-date-picker v-if="form.due === 'date'" v-model="form.date" type="date" value-format="YYYY-MM-DD"
            format="D MMMM YYYY" placeholder="Gün seç" :disabled-date="isPastDay" aria-label="Gün seç" />
        </el-space>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="large" :disabled="!ready" :loading="isSaving" @click="submit">
        📋 Görevi ver
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
/* Görev penceresindeki seçim kutusu gibi: alan sütunun tamamını kaplar. */
.assign__select {
  width: 100%;
}
</style>
