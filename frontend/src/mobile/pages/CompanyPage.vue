<script setup lang="ts">
import CompanyProfileForm from '@/mobile/organisms/CompanyProfileForm.vue'
import SubscriptionCells from '@/mobile/organisms/SubscriptionCells.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/** Patronun Firma sayfası (Hesabım'dan açılır): firmanın kimliği ve aboneliği. */
</script>

<template>
  <MobilePage title="Firma" back>
    <CompanyProfileForm />
    <SubscriptionCells />
  </MobilePage>
</template>
