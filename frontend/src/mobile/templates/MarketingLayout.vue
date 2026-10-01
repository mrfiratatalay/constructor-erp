<script setup lang="ts">
import { ref } from 'vue'
import { CONTACT } from '@/core/marketing/marketingCopy'
import ProductMark from '@/shared/atoms/ProductMark.vue'
import '@/shared/styles/marketing.css'

const menuOpen = ref(false)
const year = new Date().getFullYear()
const links = [
  { label: 'Ürün', to: { name: 'landing', hash: '#ozellikler' } },
  { label: 'Nasıl başlanır?', to: { name: 'landing', hash: '#baslangic' } },
  { label: 'Paketler ve fiyatlar', to: { name: 'pricing' } },
  { label: 'Sık sorulanlar', to: { name: 'landing', hash: '#sss' } },
]
</script>

<template>
  <div class="marketing-site marketing marketing-mobile">
    <header class="marketing-mobile__header">
      <div class="marketing-mobile__header-row">
        <RouterLink :to="{ name: 'landing' }" class="marketing-mobile__brand" aria-label="Constructor ERP ana sayfa">
          <ProductMark :size="28" /><strong>Constructor <b>ERP</b></strong>
        </RouterLink>
        <RouterLink :to="{ name: 'login' }" class="marketing-mobile__login">Giriş</RouterLink>
        <van-button class="marketing-mobile__menu-button" icon="wap-nav" aria-label="Menüyü aç" :aria-expanded="menuOpen"
          @click="menuOpen = true" />
      </div>
    </header>
    <main><slot /></main>
    <footer class="marketing-mobile__footer">
      <div class="marketing-container marketing-mobile__footer-inner">
        <RouterLink :to="{ name: 'landing' }" class="marketing-mobile__brand marketing-mobile__brand--footer">
          <ProductMark :size="36" /><strong>Constructor <b>ERP</b></strong>
        </RouterLink>
        <p>Saha ile ofis, aynı çalışma alanında.</p>
        <nav class="marketing-mobile__footer-links" aria-label="Alt bilgi bağlantıları">
          <RouterLink v-for="link in links" :key="link.label" :to="link.to">{{ link.label }}</RouterLink>
          <RouterLink :to="{ name: 'apply' }">Tanıtım isteyin</RouterLink>
          <RouterLink :to="{ name: 'login' }">Giriş yapın</RouterLink>
        </nav>
        <div v-if="CONTACT.phone || CONTACT.email" class="marketing-mobile__contact">
          <span>İLETİŞİM</span>
          <a v-if="CONTACT.phone" :href="CONTACT.phoneHref">{{ CONTACT.phone }}</a>
          <a v-if="CONTACT.email" :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a>
        </div>
        <small>© {{ year }} Constructor ERP</small>
      </div>
    </footer>
  </div>
  <van-action-sheet v-model:show="menuOpen" title="Menü" teleport="body" class="marketing-mobile-menu" :safe-area-inset-bottom="false">
    <nav aria-label="Site menüsü">
      <RouterLink v-for="link in links" :key="link.label" :to="link.to" @click="menuOpen = false">
        <van-cell :title="link.label" is-link />
      </RouterLink>
    </nav>
    <div class="marketing-mobile-menu__action">
      <RouterLink :to="{ name: 'apply' }" @click="menuOpen = false">
        <van-button type="primary" block>Tanıtım isteyin</van-button>
      </RouterLink>
    </div>
  </van-action-sheet>
</template>

<style scoped>
.marketing-mobile { --mk-gutter: 20px; --mk-space: 64px; display: flex; flex-direction: column; min-height: var(--layout-app-height); background: #fff; }
.marketing-mobile > main { display: flex; flex: 1; flex-direction: column; min-width: 0; }
.marketing-mobile__header { position: sticky; top: 0; z-index: 20; border-bottom: 1px solid var(--mk-line); background: rgb(255 255 255 / .94); backdrop-filter: blur(16px); }
.marketing-mobile__header-row { display: flex; align-items: center; gap: 10px; max-width: var(--mk-width); margin-inline: auto; padding: calc(12px + env(safe-area-inset-top, 0px)) 16px 12px; }
.marketing-mobile__brand { display: flex; align-items: center; gap: 8px; min-width: 0; color: var(--mk-ink); text-decoration: none; }
.marketing-mobile__brand strong { font-size: 14px; font-weight: 750; letter-spacing: -.035em; white-space: nowrap; }
.marketing-mobile__brand b { color: var(--brand-primary); font-weight: 800; }
.marketing-mobile__login { margin-left: auto; padding: 8px 3px; color: var(--mk-ink); font-size: 12px; font-weight: 650; text-decoration: none; }
.marketing-mobile__menu-button { width: 36px; height: 36px; padding: 0; flex: none; border: 1px solid var(--mk-line); border-radius: 10px; color: var(--mk-ink); background: #fff; font-size: 19px; }
.marketing-mobile__footer { border-top: 1px solid var(--mk-line); background: var(--mk-paper); }
.marketing-mobile__footer-inner { display: grid; gap: 24px; padding-block: 40px calc(24px + env(safe-area-inset-bottom, 0px)); }
.marketing-mobile__brand--footer strong { font-size: 17px; }
.marketing-mobile__footer p { margin: -10px 0 0; color: var(--mk-muted); font-size: 13px; line-height: 1.7; }
.marketing-mobile__footer-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 12px; }
.marketing-mobile__footer-links a, .marketing-mobile__contact a { color: var(--mk-ink); font-size: 12px; text-decoration: none; overflow-wrap: anywhere; }
.marketing-mobile__contact { display: grid; gap: 10px; border-top: 1px solid var(--mk-line); padding-top: 24px; }
.marketing-mobile__contact > span { color: var(--mk-muted); font-size: 10px; font-weight: 700; letter-spacing: .1em; }
.marketing-mobile__footer small { border-top: 1px solid var(--mk-line); padding-top: 20px; color: var(--mk-muted); font-size: 11px; }
.marketing-mobile-menu a { text-decoration: none; }
.marketing-mobile-menu__action { padding: 24px 20px calc(20px + env(safe-area-inset-bottom, 0px)); }
</style>
