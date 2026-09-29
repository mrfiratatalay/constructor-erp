<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import type { TenantDetail } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { MONTH_CHOICES } from '@/core/admin/adminLabels'
import { emptyPayment, paymentRequestOf } from '@/core/admin/paymentForm'
import { suggestedAmount } from '@/core/admin/tenantForm'
import { useActivePlans } from '@/core/admin/useActivePlans'
import { useTenantActions } from '@/core/admin/useTenantActions'
import ChoiceChips from '@/mobile/molecules/ChoiceChips.vue'
import PaymentFieldCells from '@/mobile/molecules/PaymentFieldCells.vue'

/** Aboneliği uzat telefonda: paket, süre ve (alındıysa) ödeme; açık dönem varsa yeni dönem ertesi gün başlar. */
const { tenant } = defineProps<{ tenant: TenantDetail }>()
const show = defineModel<boolean>('show', { required: true })
const plans = useActivePlans()
const { extend } = useTenantActions(() => tenant.summary.id)
const planOptions = computed(() => plans.value.map((plan) => ({ value: plan.id, label: plan.name })))
const monthOptions = MONTH_CHOICES.map((value) => ({ value: String(value), label: `${value} ay` }))
const form = ref({ planId: '', months: '1', payment: emptyPayment() })

watch(show, (open) => {
  const current = tenant.subscriptions.find((period) => period.id === tenant.currentSubscriptionId)
  if (open) form.value = { planId: current?.planId ?? plans.value[0]?.id ?? '', months: '1', payment: emptyPayment() }
})
watch(() => [form.value.planId, form.value.months], () => {
  form.value.payment.amount = suggestedAmount(plans.value, form.value.planId, Number(form.value.months))
})

async function submit() {
  try {
    const { planId, months, payment } = form.value
    await extend({ planId, months: Number(months), payment: paymentRequestOf(payment) })
    show.value = false
    showSuccessToast('Yeni dönem eklendi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable safe-area-inset-bottom>
    <div class="extend">
      <h3>Aboneliği uzat</h3>
      <van-cell-group inset>
        <van-field label="Paket"><template #input><ChoiceChips v-model="form.planId" :options="planOptions" /></template></van-field>
        <van-field label="Süre"><template #input><ChoiceChips v-model="form.months" :options="monthOptions" /></template></van-field>
        <PaymentFieldCells v-model="form.payment" />
      </van-cell-group>
      <van-button type="primary" block round @click="submit">Dönemi ekle</van-button>
    </div>
  </van-popup>
</template>

<style scoped>
.extend {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5) 0 var(--space-4);
}

.extend h3 {
  margin: 0;
  padding: 0 var(--space-5);
}

.extend > .van-button {
  width: auto;
  margin: 0 var(--space-4);
}
</style>
