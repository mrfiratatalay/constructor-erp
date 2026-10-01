<script setup lang="ts">
import { Mail, Phone } from 'lucide-vue-next'
import { CONTACT, START_STEPS } from '@/core/marketing/marketingCopy'
import SalesRequestFormCard from '@/desktop/organisms/SalesRequestFormCard.vue'
import MarketingLayout from '@/desktop/templates/MarketingLayout.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
</script>

<template>
  <MarketingLayout>
    <section class="apply">
      <div class="apply__copy">
        <SectionHeading eyebrow="Tanıtım görüşmesi" title="Constructor ERP’yi birlikte değerlendirelim"
          lead="Firmanızı ve ihtiyaçlarınızı anlatın; size uygun kullanım ve paketi görüşelim." align="left" :level="1" />
        <ol class="apply__steps">
          <li v-for="(step, index) in START_STEPS" :key="step.title">
            <span class="apply__step-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <div><h2>{{ step.title }}</h2><p>{{ step.text }}</p></div>
          </li>
        </ol>
        <div v-if="CONTACT.phone || CONTACT.email" class="apply__contact">
          <span>Doğrudan iletişim</span>
          <a v-if="CONTACT.phone" :href="CONTACT.phoneHref"><Phone :size="15" aria-hidden="true" />{{ CONTACT.phone }}</a>
          <a v-if="CONTACT.email" :href="`mailto:${CONTACT.email}`"><Mail :size="15" aria-hidden="true" />{{ CONTACT.email }}</a>
        </div>
      </div>
      <SalesRequestFormCard />
    </section>
  </MarketingLayout>
</template>

<style scoped>
.apply {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  align-items: start;
  gap: clamp(40px, 6vw, 80px);
  max-width: var(--mk-width);
  margin-inline: auto;
  padding: var(--mk-space) var(--mk-gutter);
}
.apply__copy { min-width: 0; }
.apply__copy :deep(.section-heading) { margin-bottom: 36px; }
.apply__copy :deep(h1) { color: var(--mk-ink); font-size: clamp(32px, 3.4vw, 44px); line-height: 1.25; letter-spacing: -.035em; }
.apply__copy :deep(.section-heading > p) { max-width: 44ch; color: var(--mk-muted); font-size: 15px; line-height: 1.8; }
.apply__steps { display: grid; gap: 26px; margin: 0; padding: 0; list-style: none; }
.apply__steps li { display: flex; align-items: flex-start; gap: 18px; }
.apply__step-number { flex: none; padding-top: 3px; color: var(--mk-muted); font-size: 12px; font-weight: var(--weight-medium); font-variant-numeric: tabular-nums; }
.apply__steps h2 { margin: 0; color: var(--mk-ink); font-size: 14px; font-weight: var(--weight-semibold); line-height: 1.6; }
.apply__steps p { max-width: 48ch; margin: 6px 0 0; color: var(--mk-muted); font-size: 13px; line-height: 1.8; }
.apply__contact { display: flex; flex-wrap: wrap; gap: 14px 24px; margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--mk-line); }
.apply__contact > span { width: 100%; color: var(--mk-muted); font-size: 11px; }
.apply__contact a { display: inline-flex; align-items: center; gap: 9px; color: var(--mk-ink); font-size: 13px; font-weight: var(--weight-medium); text-decoration: none; overflow-wrap: anywhere; }
.apply__contact a:hover { text-decoration: underline; text-underline-offset: 4px; }
.apply__contact svg { flex: none; }
</style>
