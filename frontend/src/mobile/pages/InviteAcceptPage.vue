<script setup lang="ts">
import LinkFailed from '@/mobile/molecules/LinkFailed.vue'
import { useInviteAcceptance } from '@/core/auth/useInviteAcceptance'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

const { errorText } = useInviteAcceptance()
</script>

<template>
  <main class="invite-page">
    <BrandLogo />
    <LinkFailed v-if="errorText" :message="errorText" />
    <van-loading v-else vertical size="32">Giriş yapılıyor…</van-loading>
  </main>
</template>

<style scoped>
.invite-page {
  display: grid;
  justify-items: center;
  gap: var(--space-6);
  max-width: var(--layout-phone-column);
  margin-inline: auto;
  padding: 20vh var(--space-4) var(--space-6);
}
</style>
