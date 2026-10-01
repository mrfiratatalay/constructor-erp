<script setup lang="ts">
import { ref } from 'vue'
import { Check, Minus } from 'lucide-vue-next'
import { limitsOf, priceOf, usePublicPlans } from '@/core/marketing/usePublicPlans'

const { plans, isLoading, isError, refetch } = usePublicPlans()
const retrying = ref(false)

async function retry() {
  if (retrying.value) return
  retrying.value = true
  try { await refetch() } finally { retrying.value = false }
}
</script>

<template>
  <div v-if="isLoading" class="public-plans__loading" aria-label="Paketler yükleniyor">
    <van-skeleton v-for="placeholder in 2" :key="placeholder" title :row="6" />
  </div>
  <van-empty v-else-if="isError" image="error" description="Paketler şu anda yüklenemedi.">
    <van-button type="primary" size="small" :loading="retrying" @click="retry">Yeniden dene</van-button>
  </van-empty>
  <div v-else-if="plans.length" class="public-plans">
    <article v-for="plan in plans" :key="plan.id" class="public-plan" :class="{ 'public-plan--highlighted': plan.highlighted }">
      <header class="public-plan__heading">
        <h3>{{ plan.name }}</h3>
        <van-tag v-if="plan.highlighted" type="primary" round>Önerilen paket</van-tag>
      </header>
      <p v-if="plan.tagline" class="public-plan__tagline">{{ plan.tagline }}</p>
      <div class="public-plan__price"><strong>{{ priceOf(plan) }}</strong><span v-if="plan.monthlyPrice != null"> / ay</span></div>
      <p class="public-plan__limits">{{ limitsOf(plan) }}</p>
      <ul class="public-plan__features">
        <li><Check :size="15" />Saha akışı ve şantiye sohbeti</li>
        <li v-for="feature in plan.features" :key="feature.key" :class="{ 'is-off': !feature.included }">
          <Check v-if="feature.included" :size="15" /><Minus v-else :size="15" /><span>{{ feature.name }}</span>
        </li>
      </ul>
      <RouterLink :to="{ name: 'apply', query: { paket: plan.code } }" class="public-plan__action">
        <van-button block :type="plan.highlighted ? 'primary' : 'default'">
          {{ plan.monthlyPrice == null ? 'Teklif isteyin' : 'Bu paketle görüşelim' }}<van-icon name="arrow" />
        </van-button>
      </RouterLink>
    </article>
  </div>
  <van-empty v-else description="Paket bilgileri henüz yayınlanmadı." image-size="72">
    <RouterLink :to="{ name: 'apply' }"><van-button type="primary" size="small">Tanıtım isteyin</van-button></RouterLink>
  </van-empty>
</template>

<style scoped>
.public-plans, .public-plans__loading { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); align-items: stretch; gap: 18px; }
.public-plans__loading .van-skeleton { border: 1px solid var(--mk-line); border-radius: 18px; padding: 24px; background: #fff; }
.public-plan { display: flex; flex-direction: column; min-width: 0; padding: 25px 22px; border: 1px solid var(--mk-line); border-radius: 18px; background: #fff; }
.public-plan--highlighted { border-color: var(--brand-primary); box-shadow: 0 8px 26px rgb(21 33 61 / .07), inset 0 3px 0 var(--brand-primary); }
.public-plan__heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.public-plan h3 { margin: 0; color: var(--mk-ink); font-size: 19px; font-weight: 750; letter-spacing: -.03em; }
.public-plan .van-tag { padding: 4px 9px; font-size: 9px; }
.public-plan__tagline { min-height: 40px; margin: 12px 0 0; color: var(--mk-muted); font-size: 12px; line-height: 1.75; }
.public-plan__price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px; margin-top: 24px; }
.public-plan__price strong { color: var(--mk-ink); font-size: 32px; font-weight: 800; letter-spacing: -.05em; }
.public-plan__price > span { color: var(--mk-muted); font-size: 12px; }
.public-plan__limits { margin: 8px 0 0; color: var(--mk-muted); font-size: 11px; line-height: 1.7; }
.public-plan__features { display: grid; gap: 14px; margin: 22px 0 25px; padding: 22px 0 0; border-top: 1px solid var(--mk-line); list-style: none; }
.public-plan__features li { display: flex; align-items: flex-start; gap: 10px; color: var(--mk-ink); font-size: 12px; line-height: 1.6; }
.public-plan__features svg { flex: none; margin-top: 2px; color: var(--brand-primary); }
.public-plan__features .is-off, .public-plan__features .is-off svg { color: #8d98a7; }
.public-plan__action { display: block; margin-top: auto; text-decoration: none; }
.public-plan__action .van-button { height: 46px; border-radius: 10px; font-size: 12px; font-weight: 650; }
.public-plan__action .van-button--default { border-color: var(--mk-line); color: var(--mk-ink); }
.public-plan__action .van-icon { margin-left: 10px; font-size: 12px; }
</style>
