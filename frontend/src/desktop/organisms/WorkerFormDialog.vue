<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CreateWorkerRequest } from '@/core/api/generated/model'

/**
 * Yoklamadaki "＋ Personel ekle": yalnızca ad soyad ve (isteğe bağlı) görevi. Personel uygulamanın kullanıcısı
 * değildir; telefonu, girişi, davet bağlantısı yoktur. Kişi penceresiyle (MemberFormDialog) aynı kalıp.
 */
const show = defineModel<boolean>('show', { required: true })
const { saving } = defineProps<{ saving: boolean }>()
const emit = defineEmits<{ submit: [form: CreateWorkerRequest] }>()

const formRef = ref<FormInstance>()
const form = reactive({ fullName: '', trade: '' })
const rules: FormRules = { fullName: [{ required: true, whitespace: true, message: 'Ad soyad gerekli', trigger: 'blur' }] }

watch(show, (open) => {
  if (open) Object.assign(form, { fullName: '', trade: '' })
})

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (valid) emit('submit', { fullName: form.fullName.trim(), trade: form.trade.trim() || null })
}
</script>

<template>
  <el-dialog v-model="show" title="Personel ekle" width="440px" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="Ad soyad" prop="fullName">
        <el-input v-model="form.fullName" maxlength="120" placeholder="Ali Usta" />
      </el-form-item>
      <el-form-item label="Görevi">
        <el-input v-model="form.trade" maxlength="80" placeholder="İsteğe bağlı (ör. Kalıpçı)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">Ekle</el-button>
    </template>
  </el-dialog>
</template>
