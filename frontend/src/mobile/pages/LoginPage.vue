<script setup lang="ts">
import { ref } from 'vue'
import { devLogin } from '@/core/auth/devLogin'
import { usePasswordLogin } from '@/core/auth/usePasswordLogin'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

const email = ref('')
const password = ref('')
const { login, isPending, errorText } = usePasswordLogin()
const devAccount = devLogin()

function fillDevAccount() {
  if (!devAccount) return
  email.value = devAccount.email
  password.value = devAccount.password
}
</script>

<template>
  <main class="login-page">
    <BrandLogo class="login-page__logo" />
    <van-form class="login-page__form" @submit="login(email, password)">
      <van-cell-group inset>
        <van-field v-model="email" name="email" label="E-posta" type="email" autocomplete="username"
          placeholder="ornek@firma.com" :rules="[{ required: true, message: 'E-posta gerekli' }]" />
        <van-field v-model="password" name="password" label="Şifre" type="password" autocomplete="current-password"
          placeholder="••••••••" :rules="[{ required: true, message: 'Şifre gerekli' }]" />
      </van-cell-group>
      <van-notice-bar v-if="errorText" type="danger" :text="errorText" wrapable />
      <van-button type="primary" native-type="submit" block round size="large" :loading="isPending">
        Giriş yap
      </van-button>
      <!-- Yalnızca hesap derlemede ortamdan verildiyse: yerel geliştirme ve yerel Docker (core/auth/devLogin). -->
      <van-button v-if="devAccount" block round plain type="primary" @click="fillDevAccount">
        Patron olarak doldur
      </van-button>
    </van-form>
    <p class="login-page__hint">
      Şefler şifre kullanmaz: yöneticinin WhatsApp'tan gönderdiği linke dokunarak girer.
    </p>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  gap: var(--space-6);
  align-content: start;
  max-width: var(--layout-phone-column);
  margin-inline: auto;
  padding: 14vh var(--space-4) var(--space-8);
}

.login-page__logo {
  justify-self: center;
}

.login-page__form {
  display: grid;
  gap: var(--space-4);
}

.login-page__hint {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  line-height: 1.5;
  text-align: center;
}
</style>
