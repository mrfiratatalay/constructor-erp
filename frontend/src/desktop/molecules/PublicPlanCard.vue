<script setup lang="ts">
import { ArrowRight, Check, Minus } from 'lucide-vue-next'
import type { PublicPlanView } from '@/core/api/generated/model'
import { limitsOf, priceOf } from '@/core/marketing/usePublicPlans'

const { plan } = defineProps<{ plan: PublicPlanView }>()
</script>

<template>
  <el-card shadow="never" class="public-plan" :class="{ 'public-plan--highlighted': plan.highlighted }">
    <div class="public-plan__heading">
      <h3>{{ plan.name }}</h3>
      <el-tag v-if="plan.highlighted" class="public-plan__badge" effect="light" size="small" round>Önerilen paket</el-tag>
    </div>
    <p class="public-plan__tagline">{{ plan.tagline }}</p>
    <div class="public-plan__price">
      <strong>{{ priceOf(plan) }}</strong><span v-if="plan.monthlyPrice != null">/ ay</span>
    </div>
    <p class="public-plan__limits">{{ limitsOf(plan) }}</p>
    <ul v-if="plan.features.length" class="public-plan__features">
      <li v-for="feature in plan.features" :key="feature.key" :class="{ 'public-plan__feature--off': !feature.included }">
        <Check v-if="feature.included" :size="16" :stroke-width="2" aria-hidden="true" />
        <Minus v-else :size="16" aria-hidden="true" />
        <span>{{ feature.name }}<small v-if="!feature.included">Bu pakette yok</small></span>
      </li>
    </ul>
    <p v-else class="public-plan__empty">Paket kapsamını tanıtım görüşmesinde birlikte değerlendirelim.</p>
    <RouterLink :to="{ name: 'apply', query: { paket: plan.code } }" custom v-slot="{ href, navigate }">
      <el-button tag="a" :href="href" :type="plan.highlighted ? 'primary' : 'default'" size="large"
        class="public-plan__link public-plan__cta" @click="navigate">
        {{ plan.monthlyPrice == null ? 'Teklif isteyin' : 'Bu paketi seçin' }}<ArrowRight :size="16" aria-hidden="true" />
      </el-button>
    </RouterLink>
  </el-card>
</template>

<style scoped>
.public-plan { height: 100%; overflow: hidden; border: 1px solid var(--mk-line); border-radius: 16px; background: var(--surface); color: var(--mk-ink); }
.public-plan--highlighted { border-color: var(--mk-ink); box-shadow: inset 0 0 0 1px var(--mk-ink); }
.public-plan :deep(.el-card__body) { display: flex; flex-direction: column; height: 100%; padding: 28px; }
.public-plan__heading { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.public-plan h3 { margin: 0; font-size: 22px; font-weight: var(--weight-bold); letter-spacing: -.025em; line-height: 1.35; }
.public-plan__badge { --el-tag-bg-color: var(--mk-paper); --el-tag-text-color: var(--mk-ink); --el-tag-border-color: var(--mk-line); font-size: 10px; font-weight: var(--weight-semibold); }
.public-plan__tagline { min-height: 44px; margin: 12px 0 24px; color: var(--mk-muted); font-size: 13px; line-height: 1.7; }
.public-plan__price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 7px; }
.public-plan__price strong { font-size: 32px; font-weight: var(--weight-bold); letter-spacing: -.035em; line-height: 1.3; font-variant-numeric: tabular-nums; }
.public-plan__price > span { color: var(--mk-muted); font-size: 13px; }
.public-plan__limits { margin: 10px 0 0; color: var(--mk-muted); font-size: 12px; line-height: 1.7; }
.public-plan__features { display: grid; align-content: start; gap: 14px; flex: 1; margin: 24px 0; padding: 24px 0 0; border-top: 1px solid var(--mk-line); list-style: none; }
.public-plan__features li { display: flex; align-items: flex-start; gap: 10px; color: var(--mk-ink); font-size: 13px; line-height: 1.5; }
.public-plan__features svg { flex: none; margin-top: 2px; }
.public-plan__features li > span { display: grid; gap: 3px; }
.public-plan__features small { color: var(--mk-muted); font-size: 10px; }
.public-plan__features li.public-plan__feature--off { color: var(--mk-muted); }
.public-plan__feature--off svg { opacity: .5; }
.public-plan__empty { flex: 1; margin: 24px 0; padding-top: 24px; border-top: 1px solid var(--mk-line); color: var(--mk-muted); font-size: 13px; line-height: 1.7; }
.public-plan__link { display: flex; flex: none; margin-top: auto; text-decoration: none; }
.public-plan__cta { width: 100%; height: 46px; border-radius: 10px; font-size: 13px; font-weight: var(--weight-semibold); }
.public-plan__cta :deep(span) { display: inline-flex; align-items: center; justify-content: center; gap: 10px; }
.public-plan--highlighted .public-plan__cta { --el-button-bg-color: var(--mk-ink); --el-button-border-color: var(--mk-ink); --el-button-hover-bg-color: var(--brand-deep); --el-button-hover-border-color: var(--brand-deep); --el-button-active-bg-color: var(--mk-dark); --el-button-active-border-color: var(--mk-dark); }
.public-plan__link:focus-visible { outline: 2px solid var(--mk-ink); outline-offset: 4px; border-radius: 10px; }
</style>
