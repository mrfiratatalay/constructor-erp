<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast, showSuccessToast, type UploaderFileListItem } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { companyLogoProblem } from '@/core/tenant/companyProfileForm'
import { useCompanyProfile } from '@/core/tenant/useCompanyProfile'
import CompanyProfileEdit from '@/mobile/molecules/CompanyProfileEdit.vue'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

const { profile, form, save, resetForm, isDirty, isLoading, isError, refetch,
  isSaving, uploadLogo, removeLogo, isUploading, isRemoving, isBusy } = useCompanyProfile()
const editing = ref(false)
const saveError = ref('')
const retrying = ref(false)
const messageOf = (error: unknown) => error instanceof Error && error.name === 'Error' ? error.message : errorMessage(error)

function startEdit() {
  if (!profile.value || isBusy.value) return
  resetForm()
  saveError.value = ''
  editing.value = true
}

function cancelEdit() {
  if (isBusy.value) return
  editing.value = false
  saveError.value = ''
  resetForm()
}

function beforeLogo(file: File | File[]) {
  if (isBusy.value || editing.value) return false
  const logo = Array.isArray(file) ? file[0] : file
  if (!logo) return false
  const problem = companyLogoProblem(logo)
  if (problem) { showFailToast(problem); return false }
  return true
}

async function onLogo(item: UploaderFileListItem | UploaderFileListItem[]) {
  const file = (Array.isArray(item) ? item[0] : item)?.file
  if (!file || isBusy.value || editing.value) return
  try {
    await uploadLogo(file)
    showSuccessToast('Logo güncellendi')
  } catch (error) {
    showFailToast(messageOf(error))
  }
}

async function onRemoveLogo() {
  if (isBusy.value || editing.value || !profile.value?.logoUrl) return
  try {
    await removeLogo()
    showSuccessToast('Logo kaldırıldı')
  } catch (error) {
    showFailToast(messageOf(error))
  }
}

async function onSave() {
  if (isBusy.value || !isDirty.value || !form.name.trim()) return
  saveError.value = ''
  try {
    await save()
    editing.value = false
    showSuccessToast('Firma bilgileri kaydedildi')
  } catch (error) {
    saveError.value = messageOf(error)
    showFailToast(saveError.value)
  }
}

async function retry() {
  if (retrying.value) return
  retrying.value = true
  try { await refetch() } finally { retrying.value = false }
}
</script>

<template>
  <section class="company-profile">
    <van-skeleton v-if="isLoading" title avatar :row="3" avatar-size="64" />
    <van-empty v-else-if="isError" image="error" description="Firma bilgileri yüklenemedi.">
      <van-button size="small" type="primary" :loading="retrying" @click="retry">Yeniden dene</van-button>
    </van-empty>
    <template v-else-if="profile">
      <header class="company-profile__header">
        <h2>Firma profili</h2>
        <van-button icon="edit" size="small" plain :disabled="isBusy" @click="startEdit">Düzenle</van-button>
      </header>
      <div class="company-profile__identity">
        <CompanyLogo :name="profile.name" :logo-url="profile.logoUrl" :size="64" />
        <div><span>FİRMA</span><h3>{{ profile.name }}</h3></div>
      </div>
      <div class="company-profile__logo-actions">
        <van-uploader :after-read="onLogo" :before-read="beforeLogo" accept="image/png,image/jpeg,image/webp"
          :disabled="isBusy || editing" :max-count="1" :preview-image="false">
          <van-button size="small" plain icon="photograph" :disabled="isBusy || editing" :loading="isUploading">
            {{ profile.logoUrl ? 'Logoyu değiştir' : 'Logo ekle' }}
          </van-button>
        </van-uploader>
        <van-button v-if="profile.logoUrl" size="small" plain :disabled="isBusy || editing" :loading="isRemoving"
          @click="onRemoveLogo">Kaldır</van-button>
      </div>
      <dl class="company-profile__contacts">
        <div><dt><van-icon name="location-o" /><span>Şehir</span></dt><dd :class="{ 'is-empty': !profile.city }">{{ profile.city || 'Şehir eklenmedi' }}</dd></div>
        <div><dt><van-icon name="phone-o" /><span>Telefon</span></dt><dd :class="{ 'is-empty': !profile.phone }">{{ profile.phone || 'Telefon eklenmedi' }}</dd></div>
        <div><dt><van-icon name="envelop-o" /><span>E-posta</span></dt><dd :class="{ 'is-empty': !profile.email }">{{ profile.email || 'E-posta eklenmedi' }}</dd></div>
      </dl>
    </template>
    <van-empty v-else description="Firma profili bulunamadı.">
      <van-button size="small" :loading="retrying" @click="retry">Yeniden dene</van-button>
    </van-empty>
  </section>
  <CompanyProfileEdit :show="editing" v-model:name="form.name" v-model:phone="form.phone" v-model:email="form.email"
    v-model:city="form.city" :busy="isBusy" :saving="isSaving" :dirty="isDirty" :error="saveError"
    @cancel="cancelEdit" @save="onSave" />
</template>

<style scoped src="./companyProfileForm.css"></style>
