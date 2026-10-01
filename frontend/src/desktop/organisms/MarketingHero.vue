<script setup lang="ts">
import { ArrowRight, Check } from 'lucide-vue-next'
import ProductPreview from '@/shared/organisms/ProductPreview.vue'

const PROMISES = ['Tarayıcıda çalışır', 'Telefon ve bilgisayarda', 'Firmanıza özel alan']
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <span class="hero__eyebrow">ŞANTİYE YÖNETİMİ, TEK BİR YERDE</span>
        <h1><span>Saha hareketli.</span><span class="hero__highlight">Kontrol sizde.</span></h1>
        <p>Sahadan güncellemeler, yoklama, malzeme hareketleri ve işin ilerlemesi aynı yerde.
          Ekibiniz telefondan kaydeder, siz ofisten takip edersiniz.</p>
        <div class="hero__actions">
          <RouterLink :to="{ name: 'apply' }">
            <el-button type="primary" size="large" class="hero__primary">Tanıtım isteyin<ArrowRight :size="17" aria-hidden="true" /></el-button>
          </RouterLink>
          <RouterLink :to="{ name: 'landing', hash: '#ozellikler' }">
            <el-button size="large" plain class="hero__secondary">Ürünü keşfedin</el-button>
          </RouterLink>
        </div>
        <ul class="hero__promises">
          <li v-for="promise in PROMISES" :key="promise"><Check :size="14" aria-hidden="true" />{{ promise }}</li>
        </ul>
      </div>
      <div class="hero__preview"><ProductPreview /></div>
    </div>
  </section>
</template>

<style scoped>
.hero { color: var(--brand-on-deep); background: var(--mk-dark); }
.hero__inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr));
  align-items: center;
  gap: clamp(40px, 5vw, 72px);
  max-width: var(--mk-width);
  margin-inline: auto;
  padding: var(--mk-space) var(--mk-gutter);
}
.hero__copy { min-width: 0; }
.hero__eyebrow { display: block; color: rgb(255 255 255 / 62%); font-size: 11px; font-weight: var(--weight-semibold); letter-spacing: .14em; line-height: 1.6; }
.hero h1 { margin: 26px 0 0; font-size: clamp(48px, 5.5vw, 76px); font-weight: var(--weight-black); letter-spacing: -.055em; line-height: 1.08; text-wrap: initial; }
.hero h1 span { display: block; }
.hero__highlight { color: var(--mk-yellow); }
.hero__copy > p { max-width: 43ch; margin: 28px 0 0; color: rgb(255 255 255 / 72%); font-size: clamp(15px, 1.35vw, 18px); line-height: 1.8; }
.hero__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 32px; }
.hero__actions a { text-decoration: none; }
.hero__actions :deep(.el-button) { height: 50px; padding-inline: 24px; border-radius: 10px; font-size: 14px; font-weight: var(--weight-semibold); }
.hero__primary {
  --el-button-bg-color: var(--mk-yellow);
  --el-button-border-color: var(--mk-yellow);
  --el-button-text-color: var(--mk-dark);
  --el-button-hover-bg-color: #fde047;
  --el-button-hover-border-color: #fde047;
  --el-button-hover-text-color: var(--mk-dark);
  --el-button-active-bg-color: var(--mk-yellow);
  --el-button-active-border-color: var(--mk-yellow);
  --el-button-active-text-color: var(--mk-dark);
}
.hero__primary :deep(span) { display: inline-flex; align-items: center; gap: 12px; }
.hero__secondary {
  --el-button-bg-color: transparent;
  --el-button-text-color: var(--brand-on-deep);
  --el-button-border-color: rgb(255 255 255 / 22%);
  --el-button-hover-bg-color: rgb(255 255 255 / 7%);
  --el-button-hover-border-color: rgb(255 255 255 / 44%);
  --el-button-hover-text-color: var(--brand-on-deep);
  --el-button-active-bg-color: rgb(255 255 255 / 10%);
  --el-button-active-border-color: rgb(255 255 255 / 44%);
  --el-button-active-text-color: var(--brand-on-deep);
}
.hero__promises { display: flex; flex-wrap: wrap; gap: 12px 20px; margin: 32px 0 0; padding: 0; list-style: none; color: rgb(255 255 255 / 55%); font-size: 11px; }
.hero__promises li { display: inline-flex; align-items: center; gap: 7px; }
.hero__promises svg { flex: none; color: rgb(255 255 255 / 72%); }
.hero__preview { min-width: 0; }
.hero a:focus-visible { outline: 2px solid var(--mk-yellow); outline-offset: 5px; border-radius: 10px; }
</style>
