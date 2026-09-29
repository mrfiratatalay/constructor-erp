<script setup lang="ts">
import type { SetupForms } from '@/core/onboarding/setupSteps'

/** Üçüncü adım: ilk şantiye. Açılınca çalışma alanı boş karşılamaz; atlanırsa şantiye sonra da açılır. */
const site = defineModel<SetupForms['site']>({ required: true })
</script>

<template>
  <el-form label-position="top" @submit.prevent>
    <el-form-item label="Şantiye adı" required>
      <el-input v-model="site.name" maxlength="120" size="large" placeholder="ör. Kartal Konutları B Blok" />
    </el-form-item>
    <el-form-item label="Adres">
      <el-input v-model="site.address" type="textarea" :rows="3" maxlength="300" show-word-limit
        placeholder="Ekibiniz yol tarifini buradan alır" />
    </el-form-item>
  </el-form>
</template>
