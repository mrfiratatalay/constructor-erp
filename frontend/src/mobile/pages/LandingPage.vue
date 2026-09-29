<script setup lang="ts">
import MarketingFaq from '@/mobile/organisms/MarketingFaq.vue'
import MarketingHero from '@/mobile/organisms/MarketingHero.vue'
import PublicPlanList from '@/mobile/organisms/PublicPlanList.vue'
import MarketingLayout from '@/mobile/templates/MarketingLayout.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
import ProductPoints from '@/shared/organisms/ProductPoints.vue'
import StartSteps from '@/shared/organisms/StartSteps.vue'
</script>

<template>
  <MarketingLayout>
    <MarketingHero />
    <section class="landing__section">
      <SectionHeading eyebrow="Neler var?" title="Şantiyenin bütün defterleri tek yerde"
        lead="Saha telefondan girer, ofis bilgisayardan yönetir." />
      <ProductPoints />
    </section>
    <section class="landing__section blueprint landing__band">
      <SectionHeading surface="dark" eyebrow="Nasıl başlanır?" title="Bir günde kullanmaya başlarsınız"
        lead="Kredi kartı gerekmez: ödeme havale ya da elden." />
      <StartSteps />
    </section>
    <section class="landing__section landing__section--muted">
      <SectionHeading eyebrow="Paketler" title="Ekibinizin büyüklüğüne göre" lead="Aylık fiyatlar, KDV hariç." />
      <PublicPlanList />
    </section>
    <section class="landing__section">
      <SectionHeading eyebrow="Sık sorulanlar" title="Aklınıza takılanlar" />
      <MarketingFaq />
    </section>
  </MarketingLayout>
</template>

<style scoped>
.landing__section {
  padding: var(--space-10) var(--space-4);
}

.landing__section--muted {
  background: var(--canvas);
}

.landing__band {
  color: var(--brand-on-deep);
}
</style>
