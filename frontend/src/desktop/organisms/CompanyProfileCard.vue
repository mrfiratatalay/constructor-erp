<script setup lang="ts">
import { ref, watch } from 'vue'
import { isAxiosError } from 'axios'
import { ElMessage, type UploadRequestOptions } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { useCompanyProfile } from '@/core/tenant/useCompanyProfile'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'
import CompanyContactDetails from '@/desktop/molecules/CompanyContactDetails.vue'
import CompanyProfileEditor from '@/desktop/molecules/CompanyProfileEditor.vue'

const { profile, form, save, isSaving, uploadLogo, removeLogo, isUploading,
  isLoading, isError, refetch, resetForm, isDirty, isBusy, isRemoving } = useCompanyProfile()
const editing = ref(false)
watch(editing, (open) => { if (!open) resetForm() })

function showError(error: unknown) {
  ElMessage.error(error instanceof Error && !isAxiosError(error) ? error.message : errorMessage(error))
}

function editProfile() {
  if (isBusy.value) return
  resetForm()
  editing.value = true
}

async function onUpload(options: UploadRequestOptions) {
  if (isBusy.value || editing.value) return
  try {
    await uploadLogo(options.file)
    ElMessage.success('Logo güncellendi.')
  } catch (error) {
    showError(error)
  }
}

async function onRemoveLogo() {
  if (isBusy.value || editing.value) return
  try {
    await removeLogo()
    ElMessage.success('Logo kaldırıldı.')
  } catch (error) {
    showError(error)
  }
}

async function onSave() {
  if (isBusy.value || !isDirty.value) return
  try {
    await save()
    editing.value = false
    ElMessage.success('Firma bilgileri kaydedildi.')
  } catch (error) {
    showError(error)
  }
}
</script>

<template>
  <el-card shadow="never" class="company-profile">
    <template #header>
      <div class="company-profile__header">
        <h2>Firma bilgileri</h2>
        <el-button v-if="profile" size="small" :disabled="isBusy" @click="editProfile">Düzenle</el-button>
      </div>
    </template>
    <el-skeleton v-if="isLoading" :rows="5" animated />
    <div v-else-if="isError" class="company-profile__state">
      <p>Firma bilgileri yüklenemedi.</p>
      <el-button size="small" @click="refetch()">Yeniden dene</el-button>
    </div>
    <template v-else-if="profile">
      <div class="company-profile__identity">
        <CompanyLogo :name="profile.name" :logo-url="profile.logoUrl" :size="64" />
        <div><span>Firma çalışma alanı</span><h3>{{ profile.name }}</h3></div>
      </div>
      <div class="company-profile__branding">
        <div class="company-profile__logo-actions">
          <el-upload :show-file-list="false" accept="image/png,image/jpeg,image/webp" :http-request="onUpload"
            :disabled="isBusy || editing">
            <el-button size="small" :loading="isUploading" :disabled="isBusy || editing">
              {{ profile.logoUrl ? 'Logoyu değiştir' : 'Logo yükle' }}
            </el-button>
          </el-upload>
          <el-button v-if="profile.logoUrl" size="small" text type="danger" :loading="isRemoving"
            :disabled="isBusy || editing" @click="onRemoveLogo">Kaldır</el-button>
        </div>
        <small>PNG, JPEG veya WEBP · En fazla 2 MB</small>
      </div>
      <CompanyContactDetails :profile="profile" />
    </template>
    <el-empty v-else description="Firma bilgileri bulunamadı." :image-size="56" />
    <CompanyProfileEditor v-model:show="editing" :form="form" :busy="isBusy || isSaving" :dirty="isDirty"
      @save="onSave" />
  </el-card>
</template>

<style scoped>
.company-profile { height: 100%; border-color: var(--border-soft); border-radius: var(--radius-lg); }
.company-profile :deep(.el-card__header) { padding: var(--space-5) var(--space-6); border-bottom-color: var(--border-soft); }
.company-profile :deep(.el-card__body) { padding: var(--space-6); }
.company-profile__header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.company-profile__header h2 { margin: 0; font-size: var(--text-base); font-weight: var(--weight-semibold); }
.company-profile__identity { display: flex; align-items: center; gap: var(--space-4); }
.company-profile__identity > div { min-width: 0; }
.company-profile__identity span { color: var(--text-subtle); font-size: var(--text-xs); }
.company-profile__identity h3 { margin: var(--space-1) 0 0; color: var(--text-strong); font-size: var(--text-xl); font-weight: var(--weight-bold); overflow-wrap: anywhere; }
.company-profile__branding { display: grid; justify-items: start; gap: var(--space-2); margin: var(--space-4) 0 var(--space-5); }
.company-profile__logo-actions { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
.company-profile__branding small { font-size: var(--text-xs); color: var(--text-subtle); }
.company-profile__state { display: grid; justify-items: start; gap: var(--space-3); color: var(--text-muted); }
.company-profile__state p { margin: 0; }
</style>
