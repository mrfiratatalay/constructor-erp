<script setup lang="ts">
import type { DemoRole } from '@/core/demo/demoRoles'
import { useDemoEntry } from '@/core/demo/useDemoEntry'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

/**
 * Projeyi inceleyen kişinin (ör. bir İK uzmanı) kapısı: rol seçer, şifresiz girer. Backend yok; uygulama tarayıcıdaki
 * sahte backend ve örnek veriyle çalışır (core/demo).
 */
const { roles, enter, entering, isPending, errorText, reset, setupPath, sourceUrl, otherViewLabel, switchView } =
  useDemoEntry()

const ROLE_ICONS: Record<DemoRole['key'], string> = {
  owner: 'manager-o',
  lead: 'todo-list-o',
  warehouse: 'logistics',
  worker: 'user-o',
  admin: 'setting-o',
}
</script>

<template>
  <main class="demo-page">
    <BrandLogo class="demo-page__logo" size="lg" />
    <header class="demo-page__intro">
      <h1>Canlı demo</h1>
      <p>Müteahhitler için şantiye yönetimi. Bir rol seçin, şifresiz girin.</p>
    </header>
    <van-notice-bar v-if="errorText" left-icon="warning-o" :text="errorText" wrapable />
    <van-cell-group inset title="Kim olarak girmek istersiniz?">
      <van-cell v-for="role in roles" :key="role.key" :icon="ROLE_ICONS[role.key]" is-link center
        :title="`${role.title} · ${role.person}`" :label="role.summary" @click="enter(role)">
        <template #right-icon>
          <van-loading v-if="isPending && entering === role.key" size="18" />
          <van-icon v-else name="arrow" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group inset title="Başka yollar">
      <van-cell icon="add-o" title="Yeni bir firmanın kurulumunu dene" label="Satın alan firmanın sihirbazı" is-link
        :to="setupPath" />
      <van-cell icon="home-o" title="Tanıtım sitesini gez" is-link to="/" />
      <van-cell icon="desktop-o" :title="otherViewLabel" is-link @click="switchView" />
      <van-cell icon="link-o" title="Kaynak kod (GitHub)" is-link :url="sourceUrl" />
      <van-cell icon="replay" title="Demoyu sıfırla" label="Yaptığınız değişiklikler silinir" @click="reset" />
    </van-cell-group>
    <p class="demo-page__note">
      Veriler örnektir; kişiler ve firmalar gerçek değildir. Yaptığınız her şey yalnızca bu tarayıcıda kalır.
      Giriş ekranından girmek isterseniz şifre: <strong>demo</strong>
    </p>
  </main>
</template>

<style scoped>
.demo-page {
  display: grid;
  gap: var(--space-4);
  align-content: start;
  max-width: var(--layout-phone-column);
  margin-inline: auto;
  /* Kenar boşluğunu sayfa verir (temada inset grupların boşluğu kapalı, giriş sayfasındaki gibi). */
  padding: var(--space-8) var(--space-4);
}

.demo-page__logo {
  justify-self: center;
}

.demo-page__intro {
  text-align: center;
}

.demo-page__intro h1 {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
}

.demo-page__intro p,
.demo-page__note {
  margin: var(--space-2) 0 0;
  color: var(--text-muted);
  line-height: 1.5;
}

.demo-page__note {
  font-size: var(--text-sm);
  text-align: center;
}
</style>
