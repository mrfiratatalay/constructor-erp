<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
import { fullDate } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import { useCompanySubscription } from '@/core/tenant/useCompanySubscription'

/** Patronun abonelik özeti: paket, dönem, kullanım ve paketteki modüller. Değiştirmek Constructor ERP ekibinin işidir. */
const { subscription, usage, state } = useCompanySubscription()
const PROGRESS_STATUS = { full: 'exception', near: 'warning', ok: undefined } as const
</script>

<template>
  <el-card v-if="subscription" shadow="never" class="subscription">
    <template #header>
      <div class="subscription__head">
        <strong>Abonelik</strong>
        <el-tag :type="state.tone" effect="light" round>{{ state.label }}</el-tag>
      </div>
    </template>
    <div class="subscription__plan">
      <span>{{ subscription.planName ?? 'Paket yok' }}</span>
      <small v-if="subscription.monthlyPrice != null">{{ formatMoney(subscription.monthlyPrice) }} / ay</small>
    </div>
    <p v-if="subscription.startsOn && subscription.endsOn" class="subscription__period">
      {{ fullDate(subscription.startsOn) }} – {{ fullDate(subscription.endsOn) }}
      <b v-if="subscription.daysLeft != null && subscription.daysLeft >= 0">· {{ subscription.daysLeft }} gün kaldı</b>
    </p>
    <div class="subscription__usage">
      <div v-for="item in usage" :key="item.label">
        <span>{{ item.label }} <b>{{ item.text }}</b></span>
        <el-progress v-if="item.limited" :percentage="item.percent" :show-text="false" :stroke-width="8"
          :status="PROGRESS_STATUS[item.level]" />
      </div>
    </div>
    <el-divider content-position="left">Paketinizdeki modüller</el-divider>
    <ul class="subscription__features">
      <li v-for="feature in subscription.features" :key="feature.key" :class="{ 'is-off': !feature.included }">
        <Check v-if="feature.included" :size="16" /><X v-else :size="16" />
        <span><b>{{ feature.name }}</b> {{ feature.description }}</span>
      </li>
    </ul>
    <el-alert type="info" :closable="false" show-icon
      title="Paket değişikliği ve yenileme için Constructor ERP ekibiyle görüşün; ödemeler havale ya da elden alınır." />
  </el-card>
</template>

<style scoped>
.subscription__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.subscription__plan {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}

.subscription__plan span {
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.subscription__plan small,
.subscription__period {
  color: var(--text-muted);
}

.subscription__period {
  margin: var(--space-1) 0 var(--space-4);
}

.subscription__usage {
  display: grid;
  gap: var(--space-3);
}

.subscription__usage span {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-1);
  font-size: var(--text-sm);
}

.subscription__features {
  display: grid;
  gap: var(--space-2);
  margin: 0 0 var(--space-4);
  padding: 0;
  list-style: none;
}

.subscription__features li {
  display: flex;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.subscription__features li svg {
  flex: none;
  margin-top: 2px;
  color: var(--status-success);
}

.subscription__features li span {
  color: var(--text-muted);
}

.subscription__features li b {
  color: var(--text-strong);
}

.subscription__features li.is-off svg,
.subscription__features li.is-off b {
  color: var(--text-subtle);
}
</style>
