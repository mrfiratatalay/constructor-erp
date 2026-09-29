<script setup lang="ts">
import MarketingFaq from '@/mobile/organisms/MarketingFaq.vue'
import PublicPlanList from '@/mobile/organisms/PublicPlanList.vue'
import MarketingLayout from '@/mobile/templates/MarketingLayout.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
</script>

<template>
  <MarketingLayout>
    <section class="pricing__section pricing__section--muted">
      <SectionHeading eyebrow="Fiyatlar" title="Sade paketler, gizli ücret yok"
        lead="Aylık fiyatlar, KDV hariç. Ödeme havale/EFT ya da elden; kredi kartı gerekmez." />
      <PublicPlanList />
    </section>
    <section class="pricing__section">
      <SectionHeading eyebrow="Sık sorulanlar" title="Ödeme ve abonelik" />
      <MarketingFaq />
    </section>
  </MarketingLayout>
</template>

<style scoped>
.pricing__section {
  padding: var(--space-8) var(--space-4) var(--space-10);
}

.pricing__section--muted {
  background: var(--canvas);
}
</style>
