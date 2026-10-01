<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { TenantDetail } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { emptyPayment, paymentRequestOf } from '@/core/admin/paymentForm'
import { suggestedAmount } from '@/core/admin/tenantForm'
import { useActivePlans } from '@/core/admin/useActivePlans'
import { useTenantActions } from '@/core/admin/useTenantActions'
import { fullDate } from '@/core/format/dates'
import PaymentFields from '@/desktop/molecules/PaymentFields.vue'
import PlanChoice from '@/desktop/molecules/PlanChoice.vue'

/**
 * Aboneliği başlat ya da uzat: yeni dönem. Açık dönem varsa yeni dönem onun bitişinin ertesi günü başlar (kalan günler
 * yanmaz); yoksa seçilen günden. Ödeme alındıysa aynı işlemde bu döneme kaydedilir.
 */
const { tenant } = defineProps<{ tenant: TenantDetail }>()
const show = defineModel<boolean>('show', { required: true })
const plans = useActivePlans()
const { extend, isBusy } = useTenantActions(() => tenant.summary.id)
const currentPlanId = () => tenant.subscriptions.find((period) => period.id === tenant.currentSubscriptionId)?.planId
const form = ref({ planId: '', months: 1, note: '', payment: emptyPayment() })

watch(show, (open) => open && (form.value = { planId: currentPlanId() ?? plans.value[0]?.id ?? '', months: 1, note: '', payment: emptyPayment() }))
watch(() => [form.value.planId, form.value.months], () => {
  form.value.payment.amount = suggestedAmount(plans.value, form.value.planId, form.value.months)
})

async function submit() {
  if (isBusy.value) return
  try {
    const { planId, months, note, payment } = form.value
    await extend({ planId, months, note: note || null, payment: paymentRequestOf(payment) })
    show.value = false
    ElMessage.success('Yeni dönem eklendi.')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog v-model="show" :title="`Abonelik: ${tenant.summary.name}`" width="640px">
    <el-form label-position="top" @submit.prevent="submit">
      <el-alert v-if="tenant.summary.open && tenant.summary.endsOn" type="info" :closable="false" show-icon
        class="extend__notice" :title="`Açık dönem ${fullDate(tenant.summary.endsOn)} tarihinde bitiyor; yeni dönem ertesi gün başlar.`" />
      <PlanChoice v-model:plan-id="form.planId" v-model:months="form.months" :plans="plans" />
      <el-form-item label="Not"><el-input v-model="form.note" maxlength="300" placeholder="ör. 3 aylık peşin" /></el-form-item>
      <el-divider content-position="left">Ödeme</el-divider>
      <PaymentFields v-model="form.payment" />
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="isBusy" @click="submit">Dönemi ekle</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.extend__notice {
  margin-block-end: var(--space-4);
}
</style>
