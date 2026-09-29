<script setup lang="ts">
import { showFailToast, showSuccessToast } from 'vant'
import type { UploaderFileListItem } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { useCompanyProfile } from '@/core/tenant/useCompanyProfile'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/** Firmanın kimliği telefondan: logo (galeriden ya da kameradan) ve iletişim bilgileri. */
const { profile, form, save, isSaving, uploadLogo, removeLogo, isUploading } = useCompanyProfile()

async function onLogo(item: UploaderFileListItem | UploaderFileListItem[]) {
  const file = (Array.isArray(item) ? item[0] : item)?.file
  if (!file) return
  try {
    await uploadLogo(file)
    showSuccessToast('Logo güncellendi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

async function onSave() {
  try {
    await save()
    showSuccessToast('Kaydedildi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <template v-if="profile">
    <div class="company-form__logo">
      <CompanyLogo :name="profile.name" :logo-url="profile.logoUrl" :size="84" />
      <van-uploader :after-read="onLogo" accept="image/png,image/jpeg,image/webp" :max-count="1" :preview-image="false">
        <van-button size="small" round :loading="isUploading">
          {{ profile.logoUrl ? 'Logoyu değiştir' : 'Logo yükle' }}
        </van-button>
      </van-uploader>
      <van-button v-if="profile.logoUrl" size="small" round plain type="danger" @click="removeLogo">Kaldır</van-button>
    </div>
    <van-form @submit="onSave">
      <van-cell-group inset title="Firma bilgileri">
        <van-field v-model="form.name" label="Firma adı" maxlength="120" required
          :rules="[{ required: true, message: 'Firma adı gerekli' }]" />
        <van-field v-model="form.phone" label="Telefon" type="tel" maxlength="20" />
        <van-field v-model="form.email" label="E-posta" type="email" maxlength="254" />
        <van-field v-model="form.city" label="Şehir" maxlength="60" />
      </van-cell-group>
      <div class="company-form__save">
        <van-button type="primary" block round native-type="submit" :loading="isSaving">Kaydet</van-button>
      </div>
    </van-form>
  </template>
</template>

<style scoped>
.company-form__logo {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
}

.company-form__save {
  padding: var(--space-4) var(--space-4) 0;
}
</style>
