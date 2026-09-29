<script setup lang="ts">
import MarketingFaq from '@/desktop/organisms/MarketingFaq.vue'
import PlanComparison from '@/desktop/organisms/PlanComparison.vue'
import PublicPlanGrid from '@/desktop/organisms/PublicPlanGrid.vue'
import MarketingLayout from '@/desktop/templates/MarketingLayout.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
</script>

<template>
  <MarketingLayout>
    <section class="pricing__section">
      <SectionHeading eyebrow="Fiyatlar" title="Sade paketler, gizli ücret yok"
        lead="Fiyatlar aylık ve KDV hariçtir. Ödeme havale/EFT ya da elden; kredi kartı gerekmez. Paketinizi dilediğiniz zaman büyütürsünüz." />
      <PublicPlanGrid />
    </section>
    <section class="pricing__section">
      <SectionHeading title="Paketleri karşılaştırın" />
      <PlanComparison />
    </section>
    <section class="pricing__section pricing__section--muted">
      <SectionHeading eyebrow="Sık sorulanlar" title="Ödeme ve abonelik" />
      <MarketingFaq />
    </section>
  </MarketingLayout>
</template>

<style scoped>
.pricing__section {
  max-width: var(--layout-board-width);
  margin-inline: auto;
  padding: 80px var(--space-6);
}

.pricing__section--muted {
  max-width: none;
  background: var(--canvas);
}
</style>
