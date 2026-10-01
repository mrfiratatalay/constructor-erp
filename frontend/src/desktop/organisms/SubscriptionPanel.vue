<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { CalendarPlus } from 'lucide-vue-next'
import type { SubscriptionView, TenantDetail } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { useActivePlans } from '@/core/admin/useActivePlans'
import { useTenantActions } from '@/core/admin/useTenantActions'
import { stateOf } from '@/core/billing/billingLabels'
import { dayWithYear } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import { confirmAction } from '@/desktop/confirmAction'
import ExtendSubscriptionDialog from '@/desktop/organisms/ExtendSubscriptionDialog.vue'

/** Firmanın abonelik dönemleri: yeni dönem (uzat), dönemin paketini değiştir, askıya al / devam ettir / iptal. */
const { tenant } = defineProps<{ tenant: TenantDetail }>()
const plans = useActivePlans()
const { changePlan, changePeriodStatus } = useTenantActions(() => tenant.summary.id)
const extending = ref(false)
const asPeriod = (row: unknown) => row as SubscriptionView
const current = computed(() => tenant.subscriptions.find((period) => period.id === tenant.currentSubscriptionId))

async function run(task: () => Promise<unknown>, done: string) {
  try {
    await task()
    ElMessage.success(done)
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

async function setStatus(period: SubscriptionView, status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED', label: string) {
  const message = `${period.planName} dönemi: ${label}?`
  if (!(await confirmAction({ title: 'Abonelik', message, confirm: label, danger: status !== 'ACTIVE' }))) return
  await run(() => changePeriodStatus(period.id, status), `Dönem: ${label.toLocaleLowerCase('tr')}.`)
}
</script>

<template>
  <div class="subscription-panel">
    <div class="subscription-panel__head">
      <div v-if="current">
        <strong>{{ current.planName }}</strong>
        <el-tag :type="stateOf(current.state).tone">{{ stateOf(current.state).label }}</el-tag>
        <span>{{ dayWithYear(current.startsOn) }} – {{ dayWithYear(current.endsOn) }} · {{ formatMoney(current.priceSnapshot) }} / ay</span>
      </div>
      <el-empty v-else :image-size="48" description="Henüz abonelik yok" />
      <el-button type="primary" @click="extending = true"><CalendarPlus :size="16" /> {{ current ? 'Uzat / yeni dönem' : 'Aboneliği başlat' }}</el-button>
    </div>
    <el-table :data="tenant.subscriptions" empty-text="Dönem yok">
      <el-table-column label="Paket" width="200">
        <template #default="{ row }">
          <el-select :model-value="asPeriod(row).planId" size="small" :disabled="asPeriod(row).status === 'CANCELLED'"
            @change="(planId: string) => run(() => changePlan(asPeriod(row).id, planId), 'Paket değişti.')">
            <el-option v-for="plan in plans" :key="plan.id" :label="plan.name" :value="plan.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Dönem"><template #default="{ row }">{{ dayWithYear(asPeriod(row).startsOn) }} – {{ dayWithYear(asPeriod(row).endsOn) }}</template></el-table-column>
      <el-table-column label="Aylık" width="110"><template #default="{ row }">{{ formatMoney(asPeriod(row).priceSnapshot) }}</template></el-table-column>
      <el-table-column label="Durum" width="130">
        <template #default="{ row }"><el-tag size="small" :type="stateOf(asPeriod(row).state).tone">{{ stateOf(asPeriod(row).state).label }}</el-tag></template>
      </el-table-column>
      <el-table-column label="Not" prop="note" min-width="140" />
      <el-table-column width="200" align="right">
        <template #default="{ row }">
          <template v-if="asPeriod(row).status !== 'CANCELLED'">
            <el-button v-if="asPeriod(row).status === 'ACTIVE'" size="small" text type="warning" @click="setStatus(asPeriod(row), 'SUSPENDED', 'Askıya al')">Askıya al</el-button>
            <el-button v-else size="small" text type="success" @click="setStatus(asPeriod(row), 'ACTIVE', 'Devam ettir')">Devam ettir</el-button>
            <el-button size="small" text type="danger" @click="setStatus(asPeriod(row), 'CANCELLED', 'İptal et')">İptal</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <ExtendSubscriptionDialog v-model:show="extending" :tenant="tenant" />
  </div>
</template>

<style scoped>
.subscription-panel {
  display: grid;
  gap: var(--space-4);
}

.subscription-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.subscription-panel__head > div {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.subscription-panel__head strong {
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
}

.subscription-panel__head span {
  color: var(--text-muted);
}

.subscription-panel__head :deep(.el-button svg) {
  margin-right: var(--space-1);
}
</style>
