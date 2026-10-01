<script setup lang="ts">
import ProductMark from '@/shared/atoms/ProductMark.vue'
import BrandMark from '@/shared/molecules/BrandMark.vue'

/** Tanıtım sitesinin telefon iskeleti: üstte yapışkan çubuk (ürün, giriş, başvuru), altta koyu alt bilgi. */
const year = new Date().getFullYear()
</script>

<template>
  <div class="marketing">
    <header class="marketing__top">
      <RouterLink :to="{ name: 'landing' }" class="marketing__brand" aria-label="Constructor ERP ana sayfa">
        <ProductMark :size="30" /> <strong>Constructor <b>ERP</b></strong>
      </RouterLink>
      <RouterLink :to="{ name: 'login' }" class="marketing__login">Giriş</RouterLink>
      <RouterLink :to="{ name: 'apply' }"><van-button type="primary" size="small" round>Başvurun</van-button></RouterLink>
    </header>
    <main><slot /></main>
    <footer class="marketing__foot blueprint">
      <BrandMark tagline="Şantiyeniz cebinizde" />
      <nav>
        <RouterLink :to="{ name: 'pricing' }">Fiyatlar</RouterLink>
        <RouterLink :to="{ name: 'apply' }">Başvuru</RouterLink>
        <RouterLink :to="{ name: 'login' }">Giriş</RouterLink>
      </nav>
      <small>© {{ year }} Constructor ERP</small>
    </footer>
  </div>
</template>

<style scoped>
/* Kısa sayfada (başvuru teşekkürü) alt bilgi ekranın dibine oturur; altında boş beyaz şerit kalmaz. */
.marketing {
  display: flex;
  flex-direction: column;
  min-height: var(--layout-app-height);
  background: var(--surface);
}

.marketing > main {
  display: flex;
  flex: 1;
  flex-direction: column;
}

/* Boşluğu sayfanın son bölümü doldurur: kendi zemin rengiyle uzar, alt bilginin üstünde beyaz şerit kalmaz. */
.marketing > main > :last-child {
  flex: 1;
}

.marketing__top {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  padding-top: calc(var(--space-2) + env(safe-area-inset-top));
  border-bottom: 1px solid var(--border-soft);
  background: rgb(255 255 255 / 0.92);
  backdrop-filter: blur(12px);
}

.marketing__brand {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--space-2);
  color: var(--brand-deep);
  text-decoration: none;
}

.marketing__brand b {
  color: var(--brand-primary);
}

.marketing__login {
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
  text-decoration: none;
}

.marketing__foot {
  display: grid;
  gap: var(--space-5);
  padding: var(--space-8) var(--space-4) calc(var(--space-8) + env(safe-area-inset-bottom));
  color: var(--brand-on-deep);
}

.marketing__foot nav {
  display: flex;
  gap: var(--space-5);
}

.marketing__foot a {
  color: rgb(255 255 255 / 0.85);
  font-weight: var(--weight-semibold);
  text-decoration: none;
}

.marketing__foot small {
  color: rgb(255 255 255 / 0.6);
}
</style>
