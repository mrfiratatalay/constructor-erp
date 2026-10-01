<template>
  <section class="marketing-closing">
    <div class="marketing-container marketing-closing__inner">
      <span>CONSTRUCTOR ERP İLE TANIŞIN</span>
      <h2>Bir sonraki iş gününe<br />daha net başlayın.</h2>
      <p>Constructor ERP’yi firmanızın iş akışı üzerinden birlikte değerlendirelim.</p>
      <div class="marketing-closing__actions">
        <RouterLink v-slot="{ href, navigate }" :to="{ name: 'apply' }" custom>
          <van-button tag="a" :href="href" block color="var(--mk-yellow)" class="marketing-closing__primary"
            @click="navigate">Tanıtım isteyin<van-icon name="arrow" /></van-button>
        </RouterLink>
        <RouterLink :to="{ name: 'pricing' }" class="marketing-closing__pricing">Paketleri inceleyin<van-icon name="arrow" /></RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marketing-closing { padding-block: 64px; color: #fff; background: radial-gradient(ellipse at 100% 100%, rgb(58 86 141 / .22), transparent 60%), var(--mk-dark); }
.marketing-closing__inner { max-width: 580px; text-align: center; }
.marketing-closing__inner > span { color: rgb(255 255 255 / .5); font-size: 9px; font-weight: 700; letter-spacing: .15em; }
.marketing-closing h2 { margin: 20px 0 0; font-size: clamp(27px, 7.5vw, 44px); line-height: 1.24; font-weight: 750; letter-spacing: -.04em; }
.marketing-closing p { max-width: 400px; margin: 20px auto 0; color: rgb(255 255 255 / .64); font-size: 13px; line-height: 1.8; }
.marketing-closing__actions { display: grid; gap: 19px; max-width: 310px; margin: 28px auto 0; }
.marketing-closing__actions a { text-decoration: none; }
.marketing-closing__primary { height: 48px; border-radius: 10px; color: var(--mk-dark) !important; font-size: 13px; font-weight: 750; }
.marketing-closing__actions .van-icon { margin-left: 10px; font-size: 12px; }
.marketing-closing__pricing { color: rgb(255 255 255 / .74); font-size: 12px; font-weight: 600; }
</style>
