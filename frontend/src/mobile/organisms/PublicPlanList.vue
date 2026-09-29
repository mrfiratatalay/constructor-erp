<script setup lang="ts">
import { Check, Minus } from 'lucide-vue-next'
import { limitsOf, priceOf, usePublicPlans } from '@/core/marketing/usePublicPlans'

/** Paketler telefonda alt alta; öne çıkan paket çerçeveli. "Bu paketi seçin" başvuruyu paketi seçili açar. */
const { plans, isLoading } = usePublicPlans()
</script>

<template>
  <van-loading v-if="isLoading" vertical>Paketler yükleniyor…</van-loading>
  <div v-else class="plan-list">
    <article v-for="plan in plans" :key="plan.id" class="plan" :class="{ 'plan--highlighted': plan.highlighted }">
      <header>
        <h3>{{ plan.name }}</h3>
        <van-tag v-if="plan.highlighted" type="primary" round>En çok tercih edilen</van-tag>
      </header>
      <p class="plan__tagline">{{ plan.tagline }}</p>
      <div class="plan__price"><strong>{{ priceOf(plan) }}</strong><span v-if="plan.monthlyPrice != null"> / ay</span></div>
      <p class="plan__limits">{{ limitsOf(plan) }}</p>
      <ul>
        <li><Check :size="16" /> Şantiye sohbeti ve saha akışı</li>
        <li v-for="feature in plan.features" :key="feature.key" :class="{ 'is-off': !feature.included }">
          <Check v-if="feature.included" :size="16" /><Minus v-else :size="16" /> {{ feature.name }}
        </li>
      </ul>
      <RouterLink :to="{ name: 'apply', query: { paket: plan.code } }">
        <van-button block round :type="plan.highlighted ? 'primary' : 'default'">
          {{ plan.monthlyPrice == null ? 'Teklif isteyin' : 'Bu paketi seçin' }}
        </van-button>
      </RouterLink>
    </article>
  </div>
</template>

<style scoped>
.plan-list {
  display: grid;
  gap: var(--space-4);
}

.plan {
  padding: var(--space-5);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-xl);
  background: var(--surface);
}

.plan--highlighted {
  border: 2px solid var(--brand-primary);
  box-shadow: var(--shadow-lg);
}

.plan header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.plan h3 {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
}

.plan__tagline,
.plan__limits,
.plan__price span {
  color: var(--text-muted);
}

.plan__tagline {
  margin: var(--space-1) 0 var(--space-3);
  line-height: 1.5;
}

.plan__price strong {
  font-size: 30px;
  font-weight: var(--weight-black);
}

.plan__limits {
  margin: var(--space-1) 0 0;
  font-size: var(--text-sm);
}

.plan ul {
  display: grid;
  gap: var(--space-2);
  margin: var(--space-4) 0 var(--space-5);
  padding: var(--space-4) 0 0;
  border-top: 1px solid var(--border-soft);
  list-style: none;
}

.plan li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.plan li svg {
  color: var(--status-success);
}

.plan li.is-off,
.plan li.is-off svg {
  color: var(--text-subtle);
}
</style>
