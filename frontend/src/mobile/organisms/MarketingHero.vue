<script setup lang="ts">
import ProductPreview from '@/shared/organisms/ProductPreview.vue'

/** Tanıtımın telefondaki girişi: ne olduğu, ilk adım ve ürünün önizlemesi. */
</script>

<template>
  <section class="hero blueprint">
    <small>Müteahhitler için şantiye yönetimi</small>
    <h1>Şantiyeleriniz WhatsApp gruplarında değil, <em>tek ekranda.</em></h1>
    <p>Sahadan fotoğraf ve sorunlar, yoklama, malzeme, taşeron ilerlemesi. Şef telefondan girer, siz her yerden görürsünüz.</p>
    <div class="hero__actions">
      <RouterLink :to="{ name: 'apply' }"><van-button block round color="var(--brand-signature)" class="hero__main">Tanıtım isteyin</van-button></RouterLink>
      <RouterLink :to="{ name: 'pricing' }"><van-button block round plain class="hero__ghost">Paketleri inceleyin</van-button></RouterLink>
    </div>
    <ProductPreview class="hero__preview" />
  </section>
</template>

<style scoped>
.hero {
  padding: var(--space-8) var(--space-4) var(--space-10);
  color: var(--brand-on-deep);
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
  font-size: 34px;
  font-weight: var(--weight-black);
  letter-spacing: -0.03em;
  line-height: 1.08;
}

.hero em {
  color: var(--brand-signature);
  font-style: normal;
}

.hero p {
  margin: var(--space-4) 0 0;
  color: rgb(255 255 255 / 0.8);
  line-height: 1.6;
}

.hero__actions {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-6) 0 var(--space-8);
}

.hero__main {
  color: var(--brand-deep) !important;
  font-weight: var(--weight-bold);
}

.hero__ghost {
  border-color: rgb(255 255 255 / 0.4);
  background: transparent;
  color: var(--brand-on-deep);
}
</style>
