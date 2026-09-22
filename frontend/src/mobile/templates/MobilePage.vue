<script setup lang="ts">
import { useSlots } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Vant'ın başlık çubuğu; renk, yükseklik ve yazı ağırlığı tema değişkenlerinden gelir.
 * brand: ana ekranın lacivert, ızgaralı başlığı (ad solda, action sağda).
 * footer: ekranın altında sabit duran alan (şantiye sayfasındaki gönderme çubuğu).
 * tabbar: altta sekme çubuğu var mı; yoksa footer ekranın en altına oturur.
 */
const {
  title,
  back = false,
  brand = false,
  tabbar = true,
} = defineProps<{ title: string; back?: boolean; brand?: boolean; tabbar?: boolean }>()
const slots = useSlots()
const router = useRouter()

function goBack() {
  if (window.history.state?.back) router.back()
  else void router.replace({ name: 'sites' })
}
</script>

<template>
  <van-nav-bar :title="brand ? undefined : title" :left-arrow="back" :border="!brand"
    :class="{ 'mobile-page__bar--brand': brand }" safe-area-inset-top fixed placeholder @click-left="goBack">
    <template v-if="brand" #left><span class="mobile-page__brand">{{ title }}</span></template>
    <template #right><slot name="action" /></template>
  </van-nav-bar>
  <main class="mobile-page" :class="{ 'mobile-page--with-footer': slots.footer, 'mobile-page--no-tabbar': !tabbar }">
    <slot />
  </main>
  <div v-if="slots.footer" class="mobile-page__footer" :class="{ 'mobile-page__footer--no-tabbar': !tabbar }">
    <slot name="footer" />
  </div>
</template>

<style scoped>
.mobile-page {
  display: grid;
  gap: var(--space-4);
  align-content: start;
  padding: var(--space-4);
  /* Alt sekme çubuğu içeriği kapatmasın; telefonun alt çentik boşluğu da hesaba katılır. */
  padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
}

.mobile-page--with-footer {
  padding-bottom: calc(170px + env(safe-area-inset-bottom, 0px));
}

.mobile-page--with-footer.mobile-page--no-tabbar {
  padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px));
}

/* Sınıf, Vant'ın yer tutucusuna düşer; sabit çubuk onun içindedir ve renkleri buradan miras alır. */
.mobile-page__bar--brand {
  --van-nav-bar-background: var(--brand-deep);
  --van-nav-bar-icon-color: var(--brand-on-deep);
  --van-nav-bar-text-color: var(--brand-on-deep);
}

.mobile-page__bar--brand :deep(.van-nav-bar) {
  background-image: var(--blueprint-grid);
  background-size: var(--blueprint-grid-size);
  color: rgb(255 255 255 / 0.72);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.mobile-page__brand {
  color: var(--brand-on-deep);
  font-size: var(--text-md);
  font-weight: var(--weight-black);
  letter-spacing: -0.01em;
}

.mobile-page__footer {
  position: fixed;
  right: 0;
  bottom: calc(var(--van-tabbar-height) + env(safe-area-inset-bottom, 0px));
  left: 0;
  z-index: 10;
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--border-soft);
  background: rgb(255 255 255 / 0.94);
  backdrop-filter: blur(10px);
}

/* Sekme çubuğu yoksa çubuk ekranın dibine oturur; telefonun alt çentiği için boşluk bırakılır. */
.mobile-page__footer--no-tabbar {
  bottom: 0;
  padding-bottom: calc(var(--space-2) + env(safe-area-inset-bottom, 0px));
}
</style>
