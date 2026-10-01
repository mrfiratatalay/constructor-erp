<script setup lang="ts">
import { ref } from 'vue'
import { PAYMENT_METHODS, stateOf } from '@/core/billing/billingLabels'
import { dayWithYear } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import { useCompanySubscription } from '@/core/tenant/useCompanySubscription'

const { subscription, isPending, isError, refetch } = useCompanySubscription()
const tab = ref('periods')
</script>

<template>
  <el-card shadow="never" class="billing-history">
    <template #header>
      <h2>Abonelik ve ödeme geçmişi</h2>
      <p>Kayıtlı abonelik dönemleriniz ve alınan ödemeler.</p>
    </template>
    <el-skeleton v-if="isPending" :rows="4" animated class="billing-history__state" />
    <div v-else-if="isError" class="billing-history__state billing-history__error">
      <p>Abonelik ve ödeme geçmişi yüklenemedi.</p>
      <el-button size="small" @click="refetch()">Yeniden dene</el-button>
    </div>
    <el-tabs v-else v-model="tab" class="billing-history__tabs">
      <el-tab-pane :label="`Dönemler (${subscription?.periods.length ?? 0})`" name="periods">
        <el-table :data="subscription?.periods ?? []" :row-style="{ height: '72px' }" class="billing-history__table">
          <el-table-column label="Paket" prop="planName" min-width="200" show-overflow-tooltip />
          <el-table-column label="Dönem" min-width="250">
            <template #default="{ row }">
              <span class="billing-history__date">{{ dayWithYear(row.startsOn) }}<span>–</span>{{ dayWithYear(row.endsOn) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Aylık ücret" min-width="150" align="right">
            <template #default="{ row }"><span class="billing-history__amount">{{ formatMoney(row.monthlyPrice) }}</span></template>
          </el-table-column>
          <el-table-column label="Durum" width="160" align="right">
            <template #default="{ row }">
              <el-tag :type="stateOf(row.state).tone" size="small" effect="light" round>{{ stateOf(row.state).label }}</el-tag>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="Henüz abonelik dönemi kaydedilmedi." :image-size="64">
              <p class="billing-history__empty-note">Kaydedilen dönemler burada listelenir.</p>
            </el-empty>
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="`Ödemeler (${subscription?.payments.length ?? 0})`" name="payments">
        <el-table :data="subscription?.payments ?? []" :row-style="{ height: '72px' }" class="billing-history__table">
          <el-table-column label="Tarih" min-width="160">
            <template #default="{ row }"><span class="billing-history__date">{{ dayWithYear(row.paidOn) }}</span></template>
          </el-table-column>
          <el-table-column label="Tutar" min-width="160" align="right">
            <template #default="{ row }">
              <div class="billing-history__payment"><b>{{ formatMoney(row.amount, row.currency) }}</b><small>{{ row.currency }}</small></div>
            </template>
          </el-table-column>
          <el-table-column label="Yöntem" min-width="170">
            <template #default="{ row }">{{ PAYMENT_METHODS[row.method] ?? row.method }}</template>
          </el-table-column>
          <el-table-column label="Açıklama" prop="description" min-width="280" show-overflow-tooltip>
            <template #default="{ row }"><span class="billing-history__description">{{ row.description || '—' }}</span></template>
          </el-table-column>
          <template #empty>
            <el-empty description="Henüz kayıtlı ödeme yok." :image-size="64">
              <p class="billing-history__empty-note">Alınan ödemeler kaydedildiğinde burada görünür.</p>
            </el-empty>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<style scoped>
.billing-history { border-color: var(--border-soft); border-radius: var(--radius-lg); }
.billing-history :deep(.el-card__header) { padding: var(--space-5) var(--space-6); border-bottom-color: var(--border-soft); }
.billing-history :deep(.el-card__body) { padding: 0 var(--space-6) var(--space-5); }
.billing-history h2 { margin: 0; color: var(--text-strong); font-size: var(--text-base); font-weight: var(--weight-semibold); }
.billing-history :deep(.el-card__header) > p { margin: var(--space-1) 0 0; color: var(--text-muted); font-size: var(--text-xs); }
.billing-history__tabs :deep(.el-tabs__header) { margin-bottom: 0; }
.billing-history__tabs :deep(.el-tabs__nav-wrap::after) { height: 1px; background-color: var(--border-soft); }
.billing-history__tabs :deep(.el-tabs__item) { height: 52px; font-size: var(--text-sm); }
.billing-history__table { --el-table-border-color: var(--border-soft); --el-table-header-bg-color: var(--surface); --el-table-header-text-color: var(--text-muted); --el-table-text-color: var(--text-strong); --el-table-row-hover-bg-color: var(--surface-muted); font-size: var(--text-sm); }
.billing-history__table :deep(th.el-table__cell) { height: 52px; font-size: var(--text-xs); font-weight: var(--weight-medium); }
.billing-history__table :deep(.el-table__cell) { border-bottom-color: var(--border-soft); }
.billing-history__table :deep(.cell) { padding-inline: var(--space-3); }
.billing-history__table :deep(.el-table__inner-wrapper::before) { display: none; }
.billing-history__date { display: inline-flex; gap: var(--space-2); font-variant-numeric: tabular-nums; white-space: nowrap; }
.billing-history__date > span { color: var(--text-subtle); }
.billing-history__amount, .billing-history__payment { font-variant-numeric: tabular-nums; }
.billing-history__payment { display: grid; gap: var(--space-1); }
.billing-history__payment b { font-weight: var(--weight-semibold); }
.billing-history__payment small { font-size: 11px; color: var(--text-subtle); }
.billing-history__description { color: var(--text-muted); white-space: nowrap; }
.billing-history__state { padding: var(--space-6) 0; }
.billing-history__error { display: grid; justify-items: start; gap: var(--space-3); color: var(--text-muted); }
.billing-history__error p, .billing-history__empty-note { margin: 0; }
.billing-history__empty-note { color: var(--text-subtle); font-size: var(--text-xs); line-height: 1.6; }
</style>
