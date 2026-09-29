<script setup lang="ts">
import type { PaymentForm } from '@/core/admin/paymentForm'
import { PAYMENT_METHODS } from '@/core/billing/billingLabels'
import ChoiceChips from '@/mobile/molecules/ChoiceChips.vue'
import DateField from '@/mobile/molecules/DateField.vue'

/** Alınan ödeme telefonda: tutar, yöntem, tarih, not. optional: "Ödeme alındı" anahtarı görünür (dönem uzatırken). */
const { optional = true } = defineProps<{ optional?: boolean }>()
const payment = defineModel<PaymentForm>({ required: true })
const METHODS = Object.entries(PAYMENT_METHODS).map(([value, label]) => ({ value, label }))
</script>

<template>
  <van-cell v-if="optional" center title="Ödeme alındı">
    <template #right-icon><van-switch v-model="payment.paid" size="22" /></template>
  </van-cell>
  <template v-if="payment.paid || !optional">
    <van-field v-model.number="payment.amount" type="number" label="Tutar (₺)" input-align="right" />
    <van-field label="Yöntem">
      <template #input>
        <ChoiceChips :model-value="payment.method" :options="METHODS"
          @update:model-value="(method) => method && (payment.method = method as PaymentForm['method'])" />
      </template>
    </van-field>
    <DateField v-model="payment.paidOn" label="Tarih" />
    <van-field v-model="payment.description" label="Not" placeholder="ör. Elden alındı" maxlength="300" />
  </template>
</template>
