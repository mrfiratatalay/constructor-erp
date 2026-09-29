<script setup lang="ts">
import { reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { TenantDetail } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { useTenantActions } from '@/core/admin/useTenantActions'

/** Firmanın kimlik bilgilerini platform tarafında düzeltmek (müşteri kendi Firma sayfasından da düzeltebilir). */
const { tenant } = defineProps<{ tenant: TenantDetail }>()
const show = defineModel<boolean>('show', { required: true })
const { update } = useTenantActions(() => tenant.summary.id)
const form = reactive({ name: '', phone: '', email: '', city: '' })

watch(show, (open) => open && Object.assign(form, {
  name: tenant.summary.name, phone: tenant.phone ?? '', email: tenant.email ?? '', city: tenant.summary.city ?? '',
}))

async function submit() {
  try {
    await update({ name: form.name, phone: form.phone || null, email: form.email || null, city: form.city || null })
    show.value = false
    ElMessage.success('Firma bilgileri güncellendi.')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog v-model="show" title="Firma bilgileri" width="520px">
    <el-form label-position="top" @submit.prevent="submit">
      <el-form-item label="Firma adı" required><el-input v-model="form.name" maxlength="120" /></el-form-item>
      <el-form-item label="Telefon"><el-input v-model="form.phone" maxlength="20" /></el-form-item>
      <el-form-item label="E-posta"><el-input v-model="form.email" maxlength="254" /></el-form-item>
      <el-form-item label="Şehir"><el-input v-model="form.city" maxlength="60" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" @click="submit">Kaydet</el-button>
    </template>
  </el-dialog>
</template>
