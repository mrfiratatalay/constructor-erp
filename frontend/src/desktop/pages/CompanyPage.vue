<script setup lang="ts">
import BillingHistory from '@/desktop/organisms/BillingHistory.vue'
import CompanyProfileCard from '@/desktop/organisms/CompanyProfileCard.vue'
import CompanyModules from '@/desktop/organisms/CompanyModules.vue'
import SubscriptionSummary from '@/desktop/organisms/SubscriptionSummary.vue'

/** Kimlik ve paket özeti ilk bakışta görünür; ayrıntılar sayfanın devamındadır. */
</script>

<template>
  <el-scrollbar>
    <el-main class="company-page">
      <header>
        <span class="company-page__eyebrow">ÇALIŞMA ALANI</span>
        <h1>Firma yönetimi</h1>
        <p>Firma bilgileri, abonelik ve ödeme geçmişi.</p>
      </header>
      <div class="company-page__grid">
        <CompanyProfileCard />
        <SubscriptionSummary />
      </div>
      <CompanyModules />
      <BillingHistory />
    </el-main>
  </el-scrollbar>
</template>

<style scoped>
.company-page {
  display: grid;
  gap: var(--space-6);
  width: 100%;
  max-width: 1320px;
  margin-inline: auto;
  padding: clamp(20px, 3vw, 40px);
}

.company-page__eyebrow {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: var(--weight-semibold);
  letter-spacing: 0.12em;
}

.company-page h1 {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
}

.company-page header p {
  margin: var(--space-1) 0 0;
  color: var(--text-muted);
}

.company-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: var(--space-5);
  align-items: stretch;
}
.company-page__grid > * { min-width: 0; }
@media (max-width: 1100px) { .company-page__grid { grid-template-columns: minmax(0, 1fr); } }
</style>
