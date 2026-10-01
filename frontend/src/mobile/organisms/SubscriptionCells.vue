<script setup lang="ts">
import { computed, ref } from 'vue'
import { dayWithYear } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import { useCompanySubscription } from '@/core/tenant/useCompanySubscription'

const { subscription, usage, state, isPending, isError, refetch } = useCompanySubscription()
const retrying = ref(false)
const BAR_COLOR = { full: 'var(--status-danger)', near: 'var(--status-warning)', ok: 'var(--brand-primary)' } as const
const remaining = computed(() => {
  const days = subscription.value?.daysLeft
  if (subscription.value?.state !== 'ACTIVE' || days == null || days < 0) return ''
  return days === 0 ? 'Bugün sona eriyor' : `${days} gün kaldı`
})

async function retry() {
  if (retrying.value) return
  retrying.value = true
  try { await refetch() } finally { retrying.value = false }
}
</script>

<template>
  <section class="company-subscription">
    <van-skeleton v-if="isPending" title :row="4" />
    <van-empty v-else-if="isError" image="error" description="Abonelik bilgileri yüklenemedi.">
      <van-button type="primary" size="small" :loading="retrying" @click="retry">Yeniden dene</van-button>
    </van-empty>
    <template v-else-if="subscription">
      <header class="company-subscription__header">
        <h2>Abonelik</h2>
        <van-tag :type="state.tone === 'info' ? 'default' : state.tone" round>{{ state.label }}</van-tag>
      </header>
      <div class="company-subscription__plan">
        <h3>{{ subscription.planName || 'Paket tanımlanmamış' }}</h3>
        <p v-if="subscription.monthlyPrice != null"><strong>{{ formatMoney(subscription.monthlyPrice) }}</strong><span> / ay</span></p>
      </div>
      <dl v-if="subscription.startsOn || subscription.endsOn" class="company-subscription__period">
        <div v-if="subscription.startsOn"><dt>Başlangıç</dt><dd>{{ dayWithYear(subscription.startsOn) }}</dd></div>
        <div v-if="subscription.endsOn"><dt>Bitiş</dt><dd>{{ dayWithYear(subscription.endsOn) }}</dd></div>
      </dl>
      <p v-if="remaining" class="company-subscription__remaining"><van-icon name="clock-o" />{{ remaining }}</p>
      <div class="company-subscription__usage">
        <div v-for="item in usage" :key="item.label" class="company-subscription__usage-item">
          <span>{{ item.label }}</span><strong>{{ item.text }}</strong>
          <van-progress v-if="item.limited" :percentage="item.percent" :show-pivot="false" stroke-width="5"
            :color="BAR_COLOR[item.level]" />
        </div>
      </div>
      <p class="company-subscription__hint"><van-icon name="info-o" /><span>Paket değişikliği ve yenileme için Constructor ERP ekibiyle görüşün.</span></p>
    </template>
    <van-empty v-else description="Abonelik bilgisi bulunamadı." image-size="60" />
  </section>
</template>

<style scoped>
.company-subscription { padding: var(--space-5); border: 1px solid var(--border-soft); border-radius: var(--radius-lg); background: var(--surface); }
.company-subscription__header { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); }
.company-subscription__header h2 { margin: 0; font-size: var(--text-base); }
.company-subscription__plan h3 { margin: 0 0 var(--space-2); font-size: var(--text-xl); letter-spacing: -.025em; line-height: 1.35; }
.company-subscription__plan p { margin: 0; }
.company-subscription__plan strong { color: var(--text-strong); font-size: var(--text-lg); font-weight: var(--weight-semibold); }
.company-subscription__plan p > span { color: var(--text-subtle); font-size: var(--text-xs); }
.company-subscription__period { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); margin: var(--space-5) 0 0; padding-top: var(--space-4); border-top: 1px solid var(--border-soft); }
.company-subscription__period dt { color: var(--text-subtle); font-size: 11px; }
.company-subscription__period dd { margin: var(--space-1) 0 0; color: var(--text-muted); font-size: var(--text-xs); }
.company-subscription__remaining { display: flex; align-items: center; gap: var(--space-1); margin: var(--space-3) 0 0; font-size: 11px; color: var(--text-muted); }
.company-subscription__usage { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); margin-top: var(--space-5); }
.company-subscription__usage-item { display: grid; gap: var(--space-2); border: 1px solid var(--border-soft); border-radius: var(--radius-sm); padding: var(--space-3); background: var(--surface-muted); }
.company-subscription__usage-item > span { color: var(--text-muted); font-size: 11px; }
.company-subscription__usage-item > strong { font-weight: var(--weight-semibold); font-size: var(--text-sm); overflow-wrap: anywhere; }
.company-subscription__hint { display: flex; gap: var(--space-2); margin: var(--space-4) 0 0; color: var(--text-muted); font-size: 11px; line-height: 1.6; }
.company-subscription__hint .van-icon { flex: none; margin-top: 3px; font-size: 14px; }
</style>
