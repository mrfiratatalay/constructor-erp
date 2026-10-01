<script setup lang="ts">
import MarketingClosingCta from '@/mobile/organisms/MarketingClosingCta.vue'
import MarketingFaq from '@/mobile/organisms/MarketingFaq.vue'
import PublicPlanList from '@/mobile/organisms/PublicPlanList.vue'
import MarketingLayout from '@/mobile/templates/MarketingLayout.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
</script>

<template>
  <MarketingLayout>
    <section id="paketler" class="pricing-mobile__plans">
      <div class="marketing-section">
        <SectionHeading :level="1" eyebrow="PAKETLER VE FİYATLAR" title="Ekibinize uygun çalışma alanını seçin."
          lead="Kişi, aktif şantiye ve modül ihtiyaçlarınıza göre paketleri inceleyin. Aylık fiyatlar, KDV hariç; ödeme havale/EFT veya elden."
          class="pricing-mobile__heading" />
        <PublicPlanList />
      </div>
    </section>
    <section id="sss" class="marketing-section">
      <SectionHeading eyebrow="SIK SORULANLAR" title="Ödeme ve abonelik hakkında." />
      <MarketingFaq />
    </section>
    <MarketingClosingCta />
  </MarketingLayout>
</template>

<style scoped>
.pricing-mobile__plans { background: var(--mk-paper); border-bottom: 1px solid var(--mk-line); }
.pricing-mobile__heading { max-width: 600px; margin: 0 auto 38px; text-align: center; }
.pricing-mobile__heading :deep(small) { color: var(--brand-primary); font-size: 9px; font-weight: 750; letter-spacing: .13em; }
.pricing-mobile__heading :deep(h1) { margin: 16px 0 0; color: var(--mk-ink); font-size: clamp(30px, 8vw, 46px); font-weight: 800; letter-spacing: -.045em; line-height: 1.2; }
.pricing-mobile__heading :deep(p) { margin: 20px 0 0; color: var(--mk-muted); font-size: 13px; line-height: 1.8; }
</style>
