<script setup lang="ts">
import MarketingClosingCta from '@/mobile/organisms/MarketingClosingCta.vue'
import MarketingFaq from '@/mobile/organisms/MarketingFaq.vue'
import MarketingHero from '@/mobile/organisms/MarketingHero.vue'
import PublicPlanList from '@/mobile/organisms/PublicPlanList.vue'
import MarketingLayout from '@/mobile/templates/MarketingLayout.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
import MarketingBenefits from '@/shared/organisms/MarketingBenefits.vue'
import MarketingRoles from '@/shared/organisms/MarketingRoles.vue'
import ProductPoints from '@/shared/organisms/ProductPoints.vue'
import StartSteps from '@/shared/organisms/StartSteps.vue'
</script>

<template>
  <MarketingLayout>
    <MarketingHero />
    <MarketingBenefits />
    <section id="ozellikler" class="marketing-section">
      <SectionHeading eyebrow="İŞİNİZİN BÜTÜNÜ" title="Her şantiyeyi aynı netlikle görün."
        lead="Saha ekibinin günlük işleri, ofisin ihtiyaç duyduğu kayıtlarla aynı yerde." />
      <ProductPoints />
    </section>
    <MarketingRoles />
    <section id="baslangic" class="landing-mobile__start">
      <div class="marketing-section">
        <SectionHeading surface="dark" eyebrow="İLK ADIM" title="Firmanıza uygun bir başlangıç."
          lead="İhtiyaçlarınızı konuşalım, ekibiniz için çalışma alanını birlikte hazırlayalım." />
        <StartSteps />
      </div>
    </section>
    <section id="paketler" class="landing-mobile__plans">
      <div class="marketing-section">
        <SectionHeading eyebrow="PAKETLER" title="Ekibiniz kadar büyüyen bir alan."
          lead="Kişi, aktif şantiye ve modül ihtiyaçlarınıza göre paketleri inceleyin. Aylık fiyatlar, KDV hariç." />
        <PublicPlanList />
        <RouterLink :to="{ name: 'pricing' }" class="landing-mobile__more">Paketleri ayrıntılı inceleyin →</RouterLink>
      </div>
    </section>
    <section id="sss" class="marketing-section">
      <SectionHeading eyebrow="SIK SORULANLAR" title="Başlamadan önce merak ettikleriniz." />
      <MarketingFaq />
    </section>
    <MarketingClosingCta />
  </MarketingLayout>
</template>

<style scoped>
.landing-mobile__start { color: #fff; background: var(--mk-dark); }
.landing-mobile__plans { border-top: 1px solid var(--mk-line); border-bottom: 1px solid var(--mk-line); background: var(--mk-paper); }
.landing-mobile__more { display: block; width: fit-content; margin: 28px auto 0; color: var(--mk-ink); font-size: 13px; font-weight: var(--weight-semibold); text-decoration: none; }
</style>
