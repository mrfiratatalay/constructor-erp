<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Banknote } from 'lucide-vue-next'
import type { PaymentView, TenantDetail } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { emptyPayment, paymentRequestOf } from '@/core/admin/paymentForm'
import { useTenantActions } from '@/core/admin/useTenantActions'
import { PAYMENT_METHODS } from '@/core/billing/billingLabels'
import { dayWithYear } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import PaymentFields from '@/desktop/molecules/PaymentFields.vue'

/** Firmadan alınan ödemeler (elden, havale): liste ve yeni kayıt. Dönem seçilirse ödeme o döneme bağlanır. */
const { tenant } = defineProps<{ tenant: TenantDetail }>()
const { recordPayment, isBusy } = useTenantActions(() => tenant.summary.id)
const recording = ref(false)
const form = ref(emptyPayment())
const periodId = ref<string | undefined>()
const asPayment = (row: unknown) => row as PaymentView
const periodName = (id: string | null | undefined) => {
  const period = tenant.subscriptions.find((candidate) => candidate.id === id)
  return period ? `${period.planName} · ${dayWithYear(period.startsOn)}` : '—'
}

function start() {
  form.value = emptyPayment(tenant.subscriptions.find((p) => p.id === tenant.currentSubscriptionId)?.priceSnapshot ?? 0)
  periodId.value = tenant.currentSubscriptionId ?? undefined
  recording.value = true
}

async function submit() {
  if (isBusy.value) return
  const request = paymentRequestOf({ ...form.value, paid: true }, periodId.value)
  if (!request) return ElMessage.warning('Tutar sıfırdan büyük olmalı.')
  try {
    await recordPayment(request)
    recording.value = false
    ElMessage.success('Ödeme kaydedildi.')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <div class="payments">
    <div class="payments__head">
      <span>Toplam {{ formatMoney(tenant.payments.reduce((sum, payment) => sum + payment.amount, 0)) }}</span>
      <el-button type="primary" @click="start"><Banknote :size="16" /> Ödeme kaydet</el-button>
    </div>
    <el-table :data="tenant.payments" empty-text="Henüz ödeme yok">
      <el-table-column label="Tarih" width="130"><template #default="{ row }">{{ dayWithYear(asPayment(row).paidOn) }}</template></el-table-column>
      <el-table-column label="Tutar" width="130"><template #default="{ row }"><b>{{ formatMoney(asPayment(row).amount) }}</b></template></el-table-column>
      <el-table-column label="Yöntem" width="140"><template #default="{ row }">{{ PAYMENT_METHODS[asPayment(row).method] }}</template></el-table-column>
      <el-table-column label="Dönem"><template #default="{ row }">{{ periodName(asPayment(row).subscriptionId) }}</template></el-table-column>
      <el-table-column label="Not" prop="description" />
      <el-table-column label="Kaydeden" prop="createdByName" width="160" />
    </el-table>
    <el-dialog v-model="recording" title="Ödeme kaydet" width="560px">
      <el-form label-position="top" @submit.prevent="submit">
        <el-form-item label="Dönem">
          <el-select v-model="periodId" clearable placeholder="Döneme bağlama">
            <el-option v-for="period in tenant.subscriptions" :key="period.id" :value="period.id"
              :label="`${period.planName} · ${dayWithYear(period.startsOn)} – ${dayWithYear(period.endsOn)}`" />
          </el-select>
        </el-form-item>
        <PaymentFields v-model="form" :optional="false" />
      </el-form>
      <template #footer>
        <el-button @click="recording = false">Vazgeç</el-button>
        <el-button type="primary" :loading="isBusy" @click="submit">Kaydet</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.payments {
  display: grid;
  gap: var(--space-4);
}

.payments__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
}

.payments__head :deep(.el-button svg) {
  margin-right: var(--space-1);
}
</style>
