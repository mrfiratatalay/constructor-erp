<script setup lang="ts">
import { ref } from 'vue'
import { PAYMENT_METHODS, stateOf } from '@/core/billing/billingLabels'
import { dayWithYear, fullDate } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import { useCompanySubscription } from '@/core/tenant/useCompanySubscription'

/** Patronun abonelik özeti telefonda: paket, dönem, kullanım, modüller, dönemler ve ödemeler (salt okunur). */
const { subscription, usage, state } = useCompanySubscription()
const BAR_COLOR = { full: 'var(--status-danger)', near: 'var(--status-warning)', ok: 'var(--brand-primary)' } as const
const openSections = ref<string[]>([])
</script>

<template>
  <template v-if="subscription">
    <van-cell-group inset title="Abonelik">
      <van-cell center :title="subscription.planName ?? 'Paket yok'"
        :label="subscription.endsOn ? `Dönem sonu ${fullDate(subscription.endsOn)}` : ''">
        <template #value>
          <van-tag :type="state.tone === 'info' ? 'default' : state.tone" round>{{ state.label }}</van-tag>
        </template>
      </van-cell>
      <van-cell v-if="subscription.monthlyPrice != null" title="Aylık" :value="formatMoney(subscription.monthlyPrice)" />
      <van-cell v-for="item in usage" :key="item.label" :title="item.label" :value="item.text">
        <template v-if="item.limited" #label>
          <van-progress :percentage="item.percent" :show-pivot="false" stroke-width="6" :color="BAR_COLOR[item.level]" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group inset title="Paketinizdeki modüller">
      <van-cell v-for="feature in subscription.features" :key="feature.key" :title="feature.name"
        :label="feature.description" :icon="feature.included ? 'passed' : 'close'"
        :class="{ 'is-off': !feature.included }" />
    </van-cell-group>
    <van-collapse v-model="openSections" class="subscription-cells__history">
      <van-collapse-item :title="`Dönemler (${subscription.periods.length})`" name="periods">
        <van-cell v-for="period in subscription.periods" :key="period.startsOn" :title="period.planName"
          :label="`${dayWithYear(period.startsOn)} – ${dayWithYear(period.endsOn)}`" :value="stateOf(period.state).label" />
      </van-collapse-item>
      <van-collapse-item :title="`Ödemeler (${subscription.payments.length})`" name="payments">
        <van-empty v-if="!subscription.payments.length" description="Henüz kayıtlı ödeme yok" image-size="60" />
        <van-cell v-for="(payment, index) in subscription.payments" :key="index" :title="formatMoney(payment.amount)"
          :label="payment.description ?? ''" :value="`${PAYMENT_METHODS[payment.method]} · ${dayWithYear(payment.paidOn)}`" />
      </van-collapse-item>
    </van-collapse>
    <p class="subscription-cells__hint">Paket değişikliği ve yenileme için Constructor ERP ekibiyle görüşün.</p>
  </template>
</template>

<style scoped>
.is-off {
  opacity: 0.5;
}

.subscription-cells__history {
  margin: 0 var(--space-4);
  overflow: hidden;
  border-radius: var(--radius-md);
}

.subscription-cells__hint {
  margin: 0;
  padding: 0 var(--space-4);
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-align: center;
}
</style>
