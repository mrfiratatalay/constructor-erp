<script setup lang="ts">
import { ArrowRight, Mail, Phone } from 'lucide-vue-next'
import { CONTACT } from '@/core/marketing/marketingCopy'
import ProductMark from '@/shared/atoms/ProductMark.vue'
import '@/shared/styles/marketing.css'

const links = [
  { label: 'Ürün', to: { name: 'landing', hash: '#ozellikler' } },
  { label: 'Nasıl başlanır?', to: { name: 'landing', hash: '#baslangic' } },
  { label: 'Fiyatlar', to: { name: 'pricing' } },
]
const year = new Date().getFullYear()
</script>

<template>
  <div class="marketing-site marketing-desktop">
    <header class="marketing-top">
      <div class="marketing-container marketing-top__row">
        <RouterLink :to="{ name: 'landing' }" class="marketing-brand" aria-label="Constructor ERP ana sayfa">
          <ProductMark :size="34" /><strong>Constructor <b>ERP</b></strong>
        </RouterLink>
        <nav class="marketing-top__links" aria-label="Site menüsü">
          <RouterLink v-for="link in links" :key="link.label" :to="link.to">{{ link.label }}</RouterLink>
        </nav>
        <div class="marketing-top__actions">
          <RouterLink :to="{ name: 'login' }" class="marketing-top__login">Giriş yap</RouterLink>
          <RouterLink :to="{ name: 'apply' }"><el-button type="primary" class="marketing-top__cta">
            Tanıtım isteyin<ArrowRight :size="15" aria-hidden="true" />
          </el-button></RouterLink>
        </div>
      </div>
    </header>
    <main id="marketing-main"><slot /></main>
    <footer class="marketing-footer">
      <div class="marketing-container">
        <div class="marketing-footer__grid">
          <div class="marketing-footer__intro">
            <RouterLink :to="{ name: 'landing' }" class="marketing-brand">
              <ProductMark :size="40" /><strong>Constructor <b>ERP</b></strong>
            </RouterLink>
            <p>Sahadaki iş ile ofisteki takibi<br>aynı çalışma alanında buluşturur.</p>
          </div>
          <nav class="marketing-footer__links" aria-label="Ürün bağlantıları">
            <span>ÜRÜN</span>
            <RouterLink v-for="link in links" :key="link.label" :to="link.to">{{ link.label }}</RouterLink>
            <RouterLink :to="{ name: 'landing', hash: '#sss' }">Sık sorulanlar</RouterLink>
          </nav>
          <nav class="marketing-footer__links" aria-label="Hesap bağlantıları">
            <span>BİRLİKTE BAŞLAYALIM</span>
            <RouterLink :to="{ name: 'apply' }">Tanıtım isteyin</RouterLink>
            <RouterLink :to="{ name: 'login' }">Hesabınıza giriş yapın</RouterLink>
            <a v-if="CONTACT.phone" :href="CONTACT.phoneHref"><Phone :size="14" aria-hidden="true" />{{ CONTACT.phone }}</a>
            <a v-if="CONTACT.email" :href="`mailto:${CONTACT.email}`"><Mail :size="14" aria-hidden="true" />{{ CONTACT.email }}</a>
          </nav>
        </div>
        <div class="marketing-footer__bottom"><small>© {{ year }} Constructor ERP</small><span>Şantiyenizle aynı sayfada.</span></div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.marketing-desktop { display: flex; flex-direction: column; min-height: var(--layout-app-height); }
.marketing-desktop > main { flex: 1; min-width: 0; }
.marketing-top { position: sticky; top: 0; z-index: 20; border-bottom: 1px solid var(--mk-line); background: rgb(255 255 255 / .94); backdrop-filter: blur(16px); }
.marketing-top__row { display: flex; align-items: center; flex-wrap: wrap; gap: 14px 24px; padding-block: 16px; }
.marketing-brand { display: flex; align-items: center; gap: 10px; color: var(--mk-ink); text-decoration: none; white-space: nowrap; }
.marketing-brand strong { font-size: 16px; font-weight: var(--weight-bold); letter-spacing: -.035em; }
.marketing-brand b { color: var(--brand-primary); font-weight: var(--weight-black); }
.marketing-top__links { display: flex; flex: 1; justify-content: center; align-items: center; gap: 24px; }
.marketing-top__links a { color: var(--mk-muted); font-size: 12px; font-weight: var(--weight-semibold); text-decoration: none; white-space: nowrap; }
.marketing-top__links a:hover { color: var(--mk-ink); }
.marketing-top__actions { display: flex; align-items: center; gap: 20px; margin-left: auto; }
.marketing-top__actions > a { text-decoration: none; }
.marketing-top__login { padding-block: 10px; color: var(--mk-ink); font-size: 12px; font-weight: var(--weight-semibold); white-space: nowrap; }
.marketing-top__cta { height: 42px; padding-inline: 18px; border-radius: 10px; font-size: 12px; --el-button-bg-color: var(--mk-ink); --el-button-border-color: var(--mk-ink); --el-button-hover-bg-color: var(--brand-deep); --el-button-hover-border-color: var(--brand-deep); }
.marketing-top__cta :deep(span) { display: flex; align-items: center; gap: 10px; }
.marketing-footer { background: var(--mk-paper); border-top: 1px solid var(--mk-line); }
.marketing-footer__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 40px; padding-block: 56px; }
.marketing-footer__intro p { margin: 20px 0 0; font-size: 13px; line-height: 1.8; color: var(--mk-muted); }
.marketing-footer__links { display: grid; align-content: start; justify-items: start; gap: 14px; }
.marketing-footer__links > span { margin-bottom: 4px; font-size: 10px; font-weight: var(--weight-bold); letter-spacing: .1em; color: var(--mk-muted); }
.marketing-footer__links a { display: inline-flex; align-items: center; gap: 8px; color: var(--mk-ink); font-size: 13px; text-decoration: none; overflow-wrap: anywhere; }
.marketing-footer__links a:hover { text-decoration: underline; }
.marketing-footer__bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; border-top: 1px solid var(--mk-line); padding-block: 24px; color: var(--mk-muted); font-size: 11px; }
.marketing-footer__bottom small { font-size: inherit; }
</style>
