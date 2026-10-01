<script setup lang="ts">
import LinkFailed from '@/desktop/molecules/LinkFailed.vue'
import { useInviteAcceptance } from '@/core/auth/useInviteAcceptance'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

const { errorText } = useInviteAcceptance()
</script>

<template>
  <main class="invite-page">
    <BrandLogo />
    <LinkFailed v-if="errorText" title="Giriş yapılamadı" :message="errorText" />
    <p v-else class="invite-page__loading">Giriş yapılıyor…</p>
  </main>
</template>

<style scoped>
.invite-page {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: var(--space-6);
  min-height: var(--layout-app-height);
}

.invite-page__loading {
  color: var(--text-muted);
}
</style>
