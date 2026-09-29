<script setup lang="ts">
import type { UploaderFileListItem } from 'vant'
import type { SetupForms } from '@/core/onboarding/setupSteps'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/** Kurulumun ilk adımı telefonda: logo (galeriden ya da kameradan) ve firma bilgileri. */
const { logoUrl, isUploading } = defineProps<{ logoUrl: string | null; isUploading: boolean }>()
const company = defineModel<SetupForms['company']>({ required: true })
const emit = defineEmits<{ upload: [file: File] }>()

function onLogo(item: UploaderFileListItem | UploaderFileListItem[]) {
  const file = (Array.isArray(item) ? item[0] : item)?.file
  if (file) emit('upload', file)
}
</script>

<template>
  <div class="setup-logo">
    <CompanyLogo :name="company.name || 'Firma'" :logo-url="logoUrl" :size="72" />
    <van-uploader :after-read="onLogo" accept="image/png,image/jpeg,image/webp" :max-count="1" :preview-image="false">
      <van-button size="small" round :loading="isUploading">{{ logoUrl ? 'Logoyu değiştir' : 'Logo yükle' }}</van-button>
    </van-uploader>
    <small>PNG, JPEG ya da WEBP · en fazla 2 MB</small>
  </div>
  <van-cell-group inset title="Firma bilgileri">
    <van-field v-model="company.name" label="Firma adı" maxlength="120" required placeholder="ör. Yılmaz İnşaat" />
    <van-field v-model="company.phone" label="Telefon" type="tel" maxlength="20" />
    <van-field v-model="company.city" label="Şehir" maxlength="60" />
    <van-field v-model="company.email" label="E-posta" type="email" maxlength="254" />
  </van-cell-group>
</template>

<style scoped>
.setup-logo {
  display: grid;
  justify-items: center;
  gap: var(--space-2);
  padding: var(--space-2) 0 var(--space-3);
}

.setup-logo small {
  color: var(--text-muted);
  font-size: var(--text-xs);
}
</style>
