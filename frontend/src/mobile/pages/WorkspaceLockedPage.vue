<script setup lang="ts">
import { Lock, ShieldCheck } from 'lucide-vue-next'
import { useLogout } from '@/core/auth/useLogout'
import { useLockedWorkspace } from '@/core/tenant/useLockedWorkspace'
import { useWorkspaceSwitch } from '@/core/tenant/useWorkspaceSwitch'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/** Çalışma alanı kapalı (abonelik bitti, firma askıda): neden, ne yapılabilir. Veri silinmez. */
const { workspace, title, hint, detail, retry, otherWorkspaces, isPlatformAdmin } = useLockedWorkspace()
const { switchTo } = useWorkspaceSwitch()
const { logout, isPending } = useLogout()
</script>

<template>
  <main class="locked">
    <div class="locked__identity">
      <CompanyLogo v-if="workspace" :name="workspace.name" :logo-url="workspace.logoUrl" :size="72" />
      <span class="locked__lock"><Lock :size="18" /></span>
    </div>
    <p class="locked__company">{{ workspace?.name }}</p>
    <h1>{{ title }}</h1>
    <p class="locked__message">{{ hint }}</p>
    <van-tag v-if="detail" plain round type="primary" size="medium">{{ detail }}</van-tag>
    <p class="locked__safe"><ShieldCheck :size="18" /> Verileriniz silinmedi, güvende duruyor.</p>
    <div class="locked__actions">
      <van-button type="primary" block round @click="retry">Tekrar dene</van-button>
      <van-button v-if="isPlatformAdmin" block round plain type="primary" :to="{ name: 'platformDashboard' }">
        Platform yönetimi
      </van-button>
      <van-button block round :loading="isPending" @click="logout">Çıkış yap</van-button>
    </div>
    <van-cell-group v-if="otherWorkspaces.length" inset title="Diğer firmalarınız" class="locked__others">
      <van-cell v-for="option in otherWorkspaces" :key="option.companyId" :title="option.name" is-link center
        @click="switchTo(option.companyId)">
        <template #icon><CompanyLogo :name="option.name" :logo-url="option.logoUrl" :size="28" class="locked__icon" /></template>
      </van-cell>
    </van-cell-group>
    <footer class="locked__footer">
      <BrandLogo />
      <span>Aboneliğinizi yenilemek için Constructor ERP ekibiyle görüşün.</span>
    </footer>
  </main>
</template>

<style scoped>
.locked {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  max-width: var(--layout-phone-column);
  margin-inline: auto;
  padding: 12vh var(--space-5) var(--space-8);
  text-align: center;
}

.locked__identity {
  position: relative;
}

.locked__lock {
  position: absolute;
  right: -8px;
  bottom: -8px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 3px solid var(--canvas);
  border-radius: 50%;
  background: var(--status-warning);
  color: var(--surface);
}

.locked__company {
  margin: var(--space-2) 0 0;
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
}

.locked h1 {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
}

.locked__message {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.55;
}

.locked__safe {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: var(--status-success);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.locked__actions {
  display: grid;
  gap: var(--space-3);
  width: 100%;
  margin-top: var(--space-3);
}

.locked__others {
  width: 100%;
  text-align: left;
}

.locked__icon {
  margin-right: var(--space-3);
}

.locked__footer {
  display: grid;
  justify-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
