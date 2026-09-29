<script setup lang="ts">
import { Lock, LogOut, RefreshCw, ShieldCheck } from 'lucide-vue-next'
import { useLogout } from '@/core/auth/useLogout'
import { useLockedWorkspace } from '@/core/tenant/useLockedWorkspace'
import { useWorkspaceSwitch } from '@/core/tenant/useWorkspaceSwitch'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

/**
 * Firmanın çalışma alanı kapalıyken (abonelik bitti, askıya alındı, firma arşivlendi) görünen tek sayfa. Veri
 * silinmez: abonelik yenilenince kişi kaldığı yerden devam eder. Başka firmada üyeliği varsa oraya geçebilir.
 */
const { workspace, title, hint, detail, retry, otherWorkspaces, isPlatformAdmin } = useLockedWorkspace()
const { switchTo, isSwitching } = useWorkspaceSwitch()
const { logout, isPending } = useLogout()
</script>

<template>
  <main class="locked-page">
    <el-card class="locked-page__card" shadow="never">
      <div class="locked-page__identity">
        <CompanyLogo v-if="workspace" :name="workspace.name" :logo-url="workspace.logoUrl" :size="64" />
        <span class="locked-page__lock"><Lock :size="18" /></span>
      </div>
      <p class="locked-page__company">{{ workspace?.name }}</p>
      <h1>{{ title }}</h1>
      <p class="locked-page__message">{{ hint }}</p>
      <el-tag v-if="detail" type="info" effect="plain" round>{{ detail }}</el-tag>
      <div class="locked-page__safe"><ShieldCheck :size="18" /> Verileriniz silinmedi, güvende duruyor.</div>
      <div class="locked-page__actions">
        <el-button type="primary" size="large" @click="retry"><RefreshCw :size="16" /> Tekrar dene</el-button>
        <el-button v-if="isPlatformAdmin" size="large" @click="$router.push({ name: 'platformDashboard' })">
          Platform yönetimi
        </el-button>
        <el-button size="large" :loading="isPending" @click="logout"><LogOut :size="16" /> Çıkış yap</el-button>
      </div>
      <template v-if="otherWorkspaces.length">
        <el-divider>Diğer firmalarınız</el-divider>
        <el-button v-for="option in otherWorkspaces" :key="option.companyId" text :loading="isSwitching"
          class="locked-page__switch" @click="switchTo(option.companyId)">
          <CompanyLogo :name="option.name" :logo-url="option.logoUrl" :size="24" /> {{ option.name }}
        </el-button>
      </template>
    </el-card>
    <footer class="locked-page__footer">
      <BrandLogo />
      <span>Aboneliğinizi yenilemek için Constructor ERP ekibiyle görüşün.</span>
    </footer>
  </main>
</template>

<style scoped>
.locked-page {
  display: grid;
  place-content: center;
  justify-items: center;
  gap: var(--space-6);
  min-height: var(--layout-app-height);
  padding: var(--space-8);
  background: var(--canvas);
}

.locked-page__card {
  display: grid;
  width: min(100%, 520px);
  border-radius: var(--radius-xl);
  text-align: center;
}

.locked-page__card :deep(.el-card__body) {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding: var(--space-8);
}

.locked-page__identity {
  position: relative;
}

.locked-page__lock {
  position: absolute;
  right: -8px;
  bottom: -8px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 3px solid var(--surface);
  border-radius: 50%;
  background: var(--status-warning);
  color: var(--surface);
}

.locked-page__company {
  margin: var(--space-2) 0 0;
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
}

.locked-page h1 {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.01em;
}

.locked-page__message {
  max-width: 400px;
  margin: 0;
  color: var(--text-muted);
  line-height: 1.55;
}

.locked-page__safe {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--status-success);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.locked-page__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.locked-page__actions svg {
  margin-right: var(--space-1);
}

.locked-page__switch {
  gap: var(--space-2);
}

.locked-page__footer {
  display: grid;
  justify-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
