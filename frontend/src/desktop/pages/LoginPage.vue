<script setup lang="ts">
import { reactive } from 'vue'
import { devLogin } from '@/core/auth/devLogin'
import { usePasswordLogin } from '@/core/auth/usePasswordLogin'
import AuthLayout from '@/desktop/templates/AuthLayout.vue'

const form = reactive({ email: '', password: '' })
const { login, isPending, errorText } = usePasswordLogin()
const devAccount = devLogin()
const fillDevAccount = () => devAccount && Object.assign(form, devAccount)
</script>

<template>
  <AuthLayout>
    <el-card class="login-page__card" shadow="never">
      <h2 class="login-page__title">Giriş yap</h2>
      <p class="login-page__lead">Firmanızın çalışma alanına ya da platform yönetimine girin.</p>
      <el-form label-position="top" class="login-page__form" @submit.prevent="login(form.email, form.password)">
        <el-form-item label="E-posta">
          <el-input v-model="form.email" type="email" size="large" autocomplete="username"
            placeholder="ornek@firma.com" required />
        </el-form-item>
        <el-form-item label="Şifre">
          <el-input v-model="form.password" type="password" size="large" show-password
            autocomplete="current-password" placeholder="••••••••" required />
        </el-form-item>
        <el-alert v-if="errorText" :title="errorText" type="error" :closable="false" show-icon />
        <el-button type="primary" size="large" native-type="submit" :loading="isPending" class="login-page__submit">
          Giriş yap
        </el-button>
        <!-- Yalnızca hesap derlemede ortamdan verildiyse: yerel geliştirme ve yerel Docker (core/auth/devLogin). -->
        <el-button v-if="devAccount" text type="primary" @click="fillDevAccount">Patron olarak doldur</el-button>
      </el-form>
      <p class="login-page__hint">
        Saha ekibi şifre kullanmaz: firmasının WhatsApp'tan gönderdiği bağlantıyla girer.
      </p>
      <el-divider />
      <p class="login-page__hint">
        Firmanız henüz Constructor ERP kullanmıyor mu?
        <RouterLink :to="{ name: 'pricing' }">Paketleri inceleyin</RouterLink>
      </p>
    </el-card>
  </AuthLayout>
</template>

<style scoped>
.login-page__card {
  width: min(100%, 440px);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
}

.login-page__title {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.login-page__lead {
  margin: var(--space-2) 0 var(--space-6);
  color: var(--text-muted);
}

.login-page__form {
  display: grid;
  gap: var(--space-2);
}

.login-page__submit {
  width: 100%;
  margin-top: var(--space-2);
}

.login-page__hint {
  margin: var(--space-4) 0 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  line-height: 1.5;
  text-align: center;
}

.login-page__hint a {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
}

.login-page__card :deep(.el-divider) {
  margin: var(--space-4) 0 0;
}
</style>
