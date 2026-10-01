<script setup lang="ts">
import { PRODUCT_AUDIENCES } from '@/core/marketing/marketingCopy'
import MarketingIcon from '@/shared/atoms/MarketingIcon.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
</script>

<template>
  <section class="marketing-roles">
    <div class="marketing-section marketing-roles__layout">
      <div>
        <SectionHeading align="left" eyebrow="Saha ve ofis" title="Farklı sorumluluklar. Ortak bir çalışma alanı."
          lead="Her ekip üyesi kendi işini takip eder. Şantiyede üretilen bilgi ofiste de ulaşılabilir olur." />
        <p class="marketing-roles__note"><MarketingIcon name="shield" :size="20" />Yetkiler, ekip üyesinin rolüne göre belirlenir.</p>
      </div>
      <ul class="marketing-roles__list">
        <li v-for="audience in PRODUCT_AUDIENCES" :key="audience.role">
          <span class="marketing-roles__icon"><MarketingIcon :name="audience.icon" :size="21" /></span>
          <div><small>{{ audience.role }}</small><h3>{{ audience.title }}</h3><p>{{ audience.text }}</p></div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.marketing-roles { background: var(--mk-paper); border-block: 1px solid var(--mk-line); }
.marketing-roles__layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr)); align-items: center; gap: clamp(32px, 5vw, 72px); }
.marketing-roles__layout :deep(.section-heading) { margin-bottom: 24px; }
.marketing-roles__note { display: flex; align-items: center; gap: 10px; margin: 0; color: var(--mk-muted); font-size: 13px; }
.marketing-roles__note > svg { flex: none; color: var(--brand-primary); }
.marketing-roles__list { display: grid; gap: 0; margin: 0; padding: 8px 24px; list-style: none; background: var(--surface); border: 1px solid var(--mk-line); border-radius: 20px; }
.marketing-roles__list li { display: flex; align-items: flex-start; gap: 16px; padding-block: 24px; }
.marketing-roles__list li + li { border-top: 1px solid var(--mk-line); }
.marketing-roles__icon { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border-radius: 12px; background: var(--brand-tint); color: var(--brand-primary); }
.marketing-roles__list small { color: var(--mk-muted); font-size: 11px; font-weight: var(--weight-semibold); }
.marketing-roles__list h3 { margin: 4px 0 8px; font-size: 17px; letter-spacing: -.025em; }
.marketing-roles__list p { margin: 0; color: var(--mk-muted); font-size: 13px; line-height: 1.75; }
</style>
