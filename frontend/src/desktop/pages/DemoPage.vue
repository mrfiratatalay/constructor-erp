<script setup lang="ts">
import { Briefcase, ClipboardCheck, HardHat, ShieldCheck, Truck } from 'lucide-vue-next'
import type { DemoRole } from '@/core/demo/demoRoles'
import { useDemoEntry } from '@/core/demo/useDemoEntry'
import AuthLayout from '@/desktop/templates/AuthLayout.vue'

/**
 * Projeyi inceleyen kişinin (ör. bir İK uzmanı) kapısı: rol seçer, şifresiz girer. Backend yok; uygulama tarayıcıdaki
 * sahte backend ve örnek veriyle çalışır (core/demo).
 */
const { roles, enter, entering, isPending, errorText, reset, setupPath, sourceUrl, otherViewLabel, switchView } =
  useDemoEntry()

const ROLE_ICONS: Record<DemoRole['key'], typeof Briefcase> = {
  owner: Briefcase,
  lead: ClipboardCheck,
  warehouse: Truck,
  worker: HardHat,
  admin: ShieldCheck,
}
</script>

<template>
  <AuthLayout>
    <section class="demo-page">
      <header>
        <h2 class="demo-page__title">Canlı demo</h2>
        <p class="demo-page__lead">
          Müteahhitler için şantiye yönetimi. Bir rol seçin, şifresiz girin; her rol uygulamayı kendi gözünden görür.
        </p>
      </header>
      <el-alert v-if="errorText" :title="errorText" type="error" :closable="false" show-icon />
      <div class="demo-page__roles">
        <el-card v-for="role in roles" :key="role.key" shadow="hover" body-class="demo-page__role">
          <div class="demo-page__role-head">
            <component :is="ROLE_ICONS[role.key]" :size="22" />
            <div>
              <strong>{{ role.title }}</strong>
              <el-text type="info" size="small" tag="div">{{ role.person }}</el-text>
            </div>
          </div>
          <el-text tag="p">{{ role.summary }}</el-text>
          <ul class="demo-page__try">
            <li v-for="item in role.tryThis" :key="item"><el-text type="info" size="small">{{ item }}</el-text></li>
          </ul>
          <el-button type="primary" :loading="isPending && entering === role.key" :disabled="isPending" @click="enter(role)">
            {{ role.title }} olarak gir
          </el-button>
        </el-card>
      </div>
      <el-divider content-position="left">Başka yollar</el-divider>
      <div class="demo-page__links">
        <el-button tag="a" :href="setupPath">Yeni bir firmanın kurulumunu dene</el-button>
        <el-button tag="a" href="/">Tanıtım sitesini gez</el-button>
        <el-button @click="switchView">{{ otherViewLabel }}</el-button>
        <el-button tag="a" :href="sourceUrl" target="_blank" rel="noopener">Kaynak kod (GitHub)</el-button>
        <el-button text type="danger" @click="reset">Demoyu sıfırla</el-button>
      </div>
      <el-text type="info" size="small" tag="p">
        Veriler örnektir; kişiler ve firmalar gerçek değildir. Yaptığınız her şey yalnızca bu tarayıcıda kalır. Giriş
        ekranından girmek isterseniz şifre: <strong>demo</strong>
      </el-text>
    </section>
  </AuthLayout>
</template>

<style scoped>
.demo-page {
  display: grid;
  gap: var(--space-5);
  width: min(100%, 820px);
}

.demo-page__title {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.demo-page__lead {
  margin: var(--space-2) 0 0;
  color: var(--text-muted);
}

.demo-page__roles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-4);
}

:deep(.demo-page__role) {
  display: grid;
  gap: var(--space-3);
  align-content: start;
  height: 100%;
}

.demo-page__role-head {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  color: var(--brand-primary);
}

.demo-page__role-head strong {
  color: var(--text-strong);
}

.demo-page__try {
  margin: 0;
  padding-left: var(--space-5);
}

.demo-page__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.demo-page__links .el-button + .el-button {
  margin-left: 0;
}
</style>
