<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CompanyProfileForm } from '@/core/tenant/companyProfileForm'

const show = defineModel<boolean>('show', { required: true })
const form = defineModel<CompanyProfileForm>('form', { required: true })
const { busy, dirty } = defineProps<{ busy: boolean; dirty: boolean }>()
const emit = defineEmits<{ save: [] }>()
const editor = ref<FormInstance>()
const rules: FormRules<CompanyProfileForm> = {
  name: [{ required: true, whitespace: true, message: 'Firma adını yazın.', trigger: 'blur' }],
  email: [{ type: 'email', message: 'Geçerli bir e-posta adresi yazın.', trigger: 'blur' }],
}

async function submit() {
  if (busy || !dirty) return
  const valid = await editor.value?.validate().catch(() => false)
  if (valid) emit('save')
}
</script>

<template>
  <el-drawer v-model="show" title="Firma bilgilerini düzenle" size="540px" class="company-editor"
    :close-on-click-modal="!busy" :close-on-press-escape="!busy" :show-close="!busy"
    @closed="editor?.clearValidate()">
    <p class="company-editor__intro">Firma adı ve iletişim bilgileri çalışma alanınızda kullanılır.</p>
    <el-form ref="editor" :model="form" :rules="rules" label-position="top" :disabled="busy"
      @submit.prevent="submit">
      <el-form-item label="Firma adı" prop="name">
        <el-input v-model="form.name" maxlength="120" placeholder="Firma adı" />
      </el-form-item>
      <div class="company-editor__contact">
        <el-form-item label="Telefon" prop="phone">
          <el-input v-model="form.phone" maxlength="20" type="tel" placeholder="Telefon numarası" />
        </el-form-item>
        <el-form-item label="Şehir" prop="city">
          <el-input v-model="form.city" maxlength="60" placeholder="Şehir" />
        </el-form-item>
      </div>
      <el-form-item label="E-posta" prop="email">
        <el-input v-model="form.email" type="email" maxlength="254" placeholder="E-posta adresi" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="busy" @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="busy" :disabled="!dirty" @click="submit">Değişiklikleri kaydet</el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
.company-editor__intro { margin: 0 0 var(--space-6); color: var(--text-muted); font-size: var(--text-sm); line-height: 1.6; }
.company-editor__contact { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); }
@media (max-width: 560px) { .company-editor__contact { grid-template-columns: 1fr; gap: 0; } }
</style>

<style>
.company-editor.el-drawer { max-width: 100vw; }
.company-editor .el-drawer__header { margin-bottom: 0; padding: var(--space-6); border-bottom: 1px solid var(--border-soft); color: var(--text-strong); font-weight: var(--weight-semibold); }
.company-editor .el-drawer__body { padding: var(--space-6); }
.company-editor .el-drawer__footer { border-top: 1px solid var(--border-soft); padding: var(--space-4) var(--space-6); }
</style>
