<script setup lang="ts">
import { useInviteAcceptance } from '@/core/auth/useInviteAcceptance'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

const { errorText } = useInviteAcceptance()
</script>

<template>
  <main class="invite-page">
    <BrandLogo />
    <el-result v-if="errorText" icon="error" title="Giriş yapılamadı" :sub-title="errorText" />
    <p v-else class="invite-page__loading">Giriş yapılıyor…</p>
  </main>
</template>

<style scoped>
.invite-page {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: var(--space-6);
  min-height: 100vh;
}

.invite-page__loading {
  color: var(--text-muted);
}
</style>
