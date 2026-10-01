<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import MarketingClosingCta from '@/desktop/organisms/MarketingClosingCta.vue'
import MarketingFaq from '@/desktop/organisms/MarketingFaq.vue'
import MarketingHero from '@/desktop/organisms/MarketingHero.vue'
import PublicPlanGrid from '@/desktop/organisms/PublicPlanGrid.vue'
import MarketingLayout from '@/desktop/templates/MarketingLayout.vue'
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
      <SectionHeading eyebrow="İşinizin bütünü" title="Her şantiyeyi aynı netlikle görün."
        lead="Saha ekibinin günlük işleri, ofisin ihtiyaç duyduğu kayıtlarla aynı yerde." />
      <ProductPoints />
    </section>
    <MarketingRoles />
    <section id="baslangic" class="landing-start">
      <div class="marketing-section">
        <SectionHeading surface="dark" eyebrow="İlk adım" title="Firmanıza uygun bir başlangıç."
          lead="İhtiyaçlarınızı konuşalım, ekibiniz için çalışma alanını birlikte hazırlayalım." />
        <StartSteps />
      </div>
    </section>
    <section id="paketler" class="landing-plans">
      <div class="marketing-section">
        <SectionHeading eyebrow="Paketler" title="Ekibiniz kadar büyüyen bir alan."
          lead="Kişi, aktif şantiye ve modül ihtiyaçlarınıza göre paketleri inceleyin. Aylık fiyatlar, KDV hariç." />
        <PublicPlanGrid />
        <RouterLink :to="{ name: 'pricing' }" class="landing-plans__more">Paketleri ayrıntılı karşılaştırın<ArrowRight :size="16" aria-hidden="true" /></RouterLink>
      </div>
    </section>
    <section id="sss" class="marketing-section landing-faq">
      <div>
        <SectionHeading align="left" eyebrow="Sık sorulanlar" title="Başlamadan önce merak ettikleriniz."
          lead="Kullanım, paketler ve firmanızın çalışma alanı hakkında." />
        <RouterLink :to="{ name: 'apply' }" class="landing-faq__contact">Birlikte konuşalım<ArrowRight :size="16" aria-hidden="true" /></RouterLink>
      </div>
      <MarketingFaq />
    </section>
    <MarketingClosingCta />
  </MarketingLayout>
</template>

<style scoped>
.landing-start { color: var(--brand-on-deep); background: var(--mk-dark); }
.landing-plans { border-bottom: 1px solid var(--mk-line); background: var(--mk-paper); }
.landing-plans__more { display: flex; justify-content: center; align-items: center; gap: 10px; width: fit-content; max-width: 100%; margin: 32px auto 0; color: var(--mk-ink); text-decoration: none; font-size: 13px; font-weight: var(--weight-semibold); }
.landing-faq { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr)); align-items: start; gap: clamp(32px, 5vw, 72px); }
.landing-faq :deep(.section-heading) { margin-bottom: 24px; }
.landing-faq :deep(.marketing-faq) { width: 100%; }
.landing-faq__contact { display: inline-flex; align-items: center; gap: 10px; color: var(--brand-primary); text-decoration: none; font-size: 13px; font-weight: var(--weight-semibold); }
</style>
