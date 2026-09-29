<script setup lang="ts">
import { Mail, Phone } from 'lucide-vue-next'
import { CONTACT, START_STEPS } from '@/core/marketing/marketingCopy'
import SalesRequestFormCard from '@/desktop/organisms/SalesRequestFormCard.vue'
import MarketingLayout from '@/desktop/templates/MarketingLayout.vue'
</script>

<template>
  <MarketingLayout>
    <section class="apply">
      <div class="apply__copy">
        <small>Başvuru</small>
        <h1>Firmanızı birlikte kuralım</h1>
        <p>Formu doldurun; sizi arayıp ihtiyacınızı dinleyelim, uygun paketi birlikte seçelim.</p>
        <ol>
          <li v-for="(step, index) in START_STEPS" :key="step.title">
            <b>{{ index + 1 }}</b><span><strong>{{ step.title }}</strong>{{ step.text }}</span>
          </li>
        </ol>
        <div v-if="CONTACT.phone || CONTACT.email" class="apply__contact">
          <a v-if="CONTACT.phone" :href="CONTACT.phoneHref"><Phone :size="16" /> {{ CONTACT.phone }}</a>
          <a v-if="CONTACT.email" :href="`mailto:${CONTACT.email}`"><Mail :size="16" /> {{ CONTACT.email }}</a>
        </div>
      </div>
      <SalesRequestFormCard />
    </section>
  </MarketingLayout>
</template>

<style scoped>
.apply {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: var(--space-10);
  align-items: start;
  max-width: var(--layout-board-width);
  margin-inline: auto;
  padding: 72px var(--space-6) 96px;
}

.apply small {
  color: var(--brand-primary);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.apply h1 {
  margin: var(--space-2) 0 0;
  font-size: clamp(28px, 3.4vw, 42px);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.apply__copy > p {
  margin: var(--space-3) 0 var(--space-8);
  color: var(--text-muted);
  font-size: var(--text-md);
  line-height: 1.6;
}

.apply ol {
  display: grid;
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.apply li {
  display: flex;
  gap: var(--space-3);
}

.apply li b {
  display: grid;
  flex: none;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--brand-tint);
  color: var(--brand-primary);
}

.apply li strong {
  display: block;
}

.apply li span {
  color: var(--text-muted);
  line-height: 1.5;
}

.apply li strong {
  color: var(--text-strong);
}

.apply__contact {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  margin-top: var(--space-8);
}

.apply__contact a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--brand-primary);
  font-weight: var(--weight-bold);
  text-decoration: none;
}

@media (width < 960px) {
  .apply { grid-template-columns: 1fr; }
}
</style>
