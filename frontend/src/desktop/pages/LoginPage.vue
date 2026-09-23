<script setup lang="ts">
import { reactive } from 'vue'
import { usePasswordLogin } from '@/core/auth/usePasswordLogin'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

const form = reactive({ email: '', password: '' })
const { login, isPending, errorText } = usePasswordLogin()
</script>

<template>
  <main class="login-page">
    <el-card class="login-page__card" shadow="never">
      <BrandLogo class="login-page__logo" />
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
      </el-form>
      <p class="login-page__hint">
        Şantiye sorumluları şifre kullanmaz: yöneticinin WhatsApp'tan gönderdiği linkle girer.
      </p>
    </el-card>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  place-items: center;
  min-height: var(--layout-app-height);
  padding: var(--space-6);
  background: var(--canvas);
}

.login-page__card {
  width: min(100%, 420px);
}

.login-page__logo {
  justify-content: center;
  width: 100%;
  margin-bottom: var(--space-6);
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
  margin: var(--space-5) 0 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  line-height: 1.5;
  text-align: center;
}
</style>
