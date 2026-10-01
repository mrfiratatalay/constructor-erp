<script setup lang="ts">
import LinkFailed from '@/mobile/molecules/LinkFailed.vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { SETUP_STEPS } from '@/core/onboarding/setupSteps'
import { useSetupWizard } from '@/core/onboarding/useSetupWizard'
import SetupCompanyCells from '@/mobile/organisms/SetupCompanyCells.vue'
import SetupOwnerCells from '@/mobile/organisms/SetupOwnerCells.vue'
import SetupSiteCells from '@/mobile/organisms/SetupSiteCells.vue'
import SetupSummaryCells from '@/mobile/organisms/SetupSummaryCells.vue'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

const wizard = useSetupWizard()
const { invite, forms, step, problem } = wizard
const LAST = SETUP_STEPS.length - 1

async function onUpload(file: File) {
  try {
    await wizard.uploadLogo(file)
    showSuccessToast('Yüklendi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <main class="setup-page">
    <header class="setup-page__head">
      <BrandLogo size="md" />
    </header>
    <van-loading v-if="wizard.isLoading.value" class="setup-page__loading" vertical>Yükleniyor…</van-loading>
    <LinkFailed v-else-if="!invite" :message="wizard.inviteError.value ?? 'Bağlantı açılamadı'" />
    <template v-else>
      <div class="setup-page__intro">
        <small>Hoş geldiniz · Kurulum</small>
        <h1>{{ invite.companyName }} çalışma alanını hazırlayalım</h1>
      </div>
      <van-steps :active="step" active-color="var(--brand-primary)">
        <van-step v-for="item in SETUP_STEPS" :key="item.key">{{ item.title }}</van-step>
      </van-steps>
      <SetupCompanyCells v-if="step === 0" v-model="forms.company" :logo-url="wizard.logoUrl.value"
        :is-uploading="wizard.isUploading.value" @upload="onUpload" />
      <SetupOwnerCells v-else-if="step === 1" v-model="forms.owner" />
      <SetupSiteCells v-else-if="step === 2" v-model="forms.site" />
      <SetupSummaryCells v-else :forms="forms" :invite="invite" />
      <van-notice-bar v-if="problem || wizard.finishError.value" class="setup-page__problem" wrapable
        :scrollable="false" color="var(--status-danger)" background="var(--status-danger-bg)"
        :text="problem ?? wizard.finishError.value ?? ''" />
      <footer class="setup-page__actions">
        <van-button v-if="step > 0" round plain @click="wizard.back">Geri</van-button>
        <van-button v-if="step === 2" round plain type="primary" @click="wizard.skipSite">Atla</van-button>
        <van-button v-if="step < LAST" round block type="primary" @click="wizard.next">Devam</van-button>
        <van-button v-else round block type="primary" :loading="wizard.isFinishing.value" @click="wizard.finish">
          Kurulumu bitir
        </van-button>
      </footer>
    </template>
  </main>
</template>

<style scoped>
.setup-page {
  display: grid;
  align-content: start;
  gap: var(--space-2);
  max-width: var(--layout-phone-column);
  min-height: var(--layout-app-height);
  margin-inline: auto;
  padding: 0 var(--space-4) var(--space-8);
}

.setup-page__head {
  display: flex;
  justify-content: center;
  padding: var(--space-6) var(--space-4) 0;
}

.setup-page__loading {
  margin-top: 20vh;
}

.setup-page__intro {
  padding: var(--space-4) 0 0;
}

.setup-page__intro small {
  color: var(--brand-primary);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.setup-page__intro h1 {
  margin: var(--space-1) 0 0;
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.setup-page__problem {
  margin-top: var(--space-3);
  border-radius: var(--radius-md);
}

.setup-page__actions {
  display: flex;
  gap: var(--space-2);
  padding-top: var(--space-5);
}

.setup-page__actions .van-button:not(.van-button--block) {
  flex: none;
  min-width: 88px;
}
.setup-page :deep(.van-steps) {
  border-radius: var(--radius-md);
}
</style>
