<script setup lang="ts">
import MarketingFaq from '@/desktop/organisms/MarketingFaq.vue'
import MarketingHero from '@/desktop/organisms/MarketingHero.vue'
import PublicPlanGrid from '@/desktop/organisms/PublicPlanGrid.vue'
import MarketingLayout from '@/desktop/templates/MarketingLayout.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
import ProductPoints from '@/shared/organisms/ProductPoints.vue'
import StartSteps from '@/shared/organisms/StartSteps.vue'
</script>

<template>
  <MarketingLayout>
    <MarketingHero />
    <section id="ozellikler" class="landing__section">
      <SectionHeading eyebrow="Neler var?" title="Şantiyenin bütün defterleri tek yerde"
        lead="Sahadaki ekip telefondan girer, ofis bilgisayardan yönetir. Aynı bilgi, iki ekran, gecikmesiz." />
      <ProductPoints />
    </section>
    <section id="baslangic" class="landing__band blueprint">
      <div class="landing__section">
        <SectionHeading surface="dark" eyebrow="Nasıl başlanır?" title="Bir günde kullanmaya başlarsınız"
          lead="Kredi kartı istemiyoruz: ödemeyi havale ya da elden alıyoruz, kurulumu size özel bağlantıyla yapıyorsunuz." />
        <StartSteps />
      </div>
    </section>
    <section class="landing__section">
      <SectionHeading eyebrow="Paketler" title="Ekibinizin büyüklüğüne göre"
        lead="Fiyatlar aylıktır, KDV hariçtir. Paketinizi dilediğiniz zaman büyütürsünüz." />
      <PublicPlanGrid />
      <p class="landing__more">
        <RouterLink :to="{ name: 'pricing' }">Paketleri ayrıntılı karşılaştırın →</RouterLink>
      </p>
    </section>
    <section id="sss" class="landing__section landing__section--muted">
      <SectionHeading eyebrow="Sık sorulanlar" title="Aklınıza takılanlar" />
      <MarketingFaq />
    </section>
    <section class="landing__cta">
      <h2>Şantiyelerinizi bu hafta tek ekrana taşıyalım.</h2>
      <p>Formu doldurun, aynı gün arayalım. Kurulum ve ekibinizin ilk kullanımı bizden.</p>
      <RouterLink :to="{ name: 'apply' }"><el-button type="primary" size="large" round>Başvurun</el-button></RouterLink>
    </section>
  </MarketingLayout>
</template>

<style scoped>
.landing__section {
  max-width: var(--layout-board-width);
  margin-inline: auto;
  padding: 96px var(--space-6);
}

.landing__section--muted {
  max-width: none;
  background: var(--canvas);
}

.landing__band {
  color: var(--brand-on-deep);
}

.landing__more {
  margin: var(--space-8) 0 0;
  text-align: center;
}

.landing__more a {
  color: var(--brand-primary);
  font-weight: var(--weight-bold);
  text-decoration: none;
}

.landing__cta {
  padding: 96px var(--space-6);
  text-align: center;
  background: linear-gradient(180deg, var(--surface), var(--brand-tint));
}

.landing__cta h2 {
  margin: 0;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.landing__cta p {
  margin: var(--space-3) 0 var(--space-6);
  color: var(--text-muted);
  font-size: var(--text-md);
}
</style>
