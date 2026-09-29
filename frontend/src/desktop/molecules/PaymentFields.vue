<script setup lang="ts">
import type { PaymentForm } from '@/core/admin/paymentForm'
import { PAYMENT_METHODS } from '@/core/billing/billingLabels'

/** Alınan ödeme: "Ödeme alındı" açıksa tutar, yöntem, tarih ve not. POS yok; para elden ya da havaleyle alınır. */
const payment = defineModel<PaymentForm>({ required: true })
</script>

<template>
  <div class="payment-fields">
    <el-form-item label="Ödeme">
      <el-switch v-model="payment.paid" active-text="Ödeme alındı, şimdi kaydet" inactive-text="Ödeme sonra" />
    </el-form-item>
    <template v-if="payment.paid">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Tutar (₺)">
            <el-input-number v-model="payment.amount" :min="0" :step="100" :precision="2" controls-position="right"
              class="payment-fields__amount" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Ödeme tarihi">
            <el-date-picker v-model="payment.paidOn" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY"
              :clearable="false" class="payment-fields__date" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Yöntem">
        <el-radio-group v-model="payment.method">
          <el-radio-button v-for="(label, key) in PAYMENT_METHODS" :key="key" :value="key">{{ label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Not">
        <el-input v-model="payment.description" maxlength="300" placeholder="ör. Elden alındı, makbuz no 12" />
      </el-form-item>
    </template>
  </div>
</template>

<style scoped>
.payment-fields__amount,
.payment-fields__date {
  width: 100%;
}
</style>
