<script setup lang="ts">
import { Check, Minus } from 'lucide-vue-next'
import type { PublicPlanView } from '@/core/api/generated/model'
import { limitsOf, priceOf } from '@/core/marketing/usePublicPlans'

/** Fiyat sayfasında paket kartı. POS yok: "Bu paketi seçin" başvuru formunu paketi seçili açar. */
const { plan } = defineProps<{ plan: PublicPlanView }>()
</script>

<template>
  <el-card shadow="never" class="public-plan" :class="{ 'public-plan--highlighted': plan.highlighted }">
    <el-tag v-if="plan.highlighted" class="public-plan__badge" effect="dark" round>En çok tercih edilen</el-tag>
    <h3>{{ plan.name }}</h3>
    <p class="public-plan__tagline">{{ plan.tagline }}</p>
    <div class="public-plan__price">
      <strong>{{ priceOf(plan) }}</strong><span v-if="plan.monthlyPrice != null"> / ay</span>
    </div>
    <p class="public-plan__limits">{{ limitsOf(plan) }}</p>
    <RouterLink :to="{ name: 'apply', query: { paket: plan.code } }">
      <el-button :type="plan.highlighted ? 'primary' : 'default'" size="large" round class="public-plan__cta">
        {{ plan.monthlyPrice == null ? 'Teklif isteyin' : 'Bu paketi seçin' }}
      </el-button>
    </RouterLink>
    <ul>
      <li>
        <Check :size="16" /> Şantiye sohbeti ve saha akışı
      </li>
      <li v-for="feature in plan.features" :key="feature.key" :class="{ 'is-off': !feature.included }">
        <Check v-if="feature.included" :size="16" /><Minus v-else :size="16" /> {{ feature.name }}
      </li>
    </ul>
  </el-card>
</template>

<style scoped>
.public-plan {
  position: relative;
  overflow: visible;
  border-radius: var(--radius-xl);
}

.public-plan--highlighted {
  border: 2px solid var(--brand-primary);
  box-shadow: var(--shadow-lg);
}

.public-plan__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
}

.public-plan h3 {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
}

.public-plan__tagline {
  min-height: 3em;
  margin: var(--space-1) 0 var(--space-4);
  color: var(--text-muted);
  line-height: 1.5;
}

.public-plan__price strong {
  font-size: 34px;
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.public-plan__price span,
.public-plan__limits {
  color: var(--text-muted);
}

.public-plan__limits {
  margin: var(--space-1) 0 var(--space-5);
  font-size: var(--text-sm);
}

.public-plan__cta {
  width: 100%;
}

.public-plan ul {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-6) 0 0;
  padding: var(--space-5) 0 0;
  border-top: 1px solid var(--border-soft);
  list-style: none;
}

.public-plan li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.public-plan li svg {
  color: var(--status-success);
}

.public-plan li.is-off {
  color: var(--text-subtle);
}

.public-plan li.is-off svg {
  color: var(--text-subtle);
}
</style>
