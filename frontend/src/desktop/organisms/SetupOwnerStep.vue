<script setup lang="ts">
import type { SetupForms } from '@/core/onboarding/setupSteps'

/** İkinci adım: patronun kendi girişi. Bu e-posta ve şifreyle firmanın çalışma alanına girilir. */
const owner = defineModel<SetupForms['owner']>({ required: true })
</script>

<template>
  <el-form label-position="top" @submit.prevent>
    <el-form-item label="Adınız soyadınız" required>
      <el-input v-model="owner.fullName" maxlength="120" size="large" autocomplete="name" />
    </el-form-item>
    <el-form-item label="Giriş e-postası" required>
      <el-input v-model="owner.email" type="email" maxlength="254" size="large" autocomplete="username" />
    </el-form-item>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="Şifre" required>
          <el-input v-model="owner.password" type="password" show-password autocomplete="new-password"
            placeholder="En az 8 karakter" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Şifre (tekrar)" required>
          <el-input v-model="owner.passwordAgain" type="password" show-password autocomplete="new-password" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-alert type="info" :closable="false" show-icon
      title="Saha ekibinizin şifreye ihtiyacı yok: onları kurulumdan sonra WhatsApp bağlantısıyla davet edersiniz." />
  </el-form>
</template>
