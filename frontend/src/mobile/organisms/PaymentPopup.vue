<script setup lang="ts">
import { ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import type { TenantDetail } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { emptyPayment, paymentRequestOf } from '@/core/admin/paymentForm'
import { useTenantActions } from '@/core/admin/useTenantActions'
import PaymentFieldCells from '@/mobile/molecules/PaymentFieldCells.vue'

/** Ödeme kaydet telefonda: bugünkü döneme bağlanır. */
const { tenant } = defineProps<{ tenant: TenantDetail }>()
const show = defineModel<boolean>('show', { required: true })
const { recordPayment, isBusy } = useTenantActions(() => tenant.summary.id)
const form = ref(emptyPayment())

watch(show, (open) => {
  const current = tenant.subscriptions.find((period) => period.id === tenant.currentSubscriptionId)
  if (open) form.value = emptyPayment(current?.priceSnapshot ?? 0)
})

async function submit() {
  if (isBusy.value) return
  const request = paymentRequestOf({ ...form.value, paid: true }, tenant.currentSubscriptionId ?? undefined)
  if (!request) return showFailToast('Tutar sıfırdan büyük olmalı')
  try {
    await recordPayment(request)
    show.value = false
    showSuccessToast('Ödeme kaydedildi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable safe-area-inset-bottom>
    <div class="payment">
      <h3>Ödeme kaydet</h3>
      <van-cell-group inset><PaymentFieldCells v-model="form" :optional="false" /></van-cell-group>
      <van-button type="primary" block round :loading="isBusy" @click="submit">Kaydet</van-button>
    </div>
  </van-popup>
</template>

<style scoped>
.payment {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5) 0 var(--space-4);
}

.payment h3 {
  margin: 0;
  padding: 0 var(--space-5);
}

.payment > .van-button {
  width: auto;
  margin: 0 var(--space-4);
}
</style>
