<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import ProductPreview from '@/shared/organisms/ProductPreview.vue'

/** Tanıtım sayfasının girişi: ne olduğu, kime olduğu, ilk adım. Sağda ürünün önizlemesi. */
const PROMISES = ['Kurulum yok, tarayıcıda çalışır', 'Saha ekibine şifre yok', 'Verileriniz yalnızca size açık']
</script>

<template>
  <section class="hero blueprint">
    <div class="hero__inner">
      <div class="hero__copy">
        <small>Müteahhitler için şantiye yönetimi</small>
        <h1>Şantiyeleriniz WhatsApp gruplarında değil, <em>tek ekranda.</em></h1>
        <p>
          Sahadan fotoğraf ve sorunlar, yoklama ve puantaj, malzeme sevkiyatı, taşeron ilerlemesi. Şef telefondan
          girer, siz ofisten görürsünüz.
        </p>
        <div class="hero__actions">
          <RouterLink :to="{ name: 'apply' }"><el-button type="warning" size="large" round>Tanıtım isteyin</el-button></RouterLink>
          <RouterLink :to="{ name: 'pricing' }"><el-button size="large" round plain>Paketleri inceleyin</el-button></RouterLink>
        </div>
        <ul>
          <li v-for="promise in PROMISES" :key="promise"><Check :size="16" /> {{ promise }}</li>
        </ul>
      </div>
      <ProductPreview class="hero__preview" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  color: var(--brand-on-deep);
}

.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: var(--space-10);
  align-items: center;
  max-width: var(--layout-board-width);
  margin-inline: auto;
  padding: 88px var(--space-6) 96px;
}

.hero small {
  color: var(--brand-signature);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero h1 {
  margin: var(--space-3) 0 0;
  font-size: clamp(34px, 4.4vw, 54px);
  font-weight: var(--weight-black);
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.hero em {
  color: var(--brand-signature);
  font-style: normal;
}

.hero p {
  margin: var(--space-5) 0 0;
  color: rgb(255 255 255 / 0.8);
  font-size: var(--text-md);
  line-height: 1.65;
}

.hero__actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.hero__actions .el-button--warning {
  --el-button-bg-color: var(--brand-signature);
  --el-button-border-color: var(--brand-signature);
  --el-button-text-color: var(--brand-deep);
  --el-button-hover-bg-color: #fde047;
  --el-button-hover-border-color: #fde047;
  --el-button-hover-text-color: var(--brand-deep);
  font-weight: var(--weight-bold);
}

.hero__actions .is-plain {
  --el-button-bg-color: transparent;
  --el-button-text-color: var(--brand-on-deep);
  --el-button-border-color: rgb(255 255 255 / 0.4);
  --el-button-hover-bg-color: rgb(255 255 255 / 0.1);
  --el-button-hover-text-color: var(--brand-on-deep);
  --el-button-hover-border-color: var(--brand-on-deep);
}

.hero ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-5);
  margin: var(--space-6) 0 0;
  padding: 0;
  list-style: none;
  color: rgb(255 255 255 / 0.75);
  font-size: var(--text-sm);
}

.hero li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.hero li svg {
  color: var(--brand-signature);
}

@media (width < 1024px) {
  .hero__inner { grid-template-columns: 1fr; padding-block: 64px; }
}
</style>
