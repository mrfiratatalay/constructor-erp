<script setup lang="ts">
import BillingHistory from '@/desktop/organisms/BillingHistory.vue'
import CompanyProfileCard from '@/desktop/organisms/CompanyProfileCard.vue'
import SubscriptionSummary from '@/desktop/organisms/SubscriptionSummary.vue'

/** Patronun Firma sayfası: solda firmanın kimliği, sağda aboneliği; altta dönemler ve ödemeler. */
</script>

<template>
  <el-scrollbar>
    <el-main class="company-page">
      <header>
        <h1>Firma</h1>
        <p>Çalışma alanınızın kimliği ve Constructor ERP aboneliğiniz.</p>
      </header>
      <div class="company-page__grid">
        <CompanyProfileCard />
        <SubscriptionSummary />
      </div>
      <BillingHistory />
    </el-main>
  </el-scrollbar>
</template>

<style scoped>
.company-page {
  display: grid;
  gap: var(--space-5);
  max-width: var(--layout-board-width);
  padding: var(--space-8);
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
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: var(--space-5);
  align-items: start;
}
</style>
