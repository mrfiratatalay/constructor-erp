<script setup lang="ts">
import { ref } from 'vue'
import { PAYMENT_METHODS, stateOf } from '@/core/billing/billingLabels'
import { dayWithYear } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import { useCompanySubscription } from '@/core/tenant/useCompanySubscription'
import { vanType } from '@/mobile/markTones'

const { subscription, isPending, isError, refetch } = useCompanySubscription()
const tab = ref('periods')
const retrying = ref(false)

async function retry() {
  if (retrying.value) return
  retrying.value = true
  try { await refetch() } finally { retrying.value = false }
}
</script>

<template>
  <section class="company-history">
    <h2>Dönem ve ödeme geçmişi</h2>
    <van-skeleton v-if="isPending" :row="4" />
    <van-empty v-else-if="isError" image="error" description="Dönem ve ödeme geçmişi yüklenemedi.">
      <van-button size="small" type="primary" :loading="retrying" @click="retry">Yeniden dene</van-button>
    </van-empty>
    <van-tabs v-else-if="subscription" v-model:active="tab" class="company-history__tabs" :border="false">
      <van-tab name="periods" :title="`Dönemler (${subscription.periods.length})`">
        <div v-if="subscription.periods.length" class="company-history__entries">
          <article v-for="(period, index) in subscription.periods" :key="`${period.startsOn}-${index}`" class="company-history__entry">
            <div class="company-history__row">
              <h3>{{ period.planName }}</h3>
              <van-tag :type="vanType(stateOf(period.state).tone)" round>{{ stateOf(period.state).label }}</van-tag>
            </div>
            <p class="company-history__date"><van-icon name="calendar-o" />{{ dayWithYear(period.startsOn) }} – {{ dayWithYear(period.endsOn) }}</p>
            <p v-if="period.monthlyPrice != null" class="company-history__price">{{ formatMoney(period.monthlyPrice) }}<span> / ay</span></p>
          </article>
        </div>
        <van-empty v-else description="Henüz abonelik dönemi yok." image-size="60" />
      </van-tab>
      <van-tab name="payments" :title="`Ödemeler (${subscription.payments.length})`">
        <div v-if="subscription.payments.length" class="company-history__entries">
          <article v-for="(payment, index) in subscription.payments" :key="`${payment.paidOn}-${index}`" class="company-history__entry">
            <div class="company-history__row">
              <strong class="company-history__amount">{{ formatMoney(payment.amount, payment.currency) }}</strong>
              <time :datetime="payment.paidOn">{{ dayWithYear(payment.paidOn) }}</time>
            </div>
            <p class="company-history__method"><van-icon name="credit-pay" />{{ PAYMENT_METHODS[payment.method] || payment.method }}</p>
            <p v-if="payment.description" class="company-history__note">{{ payment.description }}</p>
          </article>
        </div>
        <van-empty v-else description="Henüz kayıtlı ödeme yok." image-size="60" />
      </van-tab>
    </van-tabs>
    <van-empty v-else description="Dönem ve ödeme kaydı bulunamadı." image-size="60" />
  </section>
</template>

<style scoped>
.company-history { padding: var(--space-5); border: 1px solid var(--border-soft); border-radius: var(--radius-lg); background: var(--surface); }
.company-history > h2 { margin: 0 0 var(--space-3); font-size: var(--text-base); }
.company-history__tabs { --van-tabs-nav-background: var(--surface); --van-tab-font-size: var(--text-sm); }
.company-history__tabs :deep(.van-tabs__nav) { padding-left: 0; padding-right: 0; }
.company-history__tabs :deep(.van-tab) { padding-inline: 0; }
.company-history__entries { display: grid; gap: var(--space-3); padding-top: var(--space-4); }
.company-history__entry { padding: var(--space-3); border: 1px solid var(--border-soft); border-radius: var(--radius-sm); }
.company-history__row { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.company-history__row h3 { margin: 0; font-size: var(--text-sm); line-height: 1.5; overflow-wrap: anywhere; }
.company-history__row .van-tag { flex-shrink: 0; font-size: 10px; }
.company-history__date, .company-history__method { display: flex; align-items: center; gap: var(--space-1); margin: var(--space-2) 0 0; font-size: 11px; color: var(--text-muted); }
.company-history__date .van-icon, .company-history__method .van-icon { flex-shrink: 0; font-size: 13px; }
.company-history__price { margin: var(--space-2) 0 0; font-size: var(--text-sm); font-weight: var(--weight-semibold); }
.company-history__price span { font-size: 11px; font-weight: 400; color: var(--text-subtle); }
.company-history__amount { font-size: var(--text-base); font-weight: var(--weight-semibold); }
.company-history time { flex-shrink: 0; padding-top: 3px; font-size: 10px; color: var(--text-subtle); }
.company-history__note { margin: var(--space-2) 0 0; font-size: 11px; line-height: 1.6; color: var(--text-muted); white-space: pre-wrap; overflow-wrap: anywhere; }
</style>
