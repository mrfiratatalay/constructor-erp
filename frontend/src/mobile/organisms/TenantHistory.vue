<script setup lang="ts">
import { ref } from 'vue'
import type { AuditEntryView, TenantDetail, TenantMemberRow } from '@/core/api/generated/model'
import { AUDIT_ACTIONS } from '@/core/admin/adminLabels'
import { PAYMENT_METHODS, stateOf } from '@/core/billing/billingLabels'
import { dayWithYear, timeAgo } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import { ROLE_LABELS } from '@/core/team/roles'

/** Firmanın geçmişi telefonda, açılır başlıklarla: dönemler, ödemeler, kişiler ve işlem geçmişi. */
const { tenant, members = [], audit = [] } = defineProps<{
  tenant: TenantDetail
  members?: TenantMemberRow[]
  audit?: AuditEntryView[]
}>()
const open = ref<string[]>(['periods'])
const roleOf = (role: string) => ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? role
</script>

<template>
  <van-collapse v-model="open" class="history">
    <van-collapse-item :title="`Dönemler (${tenant.subscriptions.length})`" name="periods">
      <van-cell v-for="period in tenant.subscriptions" :key="period.id" :title="period.planName"
        :label="`${dayWithYear(period.startsOn)} – ${dayWithYear(period.endsOn)} · ${formatMoney(period.priceSnapshot)}/ay`"
        :value="stateOf(period.state).label" />
    </van-collapse-item>
    <van-collapse-item :title="`Ödemeler (${tenant.payments.length})`" name="payments">
      <van-cell v-for="payment in tenant.payments" :key="payment.id" :title="formatMoney(payment.amount)"
        :label="payment.description ?? ''" :value="`${PAYMENT_METHODS[payment.method]} · ${dayWithYear(payment.paidOn)}`" />
    </van-collapse-item>
    <van-collapse-item :title="`Kişiler (${members.length})`" name="members">
      <van-cell v-for="member in members" :key="member.userId" :title="member.fullName"
        :label="member.phone ?? member.email ?? ''" :value="member.active ? roleOf(member.role) : 'Çıkarıldı'" />
    </van-collapse-item>
    <van-collapse-item title="İşlem geçmişi" name="audit">
      <van-cell v-for="entry in audit" :key="entry.id" :title="entry.summary"
        :label="`${AUDIT_ACTIONS[entry.action] ?? entry.action} · ${entry.actorName ?? 'Sistem'}`" :value="timeAgo(entry.createdAt)" />
    </van-collapse-item>
  </van-collapse>
</template>

<style scoped>
.history {
  margin: 0 var(--space-4);
  overflow: hidden;
  border-radius: var(--radius-md);
}
</style>
