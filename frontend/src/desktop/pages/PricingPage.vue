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
      <SectionHeading :level="1" eyebrow="Paketler ve fiyatlar" title="Ekibinize uygun çalışma alanı."
        lead="Kişi, aktif şantiye ve modül ihtiyaçlarınıza göre paketleri değerlendirin. Aylık fiyatlar KDV hariçtir; ödeme havale/EFT ya da elden alınır." />
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
  max-width: var(--mk-width);
  margin-inline: auto;
  padding: var(--mk-space) var(--mk-gutter);
}

.pricing__section--muted {
  max-width: none;
  background: var(--mk-paper);
}
</style>
