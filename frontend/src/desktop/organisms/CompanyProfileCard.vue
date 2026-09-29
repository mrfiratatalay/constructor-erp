<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { useCompanyProfile } from '@/core/tenant/useCompanyProfile'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/** Firmanın kimliği: logo (PNG, JPEG, WEBP; en fazla 2 MB) ve iletişim bilgileri. Çalışma alanının markası buradan. */
const { profile, form, save, isSaving, uploadLogo, removeLogo, isUploading } = useCompanyProfile()

async function onUpload(options: UploadRequestOptions) {
  try {
    await uploadLogo(options.file)
    ElMessage.success('Logo güncellendi.')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

async function onSave() {
  try {
    await save()
    ElMessage.success('Firma bilgileri kaydedildi.')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-card v-if="profile" shadow="never" class="profile-card">
    <template #header><strong>Firma bilgileri</strong></template>
    <div class="profile-card__logo">
      <CompanyLogo :name="profile.name" :logo-url="profile.logoUrl" :size="80" />
      <div class="profile-card__logo-actions">
        <el-upload :show-file-list="false" accept="image/png,image/jpeg,image/webp" :http-request="onUpload">
          <el-button :loading="isUploading">{{ profile.logoUrl ? 'Logoyu değiştir' : 'Logo yükle' }}</el-button>
        </el-upload>
        <el-button v-if="profile.logoUrl" text type="danger" @click="removeLogo">Kaldır</el-button>
        <small>PNG, JPEG ya da WEBP · en fazla 2 MB. Logo yoksa baş harfler görünür.</small>
      </div>
    </div>
    <el-form label-position="top" @submit.prevent="onSave">
      <el-form-item label="Firma adı" required>
        <el-input v-model="form.name" maxlength="120" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Telefon"><el-input v-model="form.phone" maxlength="20" /></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Şehir"><el-input v-model="form.city" maxlength="60" /></el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="E-posta"><el-input v-model="form.email" type="email" maxlength="254" /></el-form-item>
      <el-button type="primary" native-type="submit" :loading="isSaving">Kaydet</el-button>
    </el-form>
  </el-card>
</template>

<style scoped>
.profile-card__logo {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin-bottom: var(--space-5);
}

.profile-card__logo-actions {
  display: grid;
  justify-items: start;
  gap: var(--space-2);
}

.profile-card__logo-actions small {
  color: var(--text-muted);
}

.profile-card__logo-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
