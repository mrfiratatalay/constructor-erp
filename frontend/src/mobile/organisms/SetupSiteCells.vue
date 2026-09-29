<script setup lang="ts">
import type { SetupForms } from '@/core/onboarding/setupSteps'

/** Üçüncü adım telefonda: ilk şantiye (isteğe bağlı). */
const site = defineModel<SetupForms['site']>({ required: true })
</script>

<template>
  <van-cell-group inset title="İlk şantiye">
    <van-field v-model="site.name" label="Şantiye adı" maxlength="120" required placeholder="ör. Kartal Konutları" />
    <van-field v-model="site.address" label="Adres" type="textarea" rows="2" autosize maxlength="300"
      placeholder="Ekibiniz yol tarifini buradan alır" />
  </van-cell-group>
</template>
