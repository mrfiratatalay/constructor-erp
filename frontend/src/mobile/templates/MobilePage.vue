<script setup lang="ts">
import { useSlots } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import BrandTitle from '@/mobile/molecules/BrandTitle.vue'
import PageTitle from '@/mobile/molecules/PageTitle.vue'

/**
 * Vant'ın başlık çubuğu; renk, yükseklik ve yazı ağırlığı tema değişkenlerinden gelir.
 * brand: ana ekranın lacivert, ızgaralı başlığı (firmanın logosu ve adı solda, action sağda); logoUrl firmanın logosu.
 * logoName: logodaki baş harflerin kimin adından çıkacağı; başlık firmanın adı değilse (ör. "Malzemeler") verilir.
 * subtitle: başlığın altındaki ikinci satır (WhatsApp'ta grubun üyeleri gibi).
 * subbar: başlığın hemen altında, sayfa kayarken ona yapışık duran çubuk (şantiyede Sohbet / Saha).
 * footer: ekranın altında sabit duran alan (şantiye sayfasındaki gönderme çubuğu).
 * tabbar: altta sekme çubuğu var mı; yoksa footer ekranın en altına oturur.
 * bottom: içerik azken sayfanın dibine yaslanır — sohbet böyle durur (WhatsApp).
 * heading: WhatsApp'taki sohbet başlığı gibi solda duran başlık (geri oku, fotoğraf, ad); verilirse title yazılmaz.
 */
const {
  title,
  subtitle = '',
  back = false,
  brand = false,
  tabbar = true,
  bottom = false,
  logoUrl = null,
  logoName = null,
} = defineProps<{
  title: string
  subtitle?: string
  back?: boolean
  brand?: boolean
  tabbar?: boolean
  bottom?: boolean
  logoUrl?: string | null
  logoName?: string | null
}>()
const slots = useSlots()
const router = useRouter()

function goBack() {
  if (window.history.state?.back) router.back()
  else void router.replace({ name: 'sites' })
}
</script>

<template>
  <van-nav-bar :title="brand || subtitle || slots.heading ? undefined : title" :left-arrow="back && !slots.heading"
    :border="!brand" :class="['mobile-page__bar', { 'mobile-page__bar--brand': brand }]" safe-area-inset-top fixed
    placeholder @click-left="!slots.heading && goBack()">
    <template v-if="brand" #left>
      <BrandTitle :title="title" :logo-name="logoName" :logo-url="logoUrl" />
    </template>
    <template v-else-if="slots.heading" #left>
      <span class="mobile-page__heading">
        <button v-if="back" type="button" class="mobile-page__back" aria-label="Geri" @click.stop="goBack">
          <ChevronLeft :size="24" />
        </button>
        <slot name="heading" />
      </span>
    </template>
    <template v-if="!brand && subtitle" #title><PageTitle :title="title" :subtitle="subtitle" /></template>
    <template #right><slot name="action" /></template>
  </van-nav-bar>
  <div v-if="slots.subbar" class="mobile-page__subbar">
    <div class="mobile-page__subbar-inner"><slot name="subbar" /></div>
  </div>
  <main class="mobile-page"
    :class="{ 'mobile-page--with-footer': slots.footer, 'mobile-page--no-tabbar': !tabbar, 'mobile-page--bottom': bottom,
              'mobile-page--with-subbar': slots.subbar }">
    <slot />
  </main>
  <div v-if="slots.footer" class="mobile-page__footer" :class="{ 'mobile-page__footer--no-tabbar': !tabbar }">
    <div class="mobile-page__footer-inner"><slot name="footer" /></div>
  </div>
</template>

<style scoped>
/*
 * Telefonda tam genişlik; tablette sayfa, başlık ve gönderme çubuğu aynı ortalı sütunda durur, satırlar
 * ekran boyu uzamaz. Yan çevrilmiş telefonda da sütun ortalandığı için çentik içeriğin dışında kalır.
 */
.mobile-page,
.mobile-page__bar :deep(.van-nav-bar__content),
.mobile-page__subbar-inner,
.mobile-page__footer-inner {
  max-width: var(--layout-phone-column);
  margin-inline: auto;
}

.mobile-page {
  /* Üstte sabit duran başlık (ve varsa alt çubuğu): sayfadaki yapışkan parçalar bunun altına yapışır. */
  --mobile-page-top: calc(var(--van-nav-bar-height) + env(safe-area-inset-top, 0px));
  display: grid;
  gap: var(--space-4);
  align-content: start;
  padding: var(--space-4);
  /* Alt sekme çubuğu içeriği kapatmasın; telefonun alt çentik boşluğu da hesaba katılır. */
  padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
}

.mobile-page--with-subbar {
  --mobile-page-top: calc(var(--van-nav-bar-height) + var(--layout-subbar-height) + env(safe-area-inset-top, 0px));
}

.mobile-page--with-footer {
  padding-bottom: calc(170px + env(safe-area-inset-bottom, 0px));
}

/* Sohbet gibi: az gönderi varken akış ekranın dibinde, gönderme çubuğunun hemen üstünde durur. */
.mobile-page--bottom {
  align-content: end;
  min-height: calc(var(--layout-app-height) - var(--mobile-page-top));
}

/* Normal akışta durur, sayfa kayınca başlığın altına yapışır: içeriğin üstünü hiçbir zaman örtmez. */
.mobile-page__subbar {
  position: sticky;
  top: calc(var(--van-nav-bar-height) + env(safe-area-inset-top, 0px));
  z-index: 5;
  height: var(--layout-subbar-height);
  background: var(--surface);
  box-shadow: 0 1px 0 var(--border-soft);
}

.mobile-page--with-footer.mobile-page--no-tabbar {
  padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px));
}

/*
 * Sayfa içindeki yapışkan parçalar (ör. akıştaki gün başlığı) başlık çubuğunun altından geçer:
 * Vant'ın varsayılanı 1'dir ve sayfadaki her yapışkan öğe onu örtüyordu.
 */
.mobile-page__bar :deep(.van-nav-bar) {
  --van-nav-bar-z-index: 5;
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

.mobile-page__heading {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  max-width: calc(100vw - 120px);
  min-width: 0;
}

.mobile-page__back {
  display: grid;
  place-items: center;
  flex: none;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--brand-primary);
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
