<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus'
import type { SetupForms } from '@/core/onboarding/setupSteps'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/** Kurulumun ilk adımı: firmanın adı, iletişim bilgileri ve logosu. Logo hemen yüklenir, önizlemesi yanında görünür. */
const { logoUrl, isUploading } = defineProps<{ logoUrl: string | null; isUploading: boolean }>()
const company = defineModel<SetupForms['company']>({ required: true })
const emit = defineEmits<{ upload: [file: File] }>()
const onUpload = async (options: UploadRequestOptions) => emit('upload', options.file)
</script>

<template>
  <div class="setup-company">
    <div class="setup-company__logo">
      <CompanyLogo :name="company.name || 'Firma'" :logo-url="logoUrl" :size="72" />
      <div>
        <el-upload :show-file-list="false" accept="image/png,image/jpeg,image/webp" :http-request="onUpload">
          <el-button :loading="isUploading">{{ logoUrl ? 'Logoyu değiştir' : 'Logo yükle' }}</el-button>
        </el-upload>
        <small>PNG, JPEG ya da WEBP · en fazla 2 MB. Ekibiniz uygulamada bu logoyu görür.</small>
      </div>
    </div>
    <el-form label-position="top" @submit.prevent>
      <el-form-item label="Firma adı" required>
        <el-input v-model="company.name" maxlength="120" size="large" placeholder="ör. Yılmaz İnşaat A.Ş." />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Telefon"><el-input v-model="company.phone" maxlength="20" /></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Şehir"><el-input v-model="company.city" maxlength="60" /></el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Firma e-postası">
        <el-input v-model="company.email" type="email" maxlength="254" placeholder="info@firma.com" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.setup-company__logo {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  padding: var(--space-4);
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-lg);
}

.setup-company__logo small {
  display: block;
  margin-top: var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-xs);
}
</style>
