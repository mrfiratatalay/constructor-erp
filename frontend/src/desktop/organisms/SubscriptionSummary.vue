<script setup lang="ts">
import { fullDate } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import { useCompanySubscription } from '@/core/tenant/useCompanySubscription'

const { subscription, usage, state, isPending, isError, refetch } = useCompanySubscription()
const PROGRESS_STATUS = { full: 'exception', near: 'warning', ok: undefined } as const
</script>

<template>
  <el-card shadow="never" class="subscription-summary">
    <template #header>
      <div class="subscription-summary__header">
        <h2>Abonelik</h2>
        <el-tag v-if="subscription" :type="state.tone" effect="light" round size="small">{{ state.label }}</el-tag>
      </div>
    </template>
    <el-skeleton v-if="isPending" :rows="5" animated />
    <div v-else-if="isError" class="subscription-summary__state">
      <p>Abonelik bilgileri yüklenemedi.</p>
      <el-button size="small" @click="refetch()">Yeniden dene</el-button>
    </div>
    <template v-else-if="subscription">
      <div class="subscription-summary__plan">
        <span>Mevcut paket</span>
        <h3>{{ subscription.planName || 'Paket tanımlanmadı' }}</h3>
        <p v-if="subscription.monthlyPrice != null" class="subscription-summary__price">
          <strong>{{ formatMoney(subscription.monthlyPrice) }}</strong><span>/ ay</span>
        </p>
        <p v-else class="subscription-summary__price-empty">Aylık ücret bilgisi eklenmedi.</p>
      </div>
      <div class="subscription-summary__period">
        <span>Abonelik dönemi</span>
        <p v-if="subscription.startsOn || subscription.endsOn">
          {{ subscription.startsOn ? fullDate(subscription.startsOn) : 'Başlangıç belirtilmedi' }}
          <span>–</span>{{ subscription.endsOn ? fullDate(subscription.endsOn) : 'Bitiş belirtilmedi' }}
        </p>
        <p v-else>Dönem bilgisi eklenmedi.</p>
        <strong v-if="subscription.daysLeft != null && subscription.daysLeft >= 0 && subscription.state === 'ACTIVE'">
          {{ subscription.daysLeft === 0 ? 'Dönem bugün sona eriyor' : `${subscription.daysLeft} gün kaldı` }}
        </strong>
      </div>
      <div class="subscription-summary__usage">
        <div v-for="item in usage" :key="item.label" class="subscription-summary__usage-tile">
          <span>{{ item.label }}</span><b>{{ item.text }}</b>
          <el-progress v-if="item.limited" :percentage="item.percent" :show-text="false" :stroke-width="5"
            :status="PROGRESS_STATUS[item.level]" />
          <small v-else>Kullanım sınırı yok</small>
        </div>
      </div>
      <p class="subscription-summary__note">Paket değişikliği ve yenileme için Constructor ERP ekibiyle görüşebilirsiniz.</p>
    </template>
    <el-empty v-else description="Abonelik bilgisi bulunamadı." :image-size="56" />
  </el-card>
</template>

<style scoped>
.subscription-summary { height: 100%; border-color: var(--border-soft); border-radius: var(--radius-lg); }
.subscription-summary :deep(.el-card__header) { padding: var(--space-5) var(--space-6); border-bottom-color: var(--border-soft); }
.subscription-summary :deep(.el-card__body) { padding: var(--space-6); }
.subscription-summary__header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.subscription-summary__header h2 { margin: 0; font-size: var(--text-base); font-weight: var(--weight-semibold); }
.subscription-summary__plan > span, .subscription-summary__period > span { color: var(--text-subtle); font-size: var(--text-xs); }
.subscription-summary__plan h3 { margin: var(--space-1) 0 var(--space-2); font-size: var(--text-xl); font-weight: var(--weight-bold); line-height: 1.3; overflow-wrap: anywhere; }
.subscription-summary__price { display: flex; align-items: baseline; gap: var(--space-2); margin: 0; }
.subscription-summary__price strong { font-size: var(--text-lg); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums; }
.subscription-summary__price span { color: var(--text-muted); font-size: var(--text-sm); }
.subscription-summary__price-empty { margin: 0; color: var(--text-subtle); font-size: var(--text-xs); }
.subscription-summary__period { margin-top: var(--space-5); }
.subscription-summary__period p { display: flex; gap: var(--space-2); flex-wrap: wrap; margin: var(--space-1) 0 0; color: var(--text-muted); font-size: var(--text-xs); line-height: 1.6; }
.subscription-summary__period strong { display: block; margin-top: var(--space-1); color: var(--text-strong); font-size: var(--text-xs); font-weight: var(--weight-medium); }
.subscription-summary__usage { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); margin-top: var(--space-5); }
.subscription-summary__usage-tile { display: grid; gap: var(--space-2); padding: var(--space-4); background: var(--surface-muted); border-radius: var(--radius-sm); }
.subscription-summary__usage-tile > span, .subscription-summary__usage-tile small { color: var(--text-muted); font-size: var(--text-xs); }
.subscription-summary__usage-tile b { color: var(--text-strong); font-size: var(--text-sm); font-weight: var(--weight-semibold); font-variant-numeric: tabular-nums; }
.subscription-summary__note { margin: var(--space-5) 0 0; padding-top: var(--space-4); border-top: 1px solid var(--border-soft); font-size: var(--text-xs); color: var(--text-muted); line-height: 1.7; }
.subscription-summary__state { display: grid; justify-items: start; gap: var(--space-3); color: var(--text-muted); }
.subscription-summary__state p { margin: 0; }
@media (max-width: 560px) { .subscription-summary__usage { grid-template-columns: 1fr; } }
</style>
