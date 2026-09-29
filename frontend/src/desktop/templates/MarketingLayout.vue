<script setup lang="ts">
import ProductMark from '@/shared/atoms/ProductMark.vue'
import BrandMark from '@/shared/molecules/BrandMark.vue'

/**
 * Tanıtım sitesinin masaüstü iskeleti: üstte yapışkan menü (ürün, fiyatlar, giriş, başvuru), altta koyu alt bilgi.
 * Sayfalar yalnızca bölümlerini koyar.
 */
const LINKS = [
  { label: 'Özellikler', to: { name: 'landing', hash: '#ozellikler' } },
  { label: 'Nasıl başlanır', to: { name: 'landing', hash: '#baslangic' } },
  { label: 'Fiyatlar', to: { name: 'pricing' } },
  { label: 'Sık sorulanlar', to: { name: 'landing', hash: '#sss' } },
]
const year = new Date().getFullYear()
</script>

<template>
  <div class="marketing">
    <header class="marketing__top">
      <div class="marketing__row">
        <RouterLink :to="{ name: 'landing' }" class="marketing__brand" aria-label="Constructor ERP ana sayfa">
          <ProductMark :size="36" /> <strong>Constructor <b>ERP</b></strong>
        </RouterLink>
        <nav class="marketing__links">
          <RouterLink v-for="link in LINKS" :key="link.label" :to="link.to">{{ link.label }}</RouterLink>
        </nav>
        <div class="marketing__actions">
          <RouterLink :to="{ name: 'login' }"><el-button text size="large">Giriş yap</el-button></RouterLink>
          <RouterLink :to="{ name: 'apply' }"><el-button type="primary" size="large" round>Başvurun</el-button></RouterLink>
        </div>
      </div>
    </header>
    <main><slot /></main>
    <footer class="marketing__foot blueprint">
      <div class="marketing__row marketing__row--foot">
        <BrandMark tagline="Şantiyeniz cebinizde" />
        <nav>
          <RouterLink :to="{ name: 'pricing' }">Fiyatlar</RouterLink>
          <RouterLink :to="{ name: 'apply' }">Başvuru</RouterLink>
          <RouterLink :to="{ name: 'login' }">Giriş</RouterLink>
        </nav>
        <small>© {{ year }} Constructor ERP · Müteahhitler için şantiye yönetimi</small>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.marketing {
  min-height: var(--layout-app-height);
  background: var(--surface);
}

.marketing__top {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid var(--border-soft);
  background: rgb(255 255 255 / 0.88);
  backdrop-filter: blur(12px);
}

.marketing__row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  max-width: var(--layout-board-width);
  margin-inline: auto;
  padding: var(--space-3) var(--space-6);
}

.marketing__brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--brand-deep);
  font-size: var(--text-md);
  text-decoration: none;
}

.marketing__brand b {
  color: var(--brand-primary);
}

.marketing__links {
  display: flex;
  flex: 1;
  gap: var(--space-6);
}

.marketing__links a,
.marketing__foot nav a {
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
  text-decoration: none;
}

.marketing__links a:hover {
  color: var(--brand-primary);
}

.marketing__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.marketing__foot {
  color: var(--brand-on-deep);
}

.marketing__row--foot {
  flex-wrap: wrap;
  justify-content: space-between;
  padding-block: var(--space-10);
}

.marketing__foot nav {
  display: flex;
  gap: var(--space-6);
}

.marketing__foot nav a {
  color: rgb(255 255 255 / 0.8);
}

.marketing__foot small {
  flex-basis: 100%;
  color: rgb(255 255 255 / 0.6);
}
</style>
