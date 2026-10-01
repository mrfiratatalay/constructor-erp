<script setup lang="ts">
import LinkFailed from '@/desktop/molecules/LinkFailed.vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { SETUP_STEPS } from '@/core/onboarding/setupSteps'
import { useSetupWizard } from '@/core/onboarding/useSetupWizard'
import SetupCompanyStep from '@/desktop/organisms/SetupCompanyStep.vue'
import SetupOwnerStep from '@/desktop/organisms/SetupOwnerStep.vue'
import SetupSiteStep from '@/desktop/organisms/SetupSiteStep.vue'
import SetupSummaryStep from '@/desktop/organisms/SetupSummaryStep.vue'
import AuthLayout from '@/desktop/templates/AuthLayout.vue'

const wizard = useSetupWizard()
const { invite, forms, step, problem } = wizard

async function onUpload(file: File) {
  try {
    await wizard.uploadLogo(file)
    ElMessage.success('Logo yüklendi.')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <AuthLayout>
    <el-card class="setup-page" shadow="never">
      <el-skeleton v-if="wizard.isLoading.value" :rows="6" animated />
      <LinkFailed v-else-if="!invite" title="Bu kurulum bağlantısı açılamadı"
        :message="wizard.inviteError.value ?? ''" />
      <template v-else>
        <p class="setup-page__eyebrow">Hoş geldiniz · Kurulum</p>
        <h2 class="setup-page__title">{{ invite.companyName }} çalışma alanını hazırlayalım</h2>
        <el-steps :active="step" finish-status="success" align-center class="setup-page__steps">
          <el-step v-for="item in SETUP_STEPS" :key="item.key" :title="item.title" :description="item.description" />
        </el-steps>
        <SetupCompanyStep v-if="step === 0" v-model="forms.company" :logo-url="wizard.logoUrl.value"
          :is-uploading="wizard.isUploading.value" @upload="onUpload" />
        <SetupOwnerStep v-else-if="step === 1" v-model="forms.owner" />
        <SetupSiteStep v-else-if="step === 2" v-model="forms.site" />
        <SetupSummaryStep v-else :forms="forms" :invite="invite" />
        <el-alert v-if="problem || wizard.finishError.value" :title="problem ?? wizard.finishError.value ?? ''"
          type="error" :closable="false" show-icon class="setup-page__alert" />
        <div class="setup-page__actions">
          <el-button v-if="step > 0" size="large" @click="wizard.back">Geri</el-button>
          <span class="setup-page__spacer" />
          <el-button v-if="step === 2" text size="large" @click="wizard.skipSite">Bu adımı atla</el-button>
          <el-button v-if="step < SETUP_STEPS.length - 1" type="primary" size="large" @click="wizard.next">
            Devam
          </el-button>
          <el-button v-else type="primary" size="large" :loading="wizard.isFinishing.value" @click="wizard.finish">
            Kurulumu bitir
          </el-button>
        </div>
      </template>
    </el-card>
  </AuthLayout>
</template>

<style scoped>
.setup-page {
  width: min(100%, 620px);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
}

.setup-page__eyebrow {
  margin: 0;
  color: var(--brand-primary);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.setup-page__title {
  margin: var(--space-1) 0 var(--space-6);
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.setup-page__steps {
  margin-bottom: var(--space-6);
}

.setup-page__alert {
  margin-top: var(--space-4);
}

.setup-page__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
}

.setup-page__spacer {
  flex: 1;
}
</style>
