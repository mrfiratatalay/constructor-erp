<script setup lang="ts">
import type { SetupForms } from '@/core/onboarding/setupSteps'

/** İkinci adım telefonda: patronun girişi. */
const owner = defineModel<SetupForms['owner']>({ required: true })
</script>

<template>
  <van-cell-group inset title="Patron hesabı">
    <van-field v-model="owner.fullName" label="Ad soyad" maxlength="120" required autocomplete="name" />
    <van-field v-model="owner.email" label="E-posta" type="email" maxlength="254" required autocomplete="username" />
    <van-field v-model="owner.password" label="Şifre" type="password" required autocomplete="new-password"
      placeholder="En az 8 karakter" />
    <van-field v-model="owner.passwordAgain" label="Tekrar" type="password" required autocomplete="new-password" />
  </van-cell-group>
  <p class="setup-note">Saha ekibinizin şifreye ihtiyacı yok: onları kurulumdan sonra WhatsApp bağlantısıyla davet edersiniz.</p>
</template>

<style scoped>
.setup-note {
  margin: var(--space-3) 0 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  line-height: 1.5;
}
</style>
