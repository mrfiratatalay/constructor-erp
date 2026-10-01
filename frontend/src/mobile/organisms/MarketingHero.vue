<script setup lang="ts">
import ProductPreview from '@/shared/organisms/ProductPreview.vue'
</script>

<template>
  <section class="marketing-hero">
    <div class="marketing-container">
      <div class="marketing-hero__copy">
        <span class="marketing-hero__eyebrow"><span />ŞANTİYE YÖNETİMİ</span>
        <h1><span>Saha hareketli.</span><em>Kontrol sizde.</em></h1>
        <p>Sahadan güncellemeler, yoklama, malzeme hareketleri ve ilerleme tek yerde. Ekibiniz telefondan çalışır, siz her yerden takip edersiniz.</p>
        <div class="marketing-hero__actions">
          <RouterLink v-slot="{ href, navigate }" :to="{ name: 'apply' }" custom>
            <van-button tag="a" :href="href" block color="var(--mk-yellow)" class="marketing-hero__primary"
              @click="navigate">Tanıtım isteyin<van-icon name="arrow" /></van-button>
          </RouterLink>
          <RouterLink v-slot="{ href, navigate }" :to="{ name: 'landing', hash: '#ozellikler' }" custom>
            <van-button tag="a" :href="href" block plain class="marketing-hero__secondary"
              @click="navigate">Ürünü keşfedin<van-icon name="arrow-down" /></van-button>
          </RouterLink>
        </div>
        <ul class="marketing-hero__promises">
          <li><van-icon name="passed" />Tarayıcıda çalışır</li>
          <li><van-icon name="passed" />Telefon ve bilgisayarda</li>
          <li><van-icon name="passed" />Firmanıza özel alan</li>
        </ul>
      </div>
      <ProductPreview class="marketing-hero__preview" />
    </div>
  </section>
</template>

<style scoped>
.marketing-hero { position: relative; overflow: hidden; padding: 52px 0 32px; color: #fff; background: radial-gradient(ellipse at 95% 0%, rgb(61 90 148 / .32), transparent 65%), var(--mk-dark); }
.marketing-hero__copy { max-width: 560px; margin-inline: auto; }
.marketing-hero__eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 8px 11px; border: 1px solid rgb(255 255 255 / .16); border-radius: 999px; color: rgb(255 255 255 / .8); font-size: 9px; font-weight: 700; letter-spacing: .16em; }
.marketing-hero__eyebrow > span { width: 5px; height: 5px; border-radius: 50%; background: var(--mk-yellow); }
.marketing-hero h1 { margin: 25px 0 0; font-size: clamp(36px, 10vw, 64px); font-weight: 800; letter-spacing: -.055em; line-height: 1.12; }
.marketing-hero h1 span, .marketing-hero h1 em { display: block; }
.marketing-hero h1 em { margin-top: 4px; color: var(--mk-yellow); font-style: normal; }
.marketing-hero__copy > p { margin: 23px 0 0; color: rgb(255 255 255 / .68); font-size: 14px; line-height: 1.85; }
.marketing-hero__actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr)); gap: 10px; margin-top: 28px; }
.marketing-hero__actions a { text-decoration: none; }
.marketing-hero__actions .van-button { height: 48px; border-radius: 10px; font-size: 13px; font-weight: 700; }
.marketing-hero__primary { color: var(--mk-dark) !important; }
.marketing-hero__secondary { border-color: rgb(255 255 255 / .2); background: rgb(255 255 255 / .03); color: #fff; }
.marketing-hero__actions .van-icon { margin-left: 12px; font-size: 13px; }
.marketing-hero__promises { display: flex; flex-wrap: wrap; gap: 12px 18px; margin: 25px 0 0; padding: 0; list-style: none; }
.marketing-hero__promises li { display: inline-flex; align-items: center; gap: 5px; color: rgb(255 255 255 / .56); font-size: 10px; }
.marketing-hero__promises .van-icon { color: rgb(255 255 255 / .76); font-size: 12px; }
.marketing-hero__preview { max-width: 560px; margin: 32px auto 0; }
</style>
