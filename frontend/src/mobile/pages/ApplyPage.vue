<script setup lang="ts">
import { CONTACT } from '@/core/marketing/marketingCopy'
import SalesRequestForm from '@/mobile/organisms/SalesRequestForm.vue'
import MarketingLayout from '@/mobile/templates/MarketingLayout.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
</script>

<template>
  <MarketingLayout>
    <section class="apply-mobile">
      <div class="marketing-section apply-mobile__inner">
        <SectionHeading :level="1" eyebrow="TANITIM GÖRÜŞMESİ" title="Constructor ERP’yi birlikte değerlendirelim"
          lead="Firmanızı ve ihtiyaçlarınızı anlatın; size uygun kullanım ve paketi görüşelim." class="apply-mobile__heading" />
        <SalesRequestForm />
        <div v-if="CONTACT.phone || CONTACT.email" class="apply-mobile__contact">
          <span>DOĞRUDAN İLETİŞİM</span>
          <a v-if="CONTACT.phone" :href="CONTACT.phoneHref"><van-icon name="phone-o" />{{ CONTACT.phone }}</a>
          <a v-if="CONTACT.email" :href="`mailto:${CONTACT.email}`"><van-icon name="envelop-o" />{{ CONTACT.email }}</a>
        </div>
      </div>
    </section>
  </MarketingLayout>
</template>

<style scoped>
.apply-mobile { flex: 1; background: var(--mk-paper); }
.apply-mobile__inner { max-width: 650px; }
.apply-mobile__heading { max-width: 560px; }
.apply-mobile__heading :deep(h1) { color: var(--mk-ink); font-size: clamp(30px, 7.8vw, 44px); line-height: 1.25; letter-spacing: -.045em; }
.apply-mobile__heading :deep(p) { font-size: 13px; line-height: 1.8; }
.apply-mobile__heading :deep(small) { font-size: 9px; letter-spacing: .13em; }
.apply-mobile__contact { display: grid; gap: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--mk-line); }
.apply-mobile__contact > span { color: var(--mk-muted); font-size: 9px; font-weight: 700; letter-spacing: .12em; }
.apply-mobile__contact a { display: flex; align-items: center; gap: 9px; width: fit-content; color: var(--mk-ink); font-size: 12px; text-decoration: none; overflow-wrap: anywhere; }
.apply-mobile__contact .van-icon { flex: none; color: var(--mk-muted); font-size: 15px; }
</style>
