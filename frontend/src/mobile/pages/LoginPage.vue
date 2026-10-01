<script setup lang="ts">
import { ref, watch } from 'vue'
import { devLogin } from '@/core/auth/devLogin'
import { usePasswordLogin } from '@/core/auth/usePasswordLogin'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

const email = ref('')
const password = ref('')
const { login, isPending, errorText, clearError } = usePasswordLogin()
watch([email, password], clearError)
const devAccount = devLogin()

function fillDevAccount() {
  if (!devAccount) return
  email.value = devAccount.email
  password.value = devAccount.password
}
</script>

<template>
  <main class="login-page">
    <BrandLogo class="login-page__logo" size="lg" />
    <p class="login-page__lead">Firmanızın çalışma alanına girin.</p>
    <van-form class="login-page__form" @submit="login(email, password)">
      <van-cell-group inset>
        <van-field v-model="email" name="email" label="E-posta" type="email" autocomplete="username"
          placeholder="ornek@firma.com" :rules="[{ required: true, message: 'E-posta gerekli' }]" />
        <van-field v-model="password" name="password" label="Şifre" type="password" autocomplete="current-password"
          :rules="[{ required: true, message: 'Şifre gerekli' }]" />
      </van-cell-group>
      <van-notice-bar v-if="errorText" left-icon="warning-o" color="var(--status-danger)"
        background="var(--status-danger-bg)" :text="errorText" wrapable />
      <van-button type="primary" native-type="submit" block round size="large" :loading="isPending">
        Giriş yap
      </van-button>
      <!-- Yalnızca geliştirme sunucusunda, hesap .env.development.local'da verildiyse (core/auth/devLogin). -->
      <van-button v-if="devAccount" block round plain type="primary" @click="fillDevAccount">
        Patron olarak doldur
      </van-button>
    </van-form>
    <p class="login-page__hint">
      Saha ekibi şifre kullanmaz: firmasının WhatsApp'tan gönderdiği bağlantıya dokunarak girer.
    </p>
    <p class="login-page__hint">
      Firmanız henüz Constructor ERP kullanmıyor mu? <RouterLink :to="{ name: 'pricing' }">Paketleri inceleyin</RouterLink>
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

.login-page__lead {
  margin: calc(var(--space-4) * -1) 0 0;
  color: var(--text-muted);
  text-align: center;
}

.login-page__hint a {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
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
