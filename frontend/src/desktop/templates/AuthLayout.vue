<script setup lang="ts">
import { Camera, ClipboardCheck, ShieldCheck } from 'lucide-vue-next'
import BrandMark from '@/shared/molecules/BrandMark.vue'

/**
 * Oturum dışı ekranların (giriş, kurulum) masaüstü iskeleti: solda ürünün lacivert, ızgaralı paneli, sağda form.
 * Ürün markası burada öne çıkar; firmanın markası çalışma alanındadır.
 */
const POINTS = [
  { icon: Camera, text: 'Sahadan fotoğraf, video ve sorunlar anında elinizde' },
  { icon: ClipboardCheck, text: 'Yoklama, puantaj, malzeme ve ilerleme tek defterde' },
  { icon: ShieldCheck, text: 'Her firma yalnızca kendi verisini görür' },
]
</script>

<template>
  <div class="auth-layout">
    <aside class="auth-layout__brand blueprint">
      <RouterLink to="/" class="auth-layout__home" aria-label="Constructor ERP ana sayfa">
        <BrandMark size="md" />
      </RouterLink>
      <div class="auth-layout__pitch">
        <h1>Şantiyeleriniz, ekibiniz ve malzemeniz tek yerde.</h1>
        <ul>
          <li v-for="point in POINTS" :key="point.text">
            <component :is="point.icon" :size="20" /> <span>{{ point.text }}</span>
          </li>
        </ul>
      </div>
      <small>© Constructor ERP</small>
    </aside>
    <main class="auth-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  display: grid;
  grid-template-columns: minmax(360px, 44%) 1fr;
  min-height: var(--layout-app-height);
  background: var(--canvas);
}

.auth-layout__brand {
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: var(--space-8) clamp(var(--space-8), 5vw, 72px);
  color: var(--brand-on-deep);
}

.auth-layout__home {
  justify-self: start;
  text-decoration: none;
}

.auth-layout__pitch {
  display: grid;
  align-content: center;
  gap: var(--space-6);
  max-width: 460px;
}

.auth-layout__pitch h1 {
  margin: 0;
  font-size: clamp(28px, 2.6vw, 38px);
  font-weight: var(--weight-black);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.auth-layout__pitch ul {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.auth-layout__pitch li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: rgb(255 255 255 / 0.82);
}

.auth-layout__pitch li svg {
  flex: none;
  color: var(--brand-signature);
}

.auth-layout__brand small {
  color: rgb(255 255 255 / 0.5);
}

.auth-layout__main {
  display: grid;
  place-items: center;
  padding: var(--space-8);
  overflow-y: auto;
}
</style>
