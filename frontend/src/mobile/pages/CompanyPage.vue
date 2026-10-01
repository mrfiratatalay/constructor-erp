<script setup lang="ts">
import CompanyProfileForm from '@/mobile/organisms/CompanyProfileForm.vue'
import CompanyModules from '@/mobile/organisms/CompanyModules.vue'
import CompanyBillingHistory from '@/mobile/organisms/CompanyBillingHistory.vue'
import SubscriptionCells from '@/mobile/organisms/SubscriptionCells.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/** Patronun Firma sayfası (Hesabım'dan açılır): firmanın kimliği ve aboneliği. */
</script>

<template>
  <MobilePage title="Firma yönetimi" back :tabbar="false">
    <p class="company-page__intro">Firma bilgileri, abonelik ve ödeme geçmişi.</p>
    <CompanyProfileForm />
    <SubscriptionCells />
    <CompanyModules />
    <CompanyBillingHistory />
  </MobilePage>
</template>

<style scoped>
.company-page__intro { margin: 0; color: var(--text-muted); font-size: var(--text-sm); line-height: 1.6; }
</style>
